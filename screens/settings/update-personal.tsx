import { useNavigation } from '@react-navigation/native';
import { GeoPoint, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Keyboard, Platform, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { GooglePlaceData, GooglePlaceDetail, GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { KeyboardAwareScrollView, LoaderScreen, Text, TextField, View } from 'react-native-ui-lib';
import { auth, db } from '../../firebase';
import { global } from '../../style';

const UpdatePersonal = () => {
  const navigation = useNavigation<any>();
  const [name, setName] = useState<any>(null);
  const [email, setEmail] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const [location, setLocation] = useState<GeoPoint>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<any>(true);

  const onSubmit = async (values) => {
    await updateDoc(doc(db, "Users", auth.currentUser.uid), values)
      .then(() => {
        navigation.navigate("Index");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  const handleKeyPress = (data: GooglePlaceData, details: GooglePlaceDetail | null) => {
    if (!data || !details) return;

    const geopoint = new GeoPoint(details.geometry.location.lat, details.geometry.location.lng);

    setAddress(data.description);
    setLocation(geopoint);
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
      <LoaderScreen color={"#32CD32"} />
    )
  }

  return (
    <View useSafeArea flex>
      <TouchableWithoutFeedback style={global.flex} onPress={Platform.OS !== "web" && Keyboard.dismiss}>
        <KeyboardAwareScrollView style={global.container} contentContainerStyle={global.flex}>
          <Formik 
            initialValues={{ name: user.name, email: user.email, address: user.address, location: user.location } || { name: "", email: "", address: "", location: "" }} 
            onSubmit={onSubmit}
            enableReinitialize={true}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <View flex>
                <View style={global.field}>
                  <Text subtitle>Full Name *</Text>
                  <TextField 
                    value={values.name}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    style={global.input} 
                    autoComplete="name" 
                    migrate 
                    validate={'required'} 
                  />
                </View>

                <View style={global.field}>
                  <Text subtitle>Email *</Text>
                  <TextField 
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')} 
                    style={global.input} 
                    autoComplete="email" 
                    migrate 
                    validate={'required'} 
                  />
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
                        marginBottom: 16
                      }
                    }}
                    // onPress={(data, details) => handleKeyPress(data, details)}
                    onPress={(data, details) => {
                      if (!data || !details) return;

                      const geopoint = new GeoPoint(details.geometry.location.lat, details.geometry.location.lng);
                  
                      handleChange('address')(data.description);
                      handleChange('location')(geopoint as unknown as string)
                      // setAddress(data.description);
                      // setLocation(geopoint);
                    }}
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
              </View>
            )}
          </Formik>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </View>
  )
}

export default UpdatePersonal