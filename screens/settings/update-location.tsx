import { GeoPoint } from 'firebase/firestore';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker } from 'react-native-maps';
import { Button, Colors, View } from 'react-native-ui-lib';
import { global } from '../../style';

const UploadLocation = () => {
  const [coordinates, setCoordinates] = useState({ latitude: 26.212379, longitude: -98.318153 });
	const [region, setRegion] = useState(null);

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

  return (
		<View useSafeArea flex>
      <TouchableWithoutFeedback style={global.flex} onPress={Platform.OS !== "web" && Keyboard.dismiss}>
        <KeyboardAvoidingView style={global.flex} behavior={Platform.OS == "ios" ? "padding" : "height"}>
          <Formik 
            initialValues={{ address: "", location: "" }} 
            onSubmit={() => {}}
          >
            {({ errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values }) => (
							<MapView
								style={global.flex}
								region={region}
								moveOnMarkerPress={true}
								mapType={"standard"}
								showsTraffic
							>
								<View style={global.container}>
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
												backgroundColor: "white",
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
									<Marker coordinate={coordinates} />
								</View>

								<View flexG />

								<View style={global.container}>
									<Button 
										backgroundColor={"#ff4500"}
										color={Colors.white}
										label={"Update Farmer Location"} 
										labelStyle={{ fontWeight: '600', padding: 8 }} 
										style={global.btnTest} 
										onPress={() => handleSubmit()}                
									/>
								</View>
							</MapView>
						)}
					</Formik>
				</KeyboardAvoidingView>
			</TouchableWithoutFeedback>
		</View>
  );
};

export default UploadLocation;