import { useNavigation } from '@react-navigation/native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { FirebaseRecaptchaBanner, FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import * as Notifications from 'expo-notifications';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { GeoPoint, doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Keyboard, Platform, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import PhoneInput from 'react-native-phone-input';
import { Button, Carousel, Checkbox, Colors, DateTimePicker, Image, KeyboardAwareScrollView, LoaderScreen, PageControl, Text, TextField, Toast, View, Wizard } from 'react-native-ui-lib';
import { Dialog } from 'react-native-ui-lib/src/incubator';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Yup from 'yup';
import { app, auth, db, storage } from '../../firebase';
import { global } from '../../style';

const Register = () => {
  const navigation = useNavigation<any>();
  const phoneRef = useRef<any>(null);
  const recaptchaVerifier = useRef<any>(null);
  const attemptInvisibleVerification = true;

  const [active, setActive] = useState(0);
  const [completedStep, setCompletedStep] = useState(undefined);
  const [vid, setVID] = useState<any>();
  const [farmer, setFarmer] = useState<boolean>(false);
  const [monday, setMonday] = useState<any>({ enable: false, start: null, end: null });
  const [tuesday, setTuesday] = useState<any>({ enable: false, start: null, end: null });
  const [wednesday, setWednesday] = useState<any>({ enable: false, start: null, end: null });
  const [thursday, setThursday] = useState<any>({ enable: false, start: null, end: null });
  const [friday, setFriday] = useState<any>({ enable: false, start: null, end: null });
  const [saturday, setSaturday] = useState<any>({ enable: false, start: null, end: null });
  const [sunday, setSunday] = useState<any>({ enable: false, start: null, end: null });
  const [visible, setVisible] = useState<boolean>(false);
  const [token, setToken] = useState<any>(null);
  const [coordinates, setCoordinates] = useState({ latitude: 26.212379, longitude: -98.318153 });
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);

  const hideToast = () => {
    setVisible(false);
  }

  const compress = async (result: ImagePicker.ImagePickerResult, setFieldValue) => {
    const compressed = [];
    
    result.assets.forEach(async (asset) => {
      const manipulatedImage = await ImageManipulator.manipulateAsync(asset.uri, [{ resize: { height: 400 }}], { compress: 0 });

      compressed.push(manipulatedImage.uri);
    });

    const i = await checkIfImageIsAppropriate(result.assets);

    if (!i.result) {
      Alert.alert("Image has inappropriate content", "The image has been scanned to have some inappropriate content. Please select another image to upload.", [
        {text: 'OK', style: 'cancel'},
      ]);
    } else {
      setFieldValue('images', compressed)
    }
  };

  const camera = async (setFieldValue) => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    try {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchCameraAsync({
        base64: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 0,
      });

      if (!result.canceled) {
        compress(result, setFieldValue);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const gallery = async (setFieldValue) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    try {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        base64: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 0,
      });

      if (!result.canceled) {
        compress(result, setFieldValue);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const uploadImages = async (images) => {
    console.log("HERE UPLOADING");
    const imagePromises = Array.from(images, (image) => uploadImage(image));
  
    const imageRes = await Promise.all(imagePromises);
    return imageRes; // list of url like ["https://..", ...]
  }

  const uploadImage = async (image) => {
    console.log("HERE UPLOADING 2");
    const storageRef = ref(storage, `${auth.currentUser.uid}/images/${Date.now()}`);
    const img = await fetch(image);
    const blob = await img.blob();

    const response = await uploadBytesResumable(storageRef, blob);
    const url = await getDownloadURL(response.ref);
    return url;
  }

  const verifyPhone = async (phone) => {
    console.log("Phone:", phone);
    try {
      const i = await checkIfUserExists(phone);

      if (!i.result.exists) {
        const phoneProvider = new PhoneAuthProvider(auth);
        const vid = await phoneProvider.verifyPhoneNumber(phone, recaptchaVerifier.current);
        setVID(vid);
        console.log(vid);

        // showToast("info", "Info", "Verification code has been sent to your phone");
      } else {
        Alert.alert("User already exists", "There's a user that registered with this phone number.\n\n Would you like to login with it?", [
          {text: 'Cancel', style: 'cancel'},
          {text: 'OK', onPress: () => navigation.navigate("Login")},
        ]);
      }
    } catch (err: any) {
      console.log(err.message);
      // showToast("error", "Error", `${err.message}`);
    }
  }

  const checkIfImageIsAppropriate = async (images) => {
    try {
      const response = await fetch("https://us-central1-utrgvfreshpicks.cloudfunctions.net/checkIfImageIsAppropriate", {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'data': {
            'image': images[0],
          }
        }),
      });

      // console.log(response);

      const json = await response.json();

      console.log(json);

      return json;
    } catch (error) {
      console.error(error);
    }
  };

  const checkIfUserExists = async (phone) => {
    try {
      const response = await fetch("https://us-central1-utrgvfreshpicks.cloudfunctions.net/checkIfUserExists", {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'data': {
            'phoneNumber': phone,
          }
        }),
      });

      console.log(response);

      const json = await response.json();

      console.log(json);

      return json;
    } catch (error) {
      console.error(error);
    }
  };

  const createUser = async (values, user, images) => {
    console.log(values);
    console.log(token);
    try {
      await setDoc(doc(db, "Users", user.uid), {
        name: values.name,
        phone: values.phone,
        role: farmer ? "Farmer" : "Consumer",
        admin: false,
        farmer: farmer,
        email: values.email,
        address: values.address,
        location: values.location,
        images: images,
        business: values.business,
        description: values.description,
        website: values.website,
        // schedule: {
        //   monday: monday, tuesday: tuesday, wednesday: wednesday, thursday: thursday, friday: friday, saturday: saturday, sunday: sunday
        // },
        token: [token],
      });
    } catch (error) {
      console.error('Error uploading images', error);
    }
  };

  const handleSubmit = async (values) => {
    const nameTest = /^[A-Za-z]+([\s.][A-Za-z]+)*$/;
    const emailTest = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    const websiteTest = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    
    try {
      const credential = PhoneAuthProvider.credential(vid, values.sms);

      const auth_credential = await signInWithCredential(auth, credential);
      const user = auth_credential.user;
      const imgs = farmer ? await uploadImages(values.images) : [];
      await createUser(values, user, imgs);
    } catch (error) {
      console.log(error);
    }
  };

  const onActiveIndexChanged = (activeIndex: number) => {
    setActive(activeIndex);
  };

  const goToPrevStep = () => {
    const activeIndex = active === 0 ? 0 : active - 1;

    setActive(activeIndex);
  };

  const Prev = () => {
    return (
      <Button style={active !== 0 && {backgroundColor: Colors.primary}} iconSource={() => <MCIcon name={"chevron-left"} size={48} color={Colors.white} />} onPress={goToPrevStep} disabled={active === 0} />
    );
  };

  const goToNextStep = () => {
    const prevActiveIndex = active;
    const prevCompletedStepIndex = completedStep;
    const activeIndex = prevActiveIndex + 1;
    let completedStepIndex = prevCompletedStepIndex;
    if (!prevCompletedStepIndex || prevCompletedStepIndex < prevActiveIndex) {
      completedStepIndex = prevActiveIndex;
    }

    if (activeIndex !== prevActiveIndex || completedStepIndex !== prevCompletedStepIndex) {
      setActive(activeIndex);
      setCompletedStep(completedStepIndex);
    }
  };

  const Next = () => {
    return (
      <View>
        {farmer 
          ? <Button style={active !== 4 && {backgroundColor: Colors.primary}} iconSource={() => <MCIcon name={"chevron-right"} size={48} color={Colors.white} />} onPress={goToNextStep} disabled={active === 4} />
          : <Button style={active !== 1 && {backgroundColor: Colors.primary}} iconSource={() => <MCIcon name={"chevron-right"} size={48} color={Colors.white} />} onPress={goToNextStep} disabled={active === 1} />
        }
      </View>
    );
  };

  const Buttons = () => {
    return (
      <View style={global.field}>
        <View row spread centerV>
          {Prev()}
          {/* <Text>{active}</Text> */}
          <PageControl numOfPages={farmer ? 5 : 2} currentPage={active} color={Colors.primary} />
          {Next()}
        </View>
      </View>
    )
  }

  const PersonalInformation = (props) => {
    const { errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values } = props;

    return (
      <View flex style={global.container}>
        <View style={global.field}>
          <Text text65 marginV-4>Register as a Farmer?</Text>
          <Checkbox 
            value={farmer} 
            onValueChange={() => setFarmer(!farmer)} 
            style={global.checkbox}
            color={Colors.primary}
          />
        </View>

        <View style={global.field}>
          <Text text65 marginV-4>Full Name *</Text>
          <TextField 
            style={global.input} 
            value={values.name} 
            onChangeText={handleChange('name')} 
            onBlur={handleBlur('name')}
            autoComplete="name" 
            placeholder="Enter your full name" 
            migrate 
          />
        </View>
        {errors.name && touched.name && <Text style={{ color: Colors.red30 }}>{errors.name}</Text>}

        <View style={global.field}>
          <Text text65 marginV-4>Email *</Text>
          <TextField 
            style={global.input} 
            value={values.email} 
            onChangeText={handleChange('email')} 
            onBlur={handleBlur('email')}
            autoComplete="email" 
            placeholder="Enter your email address" 
            migrate 
          />
        </View>
        {errors.email && touched.email && <Text style={{ color: Colors.red30 }}>{errors.email}</Text>}

        <View flexG />
          
        {Buttons()}
      </View>
    )
  }

  const FarmerInformation = (props) => {
    const { errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values } = props;

    return (
      <View useSafeArea flex>
        <Carousel containerStyle={{ height: 200 }}>
          <TouchableOpacity style={global.flex} onPress={() => Alert.alert("Delete Chat", "Would you like to delete this post?", [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Camera', onPress: async () => await camera(setFieldValue)},
            {text: 'Gallery', onPress: async () => await gallery(setFieldValue)},
          ])}>
            <View flex centerV>
              {values.images.length == 0
                ? <Image style={global.flex} source={require("../../assets/default.png")} overlayType={Image.overlayTypes.BOTTOM} />
                : <Image style={global.flex} source={{ uri: values.images[0] }} cover overlayType={Image.overlayTypes.BOTTOM} />
              }
            </View>
          </TouchableOpacity>
        </Carousel>
        
        <View flexG style={{ padding: 24 }}>
          <View style={global.field}>
            <Text text65 marginV-4>Business Name *</Text>
            <TextField 
              value={values.business} 
              onChangeText={handleChange('business')} 
              onBlur={handleBlur('business')} 
              style={global.input} 
              placeholder="Enter your business" 
            />
          </View>
          {errors.business && touched.business && <Text style={{ color: Colors.red30 }}>{errors.business}</Text>}
          
          <View style={global.field}>
            <Text text65 marginV-4>Describe Your Business *</Text>
            <TextField 
              value={values.description} 
              onChangeText={handleChange('description')} 
              onBlur={handleBlur('description')} 
              style={global.area} 
              placeholder="Describe what products and services you sell" 
              maxLength={250} 
            />
          </View>
          {errors.description && touched.description && <Text style={{ color: Colors.red30 }}>{errors.description}</Text>}

          <View style={global.field}>
            <Text text65 marginV-4>Website</Text>
            <TextField 
              value={values.website} 
              onChangeText={handleChange('website')} 
              onBlur={handleBlur('website')} 
              style={global.input} 
              placeholder="Enter your website"
            />
          </View>
          {errors.website && touched.website && <Text style={{ color: Colors.red30 }}>{errors.website}</Text>}

          <View flexG />

          {Buttons()}
        </View>
      </View>
    );
  };

  const FarmerAddress = (props) => {
    const { errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values } = props;

    return (
      <KeyboardAwareScrollView contentContainerStyle={[global.container, global.flex]}>
        <Text text65 marginV-4>Business Address *</Text>
        {errors.address && touched.address && <Text style={{ color: Colors.red30 }}>{errors.address}</Text>}

        {errors.location && touched.location && <Text style={{ color: Colors.red30 }}>{errors.location}</Text>}

        <GooglePlacesAutocomplete
          textInputProps={{
            onChange(text) {
              setFieldValue('address', text);
              setFieldValue('location', "");
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
              marginBottom: 16,
            },
            listView: {
              marginBottom: 16,
            }
          }}
          onPress={(data, details) => {
            if (!data || !details) return;

            const geopoint = new GeoPoint(details.geometry.location.lat, details.geometry.location.lng);
        
            setFieldValue('address', data.description);
            setFieldValue('location', geopoint);
          }}
          fetchDetails={true}
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
        
        {Buttons()}  
      </KeyboardAwareScrollView> 
      // <MapView
      //   style={{ flex: 1 }}
      //   region={region}
      //   moveOnMarkerPress={true}
      //   mapType={"standard"}
      //   showsTraffic
      // >
      //     <GooglePlacesAutocomplete
      //       textInputProps={{
      //         onChange(text) {
      //           setFieldValue('address', text);
      //           setFieldValue('location', null);
      //         },
      //         autoCapitalize: "none",
      //         autoCorrect: false,
      //         value: values.address
      //       }}
      //       styles={{
      //         textInput: {
      //           height: 50,
      //           width: "100%",
      //           borderWidth: 1,
      //           borderColor: "rgba(0, 0, 0, 0.2)",
      //           borderRadius: 8,
      //           paddingHorizontal: 8,
      //           backgroundColor: Colors.white,
      //         },
      //         textInputContainer: {
      //           paddingHorizontal: 16,
      //           paddingTop: 16
      //         },
      //         listView: {
      //           paddingHorizontal: 16
      //         }
      //       }}
      //       onPress={(data, details) => {
      //         if (!data || !details) return;

      //         const geopoint = new GeoPoint(details.geometry.location.lat, details.geometry.location.lng);
          
      //         setFieldValue('address', data.description);
      //         setFieldValue('location', geopoint);

      //         const { lat, lng } = details.geometry.location;
      //         setCoordinates({ latitude: lat, longitude: lng });
              
      //       }}
      //       fetchDetails={true}
      //       minLength={4}
      //       enablePoweredByContainer={false}
      //       placeholder="Enter your address here"
      //       debounce={1000}
      //       nearbyPlacesAPI="GooglePlacesSearch"
      //       keepResultsAfterBlur={true}
      //       query={{
      //         key: "AIzaSyDyXlBNmFl5OTBrrc8YyGRyPoEnoi3fMTc",
      //         language: "en",
      //       }}
      //       requestUrl={{
      //         url: "https://proxy-jfnvyeyyea-uc.a.run.app/https://maps.googleapis.com/maps/api",
      //         useOnPlatform: "web"
      //       }}
      //     />
      //     <Marker coordinate={coordinates} />
      // </MapView>
    );
  };

  const FarmerSchedule = (props) => {
    const { errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values } = props;

    return (
      <View flex padding-24>
        <View row spread style={{ alignItems: "center" }}>
          <Button 
            backgroundColor={Colors.primary}
            color={Colors.white}
            label={"Monday"} 
            labelStyle={{ fontWeight: '600', padding: 4 }} 
            style={global.button} 
            onPress={() => navigation.navigate("Register")}  
            disabled={!monday.enable}
          />
          <Checkbox value={monday.enable} onValueChange={() => setMonday({ ...monday, enable: !monday.enable })} style={global.checkbox} />
        </View>
        <View row spread style={{ alignItems: "center" }}>
          <Button 
            backgroundColor={Colors.primary}
            color={Colors.white}
            label={"Tuesday"} 
            labelStyle={{ fontWeight: '600', padding: 4 }} 
            style={global.button} 
            onPress={() => navigation.navigate("Register")}
            disabled={!tuesday.enable}
          />
          <Checkbox value={tuesday.enable} onValueChange={() => setTuesday({ ...tuesday, enable: !tuesday.enable })} style={global.checkbox} />
        </View>
        <View row spread style={{ alignItems: "center" }}>
          <Button 
            backgroundColor={Colors.primary}
            color={Colors.white}
            label={"Wednesday"} 
            labelStyle={{ fontWeight: '600', padding: 4 }} 
            style={global.button} 
            onPress={() => navigation.navigate("Register")}
            disabled={!wednesday.enable}
          />
          <Checkbox value={wednesday.enable} onValueChange={() => setWednesday({ ...wednesday, enable: !wednesday.enable })} style={global.checkbox} />
        </View>
        <View row spread style={{ alignItems: "center" }}>
          <Button 
            backgroundColor={Colors.primary}
            color={Colors.white}
            label={"Thursday"} 
            labelStyle={{ fontWeight: '600', padding: 4 }} 
            style={global.button} 
            onPress={() => navigation.navigate("Register")}
            disabled={!thursday.enable}
          />
          <Checkbox value={thursday.enable} onValueChange={() => setThursday({ ...thursday, enable: !thursday.enable })} style={global.checkbox} />
        </View>
        <View row spread style={{ alignItems: "center" }}>
          <Button 
            backgroundColor={Colors.primary}
            color={Colors.white}
            label={"Friday"} 
            labelStyle={{ fontWeight: '600', padding: 4 }} 
            style={global.button} 
            onPress={() => navigation.navigate("Register")}
            disabled={!friday.enable}  
          />
          <Checkbox value={friday.enable} onValueChange={() => setFriday({ ...friday, enable: !friday.enable })} style={global.checkbox} />
        </View>
        <View row spread style={{ alignItems: "center" }}>
          <Button 
            backgroundColor={Colors.primary}
            color={Colors.white}
            label={"Saturday"} 
            labelStyle={{ fontWeight: '600', padding: 4 }} 
            style={global.button} 
            onPress={() => navigation.navigate("Register")}
            disabled={!saturday.enable}   
          />
          <Checkbox value={saturday.enable} onValueChange={() => setSaturday({ ...saturday, enable: !saturday.enable })} style={global.checkbox} />
        </View>
        <View row spread style={{ alignItems: "center" }}>
          <Button 
            backgroundColor={Colors.primary}
            color={Colors.white}
            label={"Sunday"} 
            labelStyle={{ fontWeight: '600', padding: 4 }} 
            style={global.button} 
            onPress={() => navigation.navigate("Register")}
            disabled={!sunday.enable}    
          />
          <Checkbox value={sunday.enable} onValueChange={() => setSunday({ ...sunday, enable: !sunday.enable })} style={global.checkbox} />

          <Dialog
            visible={monday.enable}
            centerH
            centerV
          >
            <View padding-24>
              <View>
                <Text text65 marginV-4>Monday</Text>
              </View>
              <View row spread>
                <View>
                  <Text text65 marginV-4>Start Time</Text>
                  <DateTimePicker
                    value={new Date()} 
                    mode="time" 
                    is24Hour={true} 
                    timeFormat={'HH:mm A'} 
                    display="clock"
                  />
                </View>

                <View>
                  <Text text65 marginV-4>End Time</Text>
                  <DateTimePicker
                    value={new Date()} 
                    mode="time" 
                    is24Hour={false} 
                    timeFormat={'HH:mm A'}
                    display="clock" 
                  />
                </View>
              </View>
              <View paddingT-24 row spread>
                {/* <Button text60 label="Save" /> */}
                <Button 
                  backgroundColor={Colors.primary}
                  color={Colors.white}
                  label={"Cancel"} 
                  labelStyle={{ fontWeight: '600', padding: 4 }} 
                  style={global.button} 
                  onPress={() => navigation.navigate("Register")}  
                  disabled={!monday.enable}
                />
                <Button 
                  backgroundColor={Colors.primary}
                  color={Colors.white}
                  label={"Save"} 
                  labelStyle={{ fontWeight: '600', padding: 4 }} 
                  style={global.button} 
                  onPress={() => navigation.navigate("Register")}  
                  disabled={!monday.enable}
                />
              </View>
            </View>
            
          </Dialog>

          <Dialog
            visible={tuesday.enable}
            centerH
            centerV
          >
            <View padding-24 row spread>
              <View>
                <Text text65 marginV-4>Start Time</Text>
                <DateTimePicker
                  value={new Date()} 
                  mode="time" 
                  is24Hour={true} 
                  timeFormat={'HH:mm A'} 
                  display="clock"
                />
              </View>

              <View>
                <Text text65 marginV-4>End Time</Text>
                <DateTimePicker
                  value={new Date()} 
                  mode="time" 
                  is24Hour={false} 
                  timeFormat={'HH:mm A'}
                  display="clock" 
                />
              </View>
            </View>
            <View margin-16 right>
              <Button text60 label="Save" />
            </View>
          </Dialog>

          <Dialog
            visible={wednesday.enable}
            centerH
            centerV
          >
            <View padding-24 row spread>
              <View>
                <Text text65 marginV-4>Start Time</Text>
                <DateTimePicker
                  value={new Date()} 
                  mode="time" 
                  is24Hour={true} 
                  timeFormat={'HH:mm A'} 
                  display="clock"
                />
              </View>

              <View>
                <Text text65 marginV-4>End Time</Text>
                <DateTimePicker
                  value={new Date()} 
                  mode="time" 
                  is24Hour={false} 
                  timeFormat={'HH:mm A'}
                  display="clock" 
                />
              </View>
            </View>
            <View margin-16 right>
              <Button text60 label="Save" />
            </View>
          </Dialog>

          <Dialog
            visible={thursday.enable}
            centerH
            centerV
          >
            <View padding-24 row spread>
              <View>
                <Text text65 marginV-4>Start Time</Text>
                <DateTimePicker
                  value={new Date()} 
                  mode="time" 
                  is24Hour={true} 
                  timeFormat={'HH:mm A'} 
                  display="clock"
                />
              </View>

              <View>
                <Text text65 marginV-4>End Time</Text>
                <DateTimePicker
                  value={new Date()} 
                  mode="time" 
                  is24Hour={false} 
                  timeFormat={'HH:mm A'}
                  display="clock" 
                />
              </View>
            </View>
            <View margin-16 right>
              <Button text60 label="Save" />
            </View>
          </Dialog>

          <Dialog
            visible={friday.enable}
            centerH
            centerV
          >
            <View padding-24 row spread>
              <View>
                <Text text65 marginV-4>Start Time</Text>
                <DateTimePicker
                  value={new Date()} 
                  mode="time" 
                  is24Hour={true} 
                  timeFormat={'HH:mm A'} 
                  display="clock"
                />
              </View>

              <View>
                <Text text65 marginV-4>End Time</Text>
                <DateTimePicker
                  value={new Date()} 
                  mode="time" 
                  is24Hour={false} 
                  timeFormat={'HH:mm A'}
                  display="clock" 
                />
              </View>
            </View>
            <View margin-16 right>
              <Button text60 label="Save" />
            </View>
          </Dialog>

          <Dialog
            visible={saturday.enable}
            centerH
            centerV
          >
            <View padding-24 row spread>
              <View>
                <Text text65 marginV-4>Start Time</Text>
                <DateTimePicker
                  value={new Date()} 
                  mode="time" 
                  is24Hour={true} 
                  timeFormat={'HH:mm A'} 
                  display="clock"
                />
              </View>

              <View>
                <Text text65 marginV-4>End Time</Text>
                <DateTimePicker
                  value={new Date()} 
                  mode="time" 
                  is24Hour={false} 
                  timeFormat={'HH:mm A'}
                  display="clock" 
                />
              </View>
            </View>
            <View margin-16 right>
              <Button text60 label="Save" />
            </View>
          </Dialog>

          <Dialog
            visible={sunday.visible}
            centerH
            centerV
          >
            <View padding-24 row spread>
              <View>
                <Text text65 marginV-4>Start Time</Text>
                <DateTimePicker
                  value={new Date()} 
                  mode="time" 
                  is24Hour={true} 
                  timeFormat={'HH:mm A'} 
                  display="clock"
                />
              </View>

              <View>
                <Text text65 marginV-4>End Time</Text>
                <DateTimePicker
                  value={new Date()} 
                  mode="time" 
                  is24Hour={false} 
                  timeFormat={'HH:mm A'}
                  display="clock" 
                />
              </View>
            </View>
            <View margin-16 right>
              <Button text60 label="Save" />
            </View>
          </Dialog>
        </View>

        <View flexG />

        {Buttons()}
      </View>
    );
  };

  const AccountInformation = (props) => {
    const { errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values } = props;

    return (
      <View flex padding-24>
        <View style={global.field}>
          <Image
            style={{ width: "auto", height: 100 }}
            source={require("../../assets/logo.png")}
            resizeMode="contain"
          />
          <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={app.options}
            attemptInvisibleVerification={attemptInvisibleVerification}
          />
        </View>
        
        <View style={global.field}>
          <Text text65 marginV-4>Phone Number</Text>
          <PhoneInput
            initialValue={values.phone}
            ref={phoneRef}
            initialCountry={'us'}
            style={global.input}
            onChangePhoneNumber={(phone) => setFieldValue('phone', phone)}
            textProps={{
              placeholder: 'Enter a phone number...'
            }}
          />
        </View>
        {errors.phone && touched.phone && <Text style={{ color: Colors.red30 }}>{errors.phone}</Text>}

        <View style={global.field}>
          <Button 
            backgroundColor={Colors.primary}
            color={Colors.white}
            label={"Send Verification Code"} 
            labelStyle={{ fontWeight: '600', padding: 8 }}
            style={global.button} 
            onPress={() => verifyPhone(values.phone)}                
          />
        </View>

        <View style={global.field}>
          <Text text65 marginV-4>Verify SMS Code</Text>
          <OTPInputView
            style={{width: '100%', height: 50}}
            pinCount={6}
            code={values.sms}
            onCodeChanged={handleChange("sms")}
            autoFocusOnLoad={false}
            codeInputFieldStyle={global.otp}
            codeInputHighlightStyle={{ borderColor: "#03DAC6" }}
            onCodeFilled={() => handleSubmit()}
          />
        </View>
        {errors.sms && touched.sms && <Text style={{ color: Colors.red30 }}>{errors.sms}</Text>}

        <View style={global.field}>
          {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
        </View>  

        <View flexG />

        {Buttons()}   
      </View>
    );
  };

  const Current = (props) => {
    switch (active) {
      case 0:
        return PersonalInformation(props);
      case 1:
        if (farmer)
          return FarmerInformation(props);

        return AccountInformation(props);
      case 2:
        return FarmerAddress(props);
      case 3:
        return FarmerSchedule(props);
      case 4:
        return AccountInformation(props);
    }
  };

  const getStepState = (index: number) => {
    let state = Wizard.States.DISABLED;
    if (completedStep > index - 1) {
      state = Wizard.States.COMPLETED;
    } else if (active === index || completedStep === index - 1) {
      state = Wizard.States.ENABLED;
    }

    return state;
  }

  const getToken = async () => {
    let token = await Notifications.getExpoPushTokenAsync();

    setToken(token.data);

    return token.data;
  }

  useEffect(() => {
    getToken();
  }, [])

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

  useEffect(() => {
    if (token) {
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }

  const validation = Yup.object().shape({
    name: Yup.string().required('Name is required'), 
    email: Yup.string().email("Email must be a valid email").required('Email is required'), 
    address: Yup.string().when([], {
      is: () => farmer,
      then: (schema) => schema.required('Address is required'),
    }),
    location: Yup.object().when([], {
      is: () => farmer,
      then: (schema) => schema.required('Location is required'),
    }),
    business: Yup.string().when([], {
      is: () => farmer,
      then: (schema) => schema.required('Business is required'),
    }),
    description: Yup.string().when([], {
      is: () => farmer,
      then: (schema) => schema.required('Description is required'),
    }),
    website: Yup.string().url("Website must be a valid URL\nE.g. (https://www.google.com)").when([], {
      is: () => farmer,
      then: (schema) => schema.notRequired(),
    }),
    phone: Yup.string().required('Phone is required'), 
    sms: Yup.string().required('SMS is required'), 
    // images: Yup.array().required('Images is required')
  });

  return (
    <TouchableWithoutFeedback style={global.flex} onPress={Platform.OS !== "web" && Keyboard.dismiss}> 
      <Formik 
        initialValues={{ name: "", email: "", address: "", location: "", business: "", description: "", website: "", phone: "", sms: "", images: [] }} 
        validationSchema={validation}
        onSubmit={handleSubmit}
      >
          {({ errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values, isSubmitting, submitCount }) => (
          <View useSafeArea flex>
            <Toast visible={submitCount > 0 && Object.keys(errors).length > 0} message={"One or more fields currently have errors. Please correct them to register your account"} position={'top'} backgroundColor={Colors.red30} autoDismiss={1000} onDismiss={hideToast} swipeable />
            {farmer 
              ? <Wizard testID={'uilib.wizard'} activeIndex={active} onActiveIndexChanged={onActiveIndexChanged}>
                  <Wizard.Step state={getStepState(0)} label={'Personal Information'} />
                  <Wizard.Step state={getStepState(1)} label={'Farmer Information'} />
                  <Wizard.Step state={getStepState(1)} label={'Farmer Address'} />
                  <Wizard.Step state={getStepState(2)} label={'Farmer Schedule'} />
                  <Wizard.Step state={getStepState(3)} label={'Account Information'} />
                </Wizard>
              : <Wizard testID={'uilib.wizard'} activeIndex={active} onActiveIndexChanged={onActiveIndexChanged}>
                  <Wizard.Step state={getStepState(0)} label={'Personal Information'} />
                  <Wizard.Step state={getStepState(1)} label={'Account Information'} />
                </Wizard>
            }
            {/* <KeyboardAwareScrollView style={global.flex} contentContainerStyle={global.flex} enableOnAndroid={true} enableAutomaticScroll={(Platform.OS === 'ios')}>  */}
            <View useSafeArea flex>
              {Current({ errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values })}
            </View>
          </View>
        )}
      </Formik>
    </TouchableWithoutFeedback>
  );
}

export default Register