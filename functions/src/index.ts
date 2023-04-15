import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp();

// Vision API
const vision = require('@google-cloud/vision');

// Firestore
const db = admin.firestore();
const batch = db.batch();

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

export const sendMessage = functions.https.onCall(async (data, context) => {
	const message = data.message;
	const sender = data.sender;
	const token = data.token;

	const payload = {
		notification: {
			title: sender,
			body: message,
		},
	};

	functions.logger.info("Message: ", message);
	functions.logger.info("Sender name: ", sender);
	functions.logger.info("Token: ", token);

	try {
		await admin.messaging().sendToDevice(token, payload).then((response) => {
			functions.logger.info("Notification sent to device");
			functions.logger.info(response.results);
		});
	} catch (error) {
		functions.logger.error("Error sending notification to devices: ", error);
	}
});

export const sendOrder = functions.database.ref('Orders/{orderId}').onCreate(async (snapshot, context) => {
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

export const checkIfImageIsAppropriate = functions.https.onRequest(async (req, res) => {
	try {
		const image = req.body.image;
		const buffer = Buffer.from(image, 'base64');

		// Check the image content using the Cloud Vision API.
		const visionClient = new vision.ImageAnnotatorClient();

		const [result] = await visionClient.faceDetection(buffer);

		const faces = result.faceAnnotations;

		functions.logger.log(`Faces:`, faces.length);
		functions.logger.log("TEST");

		if (faces.length == 0) {
			res.status(200).send({ selfie: false, appropriate: false });
			return;
		}

		const [data] = await visionClient.safeSearchDetection(buffer);

		const safeSearchResult = data.safeSearchAnnotation;
		
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

			res.status(200).send({ selfie: true, appropriate: false });
			return;
		}

		res.status(200).send({ selfie: true, appropriate: true });
		return;
	} catch (error) {
		functions.logger.log('Error: ${error}');
		return;
	}
});

export const checkIfPhoneWasReported = functions.https.onRequest(async (req, res) => {
  const phoneNumber = req.body.phoneNumber;		

	functions.logger.info(`Phone Number: ${phoneNumber}`);

	db.collection("Reports").where("phone", "==", phoneNumber).get().then((reportDocs) => {
		functions.logger.info(`Report Docs Count: ${reportDocs.size}`);

		return res.status(200).send({ reported: reportDocs.size >= 2 });
	});
});

export const deleteAccount = functions.https.onCall(async (data, context) => {
	const uid = context.auth!.uid;

	await admin.auth().revokeRefreshTokens(uid);

	try {
		// Delete documents where the document id matches the user's uid
		const userDoc = db.collection('Users').doc(uid);

		functions.logger.info(`User: ${userDoc}`);

		if (userDoc) {
			// await userDocRef.delete();
			batch.delete(userDoc);
		}
	} catch (error) {
		functions.logger.error(error);
		return;
	}

	try {
		// Delete chats where the user's uid is inside an array of users
		const chats = await db.collection('Chats').get();

		chats.forEach((doc) => {
			const data = doc.data();
	
			if (data.consumer === uid || data.farmer === uid) {
        functions.logger.info(`Chat: ${doc}`);
				batch.delete(doc.ref);
			}
		});
	} catch (error) {
		functions.logger.error(error);
		return;
	}
  
	try {
		// Remove user where the user's uid is inside an array of rsvps
		const events = await db.collection('events').get();

		events.forEach(async (doc) => {
			// Make a copy of the rsvps array of maps from the document
			const rsvps = doc.data().rsvps.slice();
	
			// Modify the copy of the array to remove the element that you want to delete
			const rsvp_index = rsvps.findIndex((item: { gender: string, user_id: string }) => item.user_id === uid);
	
			if (rsvp_index !== -1) {
				rsvps.splice(rsvp_index, 1);
			}
	
			// Update the document with the modified copy of the array
			// await doc.ref.update({ rsvps: rsvps });

			batch.update(doc.ref, { rsvps: rsvps });
		});
	} catch (error) {
		functions.logger.error(error);
		return;
	}
  
	try {
		// Delete all image files associated with this user
		const bucket = admin.storage().bucket();

		const [files] = await bucket.getFiles({
			prefix: `users/${uid}/`,
		});
	
		await Promise.all(
			files.map((file) => {
				functions.logger.info(file.name);
				return file.delete();
			})
		);
	} catch (error) {
		functions.logger.error(error);
		return;
	}

	await admin.auth().deleteUser(uid);
	
	return batch.commit()
});