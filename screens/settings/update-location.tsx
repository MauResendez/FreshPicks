import { useNavigation } from '@react-navigation/native';
import { GeoPoint, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Keyboard, Platform, TouchableWithoutFeedback } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Button, Colors, KeyboardAwareScrollView, LoaderScreen, Text, View } from 'react-native-ui-lib';
import * as Yup from 'yup';
import { auth, db } from '../../firebase';
import { global } from '../../style';

const UploadLocation = () => {
	const navigation = useNavigation<any>();
  const [coordinates, setCoordinates] = useState({ latitude: 26.212379, longitude: -98.318153 });
	const [region, setRegion] = useState(null);
	const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<any>(true);

	useEffect(() => {
    if (coordinates) {
      setRegion({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [coordinates]);

	const onSubmit = async (values) => {
    await updateDoc(doc(db, "Users", auth.currentUser.uid), {
      address: values.address,
      location: values.location,
    })
    .then(() => {
      navigation.navigate("Settings");
    })
    .catch((error) => {
      console.log(error);
    });
  };

  useEffect(() => {
    getDoc(doc(db, "Users", auth.currentUser.uid)).then((docSnapshot) => {
      const data = docSnapshot.data();
      setUser(data);
    });
  }, []);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }

  const validate = Yup.object().shape({ 
    address: Yup.string().required("Address is required"), 
    location: Yup.object().required("Location is required"),
  });

  return (
		<View useSafeArea flex>
      <TouchableWithoutFeedback style={global.flex} onPress={Platform.OS !== "web" && Keyboard.dismiss}>
				<Formik 
					enableReinitialize={true}
					initialValues={{ address: user.address, location: user.location } || { address: "", location: "" }}
					onSubmit={onSubmit}
					validationSchema={validate}
				>
					{({ errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values }) => (
						// <MapView
						// 	style={global.flex}
						// 	region={region}
						// 	moveOnMarkerPress={true}
						// 	mapType={"standard"}
						// 	showsTraffic
						// >
						// 	<View style={global.container}>
						// 		<GooglePlacesAutocomplete
						// 			textInputProps={{
						// 				onChange(text) {
						// 					setFieldValue('address', text);
						// 					setFieldValue('location', null);
						// 				},
						// 				autoCapitalize: "none",
						// 				autoCorrect: false,
						// 				value: values.address
						// 			}}
						// 			styles={{
						// 				textInput: {
						// 					height: 50,
						// 					width: "100%",
						// 					borderWidth: 1,
						// 					borderColor: "rgba(0, 0, 0, 0.2)",
						// 					borderRadius: 8,
						// 					paddingHorizontal: 8,
						// 					backgroundColor: Colors.white,
						// 				}
						// 			}}
						// 			onPress={(data, details) => {
						// 				if (!data || !details) return;

						// 				const geopoint = new GeoPoint(details.geometry.location.lat, details.geometry.location.lng);
								
						// 				setFieldValue('address', data.description);
						// 				setFieldValue('location', geopoint);

						// 				const { lat, lng } = details.geometry.location;
						// 				setCoordinates({ latitude: lat, longitude: lng });
						// 			}}
						// 			fetchDetails={true}
						// 			minLength={4}
						// 			enablePoweredByContainer={false}
						// 			placeholder="Enter your address here"
						// 			debounce={1000}
						// 			nearbyPlacesAPI="GooglePlacesSearch"
						// 			keepResultsAfterBlur={true}
						// 			query={{
						// 				key: "AIzaSyDyXlBNmFl5OTBrrc8YyGRyPoEnoi3fMTc",
						// 				language: "en",
						// 			}}
						// 			requestUrl={{
						// 				url: "https://proxy-jfnvyeyyea-uc.a.run.app/https://maps.googleapis.com/maps/api",
						// 				useOnPlatform: "web"
						// 			}}
						// 		/>
						// 		<Marker coordinate={coordinates} />
						// 	</View>

						// 	<View flexG />

						// 	<View style={global.container}>
						// 		<Button 
						// 			backgroundColor={Colors.primary}
						// 			color={Colors.white}
						// 			label={"Update Farmer Location"} 
						// 			labelStyle={{ fontWeight: '600', padding: 8 }} 
						// 			style={global.btnTest} 
						// 			onPress={() => handleSubmit()}                
						// 		/>
						// 	</View>
						// </MapView>
						<KeyboardAwareScrollView contentContainerStyle={[global.container, global.flex]} keyboardShouldPersistTaps="always">
							<Text text65 marginV-4>Business Address *</Text>
							<GooglePlacesAutocomplete
								textInputProps={{
									onChange(text) {
										setFieldValue('address', text);
										setFieldValue('location', null);
									},
									autoCapitalize: "none",
									autoCorrect: false,
									value: values.address
								}}
								styles={{
									textInput: {
										height: 50,
										width: "100%",
										borderWidth: 1,
										borderColor: "rgba(0, 0, 0, 0.2)",
										borderRadius: 8,
										paddingHorizontal: 8,
										backgroundColor: Colors.white,
									}
								}}
								onPress={(data, details) => {
									if (!data || !details) return;

									const geopoint = new GeoPoint(details.geometry.location.lat, details.geometry.location.lng);
							
									setFieldValue('address', data.description);
									setFieldValue('location', geopoint);

									const { lat, lng } = details.geometry.location;
									setCoordinates({ latitude: lat, longitude: lng });
								}}
								fetchDetails={true}
								minLength={4}
								enablePoweredByContainer={false}
								placeholder="Enter your address here"
								debounce={1000}
								nearbyPlacesAPI="GooglePlacesSearch"
								keepResultsAfterBlur={true}
								query={{
									key: "AIzaSyDyXlBNmFl5OTBrrc8YyGRyPoEnoi3fMTc",
									language: "en",
								}}
								requestUrl={{
									url: "https://proxy-jfnvyeyyea-uc.a.run.app/https://maps.googleapis.com/maps/api",
									useOnPlatform: "web"
								}}
							/>

							<Button 
								backgroundColor={Colors.primary}
								color={Colors.white}
								label={"Update Farmer Location"} 
								labelStyle={{ fontWeight: '600', padding: 8 }} 
								style={global.btnTest} 
								onPress={() => handleSubmit()}
								disabled={!values.location}
							/>
						</KeyboardAwareScrollView>
					)}
				</Formik>
			</TouchableWithoutFeedback>
		</View>
  );
};

export default UploadLocation;