import { useNavigation } from '@react-navigation/native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { FirebaseRecaptchaBanner, FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import * as Notifications from 'expo-notifications';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { GeoPoint, doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Keyboard, Platform, ScrollView, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { GooglePlaceData, GooglePlaceDetail, GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import PhoneInput from 'react-native-phone-input';
// import Toast from 'react-native-toast-message';
import { Button, Checkbox, Colors, Image, KeyboardAwareScrollView, LoaderScreen, Text, TextField, View, Wizard } from 'react-native-ui-lib';
import { app, auth, db, storage } from '../../firebase';
import { global } from '../../style';
// import Toast from 'react-native-simple-toast';
import { Formik } from 'formik';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const Register = () => {
  const navigation = useNavigation<any>();
  const phoneRef = useRef<any>(null);
  const recaptchaVerifier = useRef<any>(null);
  const attemptInvisibleVerification = true;
  const days = [
    {label: 'Monday', value: 'Monday'},
    {label: 'Tuesday', value: 'Tuesday'},
    {label: 'Wednesday', value: 'Wednesday'},
    {label: 'Thursday', value: 'Thursday'},
    {label: 'Friday', value: 'Friday'},
    {label: 'Saturday', value: 'Saturday'},
    {label: 'Sunday', value: 'Sunday'},
  ]

  const [active, setActive] = useState(0);
  const [completedStep, setCompletedStep] = useState(undefined);
  const [phone, setPhone] = useState<any>("");
  const [vid, setVID] = useState<any>();
  const [sms, setSMS] = useState<any>("");
  const [farmer, setFarmer] = useState<boolean>(false);
  const [name, setName] = useState<any>("");
  const [email, setEmail] = useState<any>("");
  const [address, setAddress] = useState<any>(null);
  const [location, setLocation] = useState<GeoPoint>(null);
  const [images, setImages] = useState([]);
  const [urls, setUrls] = useState([]);
  const [business, setBusiness] = useState<any>("");
  const [description, setDescription] = useState<any>("");
  const [website, setWebsite] = useState<any>(null);
  const [monday, setMonday] = useState<any>({ enable: false, start: null, end: null });
  const [tuesday, setTuesday] = useState<any>({ enable: false, start: null, end: null });
  const [wednesday, setWednesday] = useState<any>({ enable: false, start: null, end: null });
  const [thursday, setThursday] = useState<any>({ enable: false, start: null, end: null });
  const [friday, setFriday] = useState<any>({ enable: false, start: null, end: null });
  const [saturday, setSaturday] = useState<any>({ enable: false, start: null, end: null });
  const [sunday, setSunday] = useState<any>({ enable: false, start: null, end: null });
  const [day, setDay] = useState<any>(days[0]);
  const [toast, setToast] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);
  const [token, setToken] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const checkIfUserExists = async () => {
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

      const json = await response.json();

      return json;
    } catch (error) {
      console.error(error);
    }
  };

  const compress = async (result: ImagePicker.ImagePickerResult) => {
    const compressed = [];
    
    result.assets.forEach(async (asset) => {
      const manipulatedImage = await ImageManipulator.manipulateAsync(asset.uri, [{ resize: { height: 200 }}], { compress: 0.5 });

      compressed.push(manipulatedImage.uri);
      console.log("Pushed!");

      console.log("Assets:", asset);
      console.log("Asset URI:", asset.uri);
    });

    setImages(compressed);
  };

  const handleKeyPress = (data: GooglePlaceData, details: GooglePlaceDetail | null) => {
    if (!data || !details) return;

    const geopoint = new GeoPoint(details.geometry.location.lat, details.geometry.location.lng);

    setAddress(data.description);
    setLocation(geopoint);
  };

  const handleSubmit = async (values) => {
    const nameTest = /^[A-Za-z]+([\s.][A-Za-z]+)*$/;
    const emailTest = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    const websiteTest = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    
    try {
      const credential = PhoneAuthProvider.credential(vid, sms);

      const auth_credential = await signInWithCredential(auth, credential);
      const user = auth_credential.user;
      const imgs = await uploadImages(images);
      await createUser(values, user, imgs);
    } catch (error) {
      console.log(error);
      showToast("error", "Error", `${error.message}`);
    }
  };

  const uploadImage = async (image) => {
    const storageRef = ref(storage, `${auth.currentUser.uid}/images/${Date.now()}`);
    const img = await fetch(image);
    const blob = await img.blob();

    const response = await uploadBytesResumable(storageRef, blob);
    const url = await getDownloadURL(response.ref);
    return url;
  }
  
  const uploadImages = async (images) => {
    const imagePromises = Array.from(images, (image) => uploadImage(image));
  
    const imageRes = await Promise.all(imagePromises);
    return imageRes; // list of url like ["https://..", ...]
  }

  const createUser = async (values, user, u) => {
    try {
      await setDoc(doc(db, "Users", user.uid), {
        name: values.name,
        phone: values.phone,
        role: values.farmer,
        admin: false,
        farmer: values.farmer,
        email: values.email,
        address: values.address,
        location: values.location,
        images: u,
        business: values.business,
        description: values.description,
        website: values.website,
        // schedule: {
        //   monday: monday, tuesday: tuesday, wednesday: wednesday, thursday: thursday, friday: friday, saturday: saturday, sunday: sunday
        // },
        token: [values.token],
      });
    } catch (error) {
      console.error('Error uploading images', error);
    }
  };

  const selectLibraryImages = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: true,
        aspect: [4, 3],
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0,
        selectionLimit: 4
      });
    
      if (!result.canceled) {
        compress(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const hideToast = () => {
    setToast("");
    setVisible(false);
  }

  const showToast = (type, title, message) => {
    setToast(message);
    setVisible(true);
  }

  const verifyPhone = async () => {
    try {
      let i = await checkIfUserExists();

      if (!i.result.exists) {
        const phoneProvider = new PhoneAuthProvider(auth);
        const vid = await phoneProvider.verifyPhoneNumber(phone, recaptchaVerifier.current);
        setVID(vid);

        showToast("success", "Success", "Verification code has been sent to your phone");
      } else {
        Alert.alert("User already exists", "There's a user that registered with this phone number.\n\n Would you like to login with it?", [
          {text: 'Cancel', style: 'cancel'},
          {text: 'OK', onPress: () => navigation.navigate("Login")},
        ]);
      }
    } catch (error) {
      console.log(error.message);
      showToast("error", "Error", `${error.message}`);
    }
  }

  const onActiveIndexChanged = (activeIndex: number) => {
    setActive(activeIndex);
  };

  const goToPrevStep = () => {
    const activeIndex = active === 0 ? 0 : active - 1;

    setActive(activeIndex);
  };

  const Prev = () => {
    return (
      <Button style={active !== 0 && {backgroundColor:  "#ff4500"}} iconSource={() => <MCIcon name={"chevron-left"} size={48} color={Colors.white} />} onPress={goToPrevStep} disabled={active === 0} />
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
          ? <Button style={active !== 3 && {backgroundColor: "#ff4500"}} iconSource={() => <MCIcon name={"chevron-right"} size={48} color={Colors.white} />} onPress={goToNextStep} disabled={active === 3} />
          : <Button style={active !== 1 && {backgroundColor: "#ff4500"}} iconSource={() => <MCIcon name={"chevron-right"} size={48} color={Colors.white} />} onPress={goToNextStep} disabled={active === 1} />
        }
      </View>
    );
  };

  const Buttons = () => {
    return (
      <View style={global.field}>
        <View row spread centerV>
          {Prev()}
          <Text>{active}</Text>
          {Next()}
        </View>
      </View>
    )
  }

  const PersonalInformation = (props) => {
    const { handleChange, handleBlur, handleSubmit, values } = props;

    return (
      <View style={global.container}>
        <View style={global.field}>
          <Text subtitle>Register as a Farmer?</Text>
          <Checkbox value={farmer} onValueChange={() => setFarmer(!farmer)} style={global.checkbox} />
        </View>

        <View style={global.field}>
          <Text subtitle>Full Name *</Text>
          <TextField style={global.input} value={name} onChangeText={(value) => setName(value)} autoComplete="name" placeholder="Enter your full name" migrate validate={'required'} />
        </View>

        <View style={global.field}>
          <Text subtitle>Email *</Text>
          <TextField style={global.input} value={email} onChangeText={(value) => setEmail(value)} autoComplete="email" placeholder="Enter your email address" migrate validate={'required'} />
        </View>

        {farmer 
          ? <ScrollView style={global.field} contentContainerStyle={global.flex}>
              <Text subtitle>Address</Text>
              <GooglePlacesAutocomplete
                textInputProps={{
                  onSelectionChange(text) {
                    setAddress(text);
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
          : <View flexG />
        }
          
        {Buttons()}
      </View>
    )
  }

  const FarmerInformation = (props) => {
    const { handleChange, handleBlur, handleSubmit, values } = props;

    return (
      <View style={global.container}>
        <View style={global.field}>
          <Text subtitle>Business Name *</Text>
          <TextField 
            value={values.business} 
            onChangeText={handleChange('business')} 
            onBlur={handleBlur('business')} 
            style={global.input} 
            placeholder="Enter your business" 
          />
        </View>

        <View style={global.field}>
          <Text subtitle>Describe Your Business *</Text>
          <TextField 
            value={values.description} 
            onChangeText={handleChange('description')} 
            onBlur={handleBlur('description')} 
            style={global.textArea} 
            placeholder="Describe what products and services you sell" 
            maxLength={250} 
          />
        </View>

        <View style={global.field}>
          <Text subtitle>Website</Text>
          <TextField 
            value={values.website} 
            onChangeText={handleChange('website')} 
            onBlur={handleBlur('website')} 
            style={global.input} 
            placeholder="Enter your website"
          />
        </View>

        <View style={global.field}>
          <Text subtitle>Banners</Text>
          <Button label={"Banners"} labelStyle={{ fontWeight: '600', padding: 4 }} style={global.fwbtn} onPress={selectLibraryImages} iconSource={() => <MCIcon name={"image-multiple"} size={24} color={Colors.white} style={{ marginRight: 4 }} />} />
        </View>

        {/* <View style={global.field}>
          <TouchableOpacity onPress={selectCover}>
            {!cover
              ? <AnimatedImage style={{ width: "100%", height: 200 }} resizeMode='cover' source={require("../../assets/image.png")} />
              : <AnimatedImage style={{ width: "100%", height: 200 }} resizeMode='cover' source={{ uri: cover }} />
            }
          </TouchableOpacity>
          <ActionSheet 
            containerStyle={{ height: 128 }}
            dialogStyle={{ borderRadius: 8 }}
            cancelButtonIndex={3} 
            destructiveButtonIndex={0}
            visible={false} 
            options={[{label: 'Camera', onPress: () => {}},  {label: 'Gallery', onPress: () => {}}]}
          />
        </View> */}

        <View flexG />

        {Buttons()}
      </View>
    );
  };

  const FarmerSchedule = (props) => {
    const { handleChange, handleBlur, handleSubmit, values } = props;

    return (
      <ScrollView contentContainerStyle={global.container}>
        <View row spread style={{ paddingVertical: 4, alignItems: "center" }}>
          {/* <Text subtitle>Monday</Text> */}
          <Button 
            backgroundColor={"#ff4500"}
            color={Colors.white}
            label={"Monday"} 
            labelStyle={{ fontWeight: '600', padding: 4 }} 
            style={global.btn} 
            onPress={() => navigation.navigate("Register")}  
            disabled={!monday.enable}
          />
          <Checkbox value={monday.enable} onValueChange={() => setMonday({ ...monday, enable: !monday.enable })} style={global.checkbox} />
        </View>
        <View row spread style={{ paddingVertical: 4, alignItems: "center" }}>
          <Button 
            backgroundColor={"#ff4500"}
            color={Colors.white}
            label={"Tuesday"} 
            labelStyle={{ fontWeight: '600', padding: 4 }} 
            style={global.btn} 
            onPress={() => navigation.navigate("Register")}
            disabled={!tuesday.enable}
          />
          <Checkbox value={tuesday.enable} onValueChange={() => setTuesday({ ...tuesday, enable: !tuesday.enable })} style={global.checkbox} />
        </View>
        <View row spread style={{ paddingVertical: 4, alignItems: "center" }}>
          <Button 
            backgroundColor={"#ff4500"}
            color={Colors.white}
            label={"Wednesday"} 
            labelStyle={{ fontWeight: '600', padding: 4 }} 
            style={global.btn} 
            onPress={() => navigation.navigate("Register")}
            disabled={!wednesday.enable}
          />
          <Checkbox value={wednesday.enable} onValueChange={() => setWednesday({ ...wednesday, enable: !wednesday.enable })} style={global.checkbox} />
        </View>
        <View row spread style={{ paddingVertical: 4, alignItems: "center" }}>
          <Button 
            backgroundColor={"#ff4500"}
            color={Colors.white}
            label={"Thursday"} 
            labelStyle={{ fontWeight: '600', padding: 4 }} 
            style={global.btn} 
            onPress={() => navigation.navigate("Register")}
            disabled={!thursday.enable}
          />
          <Checkbox value={thursday.enable} onValueChange={() => setThursday({ ...thursday, enable: !thursday.enable })} style={global.checkbox} />
        </View>
        <View row spread style={{ paddingVertical: 4, alignItems: "center" }}>
          <Button 
            backgroundColor={"#ff4500"}
            color={Colors.white}
            label={"Friday"} 
            labelStyle={{ fontWeight: '600', padding: 4 }} 
            style={global.btn} 
            onPress={() => navigation.navigate("Register")}
            disabled={!friday.enable}  
          />
          <Checkbox value={friday.enable} onValueChange={() => setFriday({ ...friday, enable: !friday.enable })} style={global.checkbox} />
        </View>
        <View row spread style={{ paddingVertical: 4, alignItems: "center" }}>
          <Button 
            backgroundColor={"#ff4500"}
            color={Colors.white}
            label={"Saturday"} 
            labelStyle={{ fontWeight: '600', padding: 4 }} 
            style={global.btn} 
            onPress={() => navigation.navigate("Register")}
            disabled={!saturday.enable}   
          />
          <Checkbox value={saturday.enable} onValueChange={() => setSaturday({ ...saturday, enable: !saturday.enable })} style={global.checkbox} />
        </View>
        <View row spread style={{ paddingVertical: 4, alignItems: "center" }}>
          <Button 
            backgroundColor={"#ff4500"}
            color={Colors.white}
            label={"Sunday"} 
            labelStyle={{ fontWeight: '600', padding: 4 }} 
            style={global.btn} 
            onPress={() => navigation.navigate("Register")}
            disabled={!sunday.enable}    
          />
          <Checkbox value={sunday.enable} onValueChange={() => setSunday({ ...sunday, enable: !sunday.enable })} style={global.checkbox} />
        </View>

        {/* <Dialog visible={true} onDismiss={() => console.log('dismissed')} position={"center"}><Text text60>Content</Text></Dialog> */}

        <View flexG />

        {Buttons()}
      </ScrollView>
    );
  };

  const AccountInformation = (props) => {
    const { handleChange, handleBlur, handleSubmit, values } = props;

    return (
      <View style={global.container}>
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
          <Text subtitle>Phone Number</Text>
          <PhoneInput
            ref={phoneRef}
            initialCountry={'us'}
            style={global.input}
            onChangePhoneNumber={(phone) => {
              setPhone(phone);
            }}
            textProps={{
              placeholder: 'Enter a phone number...'
            }}
          />
        </View>

        <View style={global.field}>
          <Button 
            label={"Send Verification Code"} 
            labelStyle={{ fontWeight: '600', padding: 4 }} 
            style={global.fwbtn} 
            onPress={verifyPhone}  
          />
        </View>

        <View style={global.field}>
          <Text subtitle>Verify SMS Code</Text>
          <OTPInputView
            style={{width: '100%', height: 50}}
            pinCount={6}
            code={sms}
            onCodeChanged={code => setSMS(code)}
            autoFocusOnLoad={false}
            codeInputFieldStyle={global.otpInput}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={code => handleSubmit(code)}
          />
        </View>

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
        return FarmerSchedule(props);
      case 3:
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
  }

  useEffect(() => {
    getToken();
  }, [])

  useEffect(() => {
    if (token) {
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return (
      <LoaderScreen color={"#ff4500"} />
    )
  }

  return (
    <View useSafeArea flex>
      <TouchableWithoutFeedback style={global.flex} onPress={Platform.OS !== "web" && Keyboard.dismiss}> 
        <Formik 
          initialValues={{ farmer: false, name: "", email: "", address: "", location: null, banners: null, business: "", description: "", website: "", token: "", phone: "", sms: ""  }} 
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View flex>
              {farmer 
                ? <Wizard testID={'uilib.wizard'} activeIndex={active} onActiveIndexChanged={onActiveIndexChanged}>
                    <Wizard.Step state={getStepState(0)} label={'Personal Information'} />
                    <Wizard.Step state={getStepState(1)} label={'Farmer Information'} />
                    <Wizard.Step state={getStepState(2)} label={'Farmer Schedule'} />
                    <Wizard.Step state={getStepState(3)} label={'Account Information'} />
                  </Wizard>
                : <Wizard testID={'uilib.wizard'} activeIndex={active} onActiveIndexChanged={onActiveIndexChanged}>
                    <Wizard.Step state={getStepState(0)} label={'Personal Information'} />
                    <Wizard.Step state={getStepState(1)} label={'Account Information'} />
                  </Wizard>
              }
              <KeyboardAwareScrollView style={global.flex} contentContainerStyle={global.flex}> 
                {Current({ handleChange, handleBlur, handleSubmit, values })}
              </KeyboardAwareScrollView>
              {/* <Toast visible={visible} message={toast} position={'bottom'} backgroundColor={Colors.black} autoDismiss={5000} onDismiss={hideToast} swipeable /> */}
            </View>
          )}
        </Formik>
        
      </TouchableWithoutFeedback>
      {/* <Toast topOffset={0} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1
  },
  container: {
    flex: 1
  },
  allTypes: {
    justifyContent: 'space-between'
  },
  stepContainer: {
    flex: 1,
    // justifyContent: 'space-between',
    margin: 24
  },
  underlineStyleHighLighted: {
    borderColor: "#03DAC6",
  },
});

export default Register