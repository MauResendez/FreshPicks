import functions = require('firebase-functions');
import admin = require('firebase-admin');
import vision = require('@google-cloud/vision');
import { Expo, ExpoPushMessage } from 'expo-server-sdk';

admin.initializeApp();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

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

export const checkIfImageIsAppropriate = functions.https.onCall(async (data: { image: any; }, context: any) => {
  const image = data.image;
  const buffer = Buffer.from(image, 'base64');

  try {
		// Check the image content using the Cloud Vision API.
		const visionClient = new vision.ImageAnnotatorClient();

		const [data] = await visionClient.safeSearchDetection(buffer);

		const safeSearchResult = data.safeSearchAnnotation!;
		
		functions.logger.log(`SafeSearch results on image "${buffer}"`, safeSearchResult);

		functions.logger.log(`Adult: ${safeSearchResult.adult}`);
		functions.logger.log(`Spoof: ${safeSearchResult.spoof}`);
		functions.logger.log(`Medical: ${safeSearchResult.medical}`);
		functions.logger.log(`Violence: ${safeSearchResult.violence}`);
		functions.logger.log(`Racy: ${safeSearchResult.racy}`);

		// Tune these detection likelihoods to suit your app.
		// The current settings show the most strict configuration
		// Available likelihoods are defined in https://cloud.google.com/vision/docs/reference/rest/v1/AnnotateImageResponse#likelihood
		if (
			(safeSearchResult.adult !== 'VERY_UNLIKELY' && safeSearchResult.adult !== 'UNLIKELY' && safeSearchResult.adult !== 'POSSIBLE') ||
			(safeSearchResult.spoof !== 'VERY_UNLIKELY' && safeSearchResult.spoof !== 'UNLIKELY') ||
			(safeSearchResult.violence !== 'VERY_UNLIKELY' && safeSearchResult.violence !== 'UNLIKELY')
		) {
			functions.logger.log('Offensive image found.');
			functions.logger.log(safeSearchResult.adult !== 'VERY_UNLIKELY' && safeSearchResult.adult !== 'UNLIKELY' && safeSearchResult.adult !== 'POSSIBLE');
			functions.logger.log(safeSearchResult.spoof !== 'VERY_UNLIKELY' && safeSearchResult.spoof !== 'UNLIKELY');
			functions.logger.log(safeSearchResult.violence !== 'VERY_UNLIKELY' && safeSearchResult.violence !== 'UNLIKELY');

			return false;
		}

		return true;
	} catch (error) {
		functions.logger.log('Error: ${error}');
		return false;
	}
});

export const createMeeting = functions.firestore.document('Meetings/{meetingId}').onCreate(async (snapshot: any) => {
  try {
    const meeting = snapshot.data();
    const expo = new Expo();
    const consumer = meeting.consumer;
    const farmer = meeting.farmer;

    const consumerDoc = await admin.firestore().doc(`/Users/${consumer}`).get();
    const farmerDoc = await admin.firestore().doc(`/Users/${farmer}`).get();

    functions.logger.info("Consumer: ", consumerDoc);
    functions.logger.info("Farmer: ", farmerDoc);

    const consumerTokens = consumerDoc.get('token');
    const farmerTokens = farmerDoc.get('token');

    consumerTokens.forEach(async (token: any) => {
      try {
        functions.logger.info("Token: ", token);

        const message: ExpoPushMessage = {
          to: token,
          sound: 'default',
          title: "Your order request has been sent to the farmer!",
          body: `${farmerDoc.get("business")} will respond to you in 24 hours with a scheduled date to go to purchase your order.`
        };

        await expo.sendPushNotificationsAsync([message]);
      } catch (error) {
        functions.logger.error("Error sending notification to devices: ", error);
        return;
      }
    });

    farmerTokens.forEach(async (token: any) => {
      try {
        functions.logger.info("Token: ", token);

        const message: ExpoPushMessage = {
          to: token,
          sound: 'default',
          title: "A new meeting request has been received!",
          body: `${consumerDoc.get("name")} has sent a meeting request to purchase an order and is currently waiting for your response. You have 24 hours to respond.`
        };

        await expo.sendPushNotificationsAsync([message]);
      } catch (error) {
        functions.logger.error("Error sending notification to devices: ", error);
        return;
      }
    });
  } catch (error) {
    functions.logger.error("Error getting snapshot data: ", error);
    return;
  }
});

export const deleteMeetings = functions.pubsub.schedule('every 24 hours').onRun(async (context: any) => {
  const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
  const querySnapshot = await admin.firestore().collection('Meetings').where('status', '==', 'PENDING').where('createdAt', '<=', cutoffDate).get();

  querySnapshot.forEach(async (docSnapshot: { data: () => any; id: any; }) => {
    const docData = docSnapshot.data();
    const updatedAt = docData.updatedAt.toDate();
    if (updatedAt <= cutoffDate) {
      await admin.firestore().collection('Meetings').doc(docSnapshot.id).delete();
      console.log(`Deleted document ${docSnapshot.id}`);
    } else {
      console.log(`Skipping document ${docSnapshot.id} because its status has changed`);
    }
  });
});

export const sendMessage = functions.https.onRequest(async (req, res) => {
  const expo = new Expo();
  const body = req.body.message;
	const sender = req.body.sender;
	const tokens = req.body.tokens;

  tokens.forEach(async (token: any) => {
    try {
      functions.logger.info("Token: ", token);

      const message: ExpoPushMessage = {
        to: token,
        sound: 'default',
        title: sender,
        body: body
      };

      await expo.sendPushNotificationsAsync([message]);
    } catch (error) {
      functions.logger.error("Error sending notification to devices: ", error);
      return;
    }
  });
});