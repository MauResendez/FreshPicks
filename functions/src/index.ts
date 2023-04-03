import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp();

// Node.js core modules
const fs = require('fs');
const mkdirp = fs.promises.mkdir;
const {promisify} = require('util');
const exec = promisify(require('child_process').exec);
const path = require('path');
const os = require('os');

// Vision API
const vision = require('@google-cloud/vision');

// Where we'll save blurred images
const BLURRED_FOLDER = 'blurred';

/**
 * Blurs the given image located in the given bucket using ImageMagick.
 */
async function blurImage(filePath: string, bucketName: string, metadata: { [key: string]: string; }) {
  const tempLocalFile = path.join(os.tmpdir(), filePath);
  const tempLocalDir = path.dirname(tempLocalFile);
  const bucket = admin.storage().bucket(bucketName);

  // Create the temp directory where the storage file will be downloaded.
  await mkdirp(tempLocalDir, { recursive: true });
  functions.logger.log('Temporary directory has been created', tempLocalDir);

  // Download file from bucket.
  await bucket.file(filePath).download({ destination: tempLocalFile });
  functions.logger.log('The file has been downloaded to', tempLocalFile);

  // Blur the image using ImageMagick.
  await exec(`convert "${tempLocalFile}" -channel RGBA -blur 0x8 "${tempLocalFile}"`);
  functions.logger.log('Blurred image created at', tempLocalFile);

  // Uploading the Blurred image.
  await bucket.upload(tempLocalFile, {
    destination: `${BLURRED_FOLDER}/${filePath}`,
    metadata: {metadata: metadata}, // Keeping custom metadata.
  });
  functions.logger.log('Blurred image uploaded to Storage at', filePath);

  // Clean up the local file
  fs.unlinkSync(tempLocalFile);
  functions.logger.log('Deleted local file', filePath);
}

export const blurOffensiveImages = functions.storage.object().onFinalize(async (object: any) => {
  // Ignore things we've already blurred
  if (object.name.startsWith(`${BLURRED_FOLDER}/`)) {
    functions.logger.log(`Ignoring upload "${object.name}" because it was already blurred.`);
    return null;
  }
  
  // Check the image content using the Cloud Vision API.
  const visionClient = new vision.ImageAnnotatorClient();
  const data = await visionClient.safeSearchDetection(
    `gs://${object.bucket}/${object.name}`
  );
  const safeSearchResult = data[0].safeSearchAnnotation;
  functions.logger.log(`SafeSearch results on image "${object.name}"`, safeSearchResult);

  // Tune these detection likelihoods to suit your app.
  // The current settings show the most strict configuration
  // Available likelihoods are defined in https://cloud.google.com/vision/docs/reference/rest/v1/AnnotateImageResponse#likelihood
  if (
    safeSearchResult.adult !== 'VERY_UNLIKELY' ||
    safeSearchResult.spoof !== 'VERY_UNLIKELY' ||
    safeSearchResult.medical !== 'VERY_UNLIKELY' ||
    safeSearchResult.violence !== 'VERY_UNLIKELY' ||
    safeSearchResult.racy !== 'VERY_UNLIKELY'
  ) {
    functions.logger.log('Offensive image found. Blurring.');
    return blurImage(object.name, object.bucket, object.metadata);
  }

  return null;
});

export const checkIfUserExists = functions.https.onCall((data: { phoneNumber: any; }, context: any) => {
  const phoneNumber = data.phoneNumber;
  return admin.auth().getUserByPhoneNumber(phoneNumber)
    .then((userRecord: { uid: any; }) => {
      return {
        exists: true,
        uid: userRecord.uid,
      };
    })
    .catch((error: { code: string; }) => {
      if (error.code === 'auth/user-not-found') {
        return {
          exists: false,
        };
      } else {
        throw error;
      }
    });
});

export const deletePendingOrders = functions.pubsub.schedule('every 24 hours').onRun(async (context: any) => {
  const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
  const querySnapshot = await admin.firestore().collection('Orders').where('status', '==', 'PENDING').where('createdAt', '<=', cutoffDate).get();

  querySnapshot.forEach(async (docSnapshot: { data: () => any; id: any; }) => {
    const docData = docSnapshot.data();
    const updatedAt = docData.updatedAt.toDate();
    if (updatedAt <= cutoffDate) {
      await admin.firestore().collection('Orders').doc(docSnapshot.id).delete();
      console.log(`Deleted document ${docSnapshot.id}`);
    } else {
      console.log(`Skipping document ${docSnapshot.id} because its status has changed`);
    }
  });
});

// export const detectInappropriateImages = functions.storage.object().onFinalize(async (object) => {
//   const bucket = admin.storage().bucket(object.bucket);
//   const file = bucket.file(object.name as string);

//   const visionClient = new vision.ImageAnnotatorClient();
//   const [result] = await visionClient.safeSearchDetection(`gs://${bucket.name}/${file.name}`);
//   const detections = result.safeSearchAnnotation;

//   if (detections.adult === "VERY_LIKELY" ||
//       detections.violence === "VERY_LIKELY" ||
//       detections.racy === "VERY_LIKELY") {
//     await file.delete();
//     console.log(`The image ${object.name} has been deleted because it is inappropriate`);
//   }
// });

export const sendMessagePushNotification = functions.database.ref('Chats/{chatId}/messages/{messageId}').onCreate(async (snapshot, context) => {
  const message = snapshot.val();
  const senderId = message.user.id;
  const senderName = message.user.name;

  const recipientId = message.recipientId;
  const recipientToken = await admin.database().ref(`/Users/${recipientId}/token`).once('value');

  
  const payload = {
    notification: {
      title: `${senderName} sent you a new message`,
      body: message.text,
      sound: 'default',
      badge: '1'
    }
  };
  
  return admin.messaging().sendToDevice(recipientToken as unknown as string, payload);
});

export const sendOrderPushNotification = functions.database.ref('Chats/{chatId}/messages/{messageId}').onCreate(async (snapshot, context) => {
  const message = snapshot.val();
  const senderName = message.user.name;
  const recipientId = message.recipientId;
  const recipientToken = await admin.database().ref(`/Users/${recipientId}/token`).once('value');
  
  const payload = {
    notification: {
      title: `${senderName} sent you a new message`,
      body: message.text,
      sound: 'default',
      badge: '1'
    }
  };
  
  return admin.messaging().sendToDevice(recipientToken as unknown as string, payload);
});

export const signOutAllUsers = functions.https.onCall((data: any, context: any) => {
  // Get the list of all active users
  return admin.auth().listUsers().then((users: { users: any[]; }) => {
    // Get the user"s token and sign them out
    const promises = users.users.map((user: { uid: any; }) => admin.auth().revokeRefreshTokens(user.uid));
    return Promise.all(promises).then(() => {
      console.log(`Signed out ${promises.length} users`);
      return {message: `Signed out ${promises.length} users`};
    });
  });
});
