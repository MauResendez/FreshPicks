import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { GooglePlaceData, GooglePlaceDetail, GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Text, TextField, View } from 'react-native-ui-lib';
import { global } from '../../style';

const UpdatePersonal = () => {
  const [name, setName] = useState<any>(null);
  const [email, setEmail] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const [coordinates, setCoordinates] = useState<any>(null);
  
  const handleKeyPress = (data: GooglePlaceData, details: GooglePlaceDetail | null) => {
    if (!data || !details) return;

    setAddress(data.description);
    setCoordinates(details.geometry.location);
  };

  return (
    <View useSafeArea flex>
      <TouchableWithoutFeedback onPress={Platform.OS !== "web" && Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          style={global.container}
        >
          <Text title>Personal Information</Text>

          <View style={global.field}>
            <Text subtitle>Full Name *</Text>
            <TextField style={global.input} value={name} onChangeText={(value) => setName(value)} autoComplete="name" placeholder="Enter your full name" migrate validate={'required'} />
          </View>

          <View style={global.field}>
            <Text subtitle>Email *</Text>
            <TextField style={global.input} value={email} onChangeText={(value) => setEmail(value)} autoComplete="email" placeholder="Enter your email address" migrate validate={'required'} />
          </View>

          <ScrollView style={global.field} contentContainerStyle={global.flex}>
            <Text subtitle>Address</Text>
            <GooglePlacesAutocomplete
              textInputProps={{
                onSelectionChange(text) {
                  setAddress(text);
                  console.log(text);
                },
                autoCapitalize: "none",
                autoCorrect: false,
                value: address
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
                  marginBottom: 16
                }
              }}
              onPress={(data, details) => handleKeyPress(data, details)}
              fetchDetails
              minLength={4}
              enablePoweredByContainer={false}
              placeholder="Enter your address here"
              debounce={1000}
              nearbyPlacesAPI="GooglePlacesSearch"
              keepResultsAfterBlur={true}
              query={{
                key: "AIzaSyDdDiIwvLlEcpjOK3DVEmbO-ydkrMOS1cM",
                language: "en",
              }}
              requestUrl={{
                url: "https://proxy-jfnvyeyyea-uc.a.run.app/https://maps.googleapis.com/maps/api",
                useOnPlatform: "web"
              }}
            /> 
          </ScrollView>

          <View flexG />
          
          <View style={global.field}>
            <TouchableOpacity style={[global.btn, global.bgOrange]}>
              <Text style={[global.btnText, global.white]}>Update Personal Information</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  )
}

export default UpdatePersonal