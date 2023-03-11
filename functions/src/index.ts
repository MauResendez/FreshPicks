import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp();

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

export const deletePendingOrdersTest = functions.pubsub.schedule('every 1 hours').onRun(async (context: any) => {
  const cutoffDate = new Date(Date.now() - 1 * 60 * 60 * 1000); // 24 hours ago
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
