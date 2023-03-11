import { useNavigation, useRoute } from '@react-navigation/native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { FirebaseRecaptchaBanner, FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from "expo-image-picker";
import * as Notifications from 'expo-notifications';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { GooglePlaceData, GooglePlaceDetail, GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import PhoneInput from 'react-native-phone-input';
import Toast from 'react-native-toast-message';
import { ActionSheet, AnimatedImage, Avatar, DateTimePicker, Image, LoaderScreen, Switch, Text, TextField, TouchableOpacity, View, Wizard } from 'react-native-ui-lib';
import { app, auth, db, storage } from '../../firebase';
import { global } from '../../style';
// import Toast from 'react-native-simple-toast';

const Register = ({ route }) => {
  const {
    params: {
      farmer
    }
  } = useRoute<any>();

  const navigation = useNavigation<any>();
  const phoneRef = useRef<any>(null);
  const recaptchaVerifier = useRef<any>(null);
  const attemptInvisibleVerification = true;

  const [active, setActive] = useState(0);
  const [completedStep, setCompletedStep] = useState(undefined);
  const [toast, setToast] = useState(undefined);
  const [phone, setPhone] = useState<any>("");
  const [vid, setVID] = useState<any>();
  const [sms, setSMS] = useState<any>("");
  const [name, setName] = useState<any>("");
  const [email, setEmail] = useState<any>("");
  const [address, setAddress] = useState<any>(null);
  const [coordinates, setCoordinates] = useState<any>(null);
  const [logo, setLogo] = useState<any>(null);
  const [cover, setCover] = useState<any>(null);
  const [images, setImages] = useState([]);
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
  const [pickup, setPickUp] = useState(true);
  const [delivery, setDelivery] = useState(false);
  const [paypal, setPaypal] = useState<any>(null);
  const [cashapp, setCashapp] = useState<any>(null);
  const [venmo, setVenmo] = useState<any>(null);
  const [token, setToken] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const checkIfUserExists = async () => {
    try {
      const response = await fetch("https://us-central1-cfsifreshpicks.cloudfunctions.net/checkIfUserExists", {
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

  const compress = async (uri: string) => {
    const manipulatedImage = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 300, height: 300 }}], { compress: 0.5 });
    setLogo(manipulatedImage.uri);
  };

  const compress2 = async (uri: string) => {
    const manipulatedImage = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 300, height: 300 }}], { compress: 0.5 });
    setCover(manipulatedImage.uri);
  };

  const handleKeyPress = (data: GooglePlaceData, details: GooglePlaceDetail | null) => {
    if (!data || !details) return;

    setAddress(data.description);
    setCoordinates(details.geometry.location);
  };

  const selectLogo = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    try {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 0,
      });

      if (!result.canceled) {
        console.log(result.assets[0].uri);
        compress(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const selectCover = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    try {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 0,
      });

      if (!result.canceled) {
        console.log(result.assets[0].uri);
        compress2(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const showToast = (type, title, message) => {
    Toast.show({
      type: type,
      text1: title,
      text2: message
    });
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

  const onSubmit = async (sms: string) => {
    const nameTest = /^[A-Za-z]+([\s.][A-Za-z]+)*$/;
    const emailTest = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    const websiteTest = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    const cashappTest = /^\$[a-zA-Z0-9_]{1,20}$/;
    const venmoTest = /^\@[a-zA-Z0-9_]{1,20}$/;
    
    let error = false;

    if (name.length == 0 || !nameTest.test(name)) {
      error = true;
      showToast("error", "Error", "Name is required");
      return
    }

    if (email.length == 0 || !emailTest.test(email)) {
      error = true;
      showToast("error", "Error", "Email is required");
      return
    }

    if (business.length == 0) {
      error = true;
      showToast("error", "Error", "Business is required");
      return
    }

    if (description.length == 0) {
      error = true;
      showToast("error", "Error", "Description is required")
      return
    }

    if (website.length == 0 || !websiteTest.test(website)) {
      error = true;
      showToast("error", "Error", "Website is required")
      return
    }

    if ((!paypal && !cashapp && !venmo)) {
      error = true;
      showToast("error", "Error", "A payment method is required");
      return
    }

    if (paypal && !emailTest.test(paypal)) {
      error = true;
      showToast("error", "Error", "Please type in your PayPal account correctly (With an email address)");
      return
    }

    if (cashapp && !cashappTest.test(cashapp)) {
      error = true;
      showToast("error", "Error", "Please type in your CashApp account correctly (With the $ in the beginning)");
      return
    }

    if (venmo && !venmoTest.test(venmo)) {
      error = true;
      showToast("error", "Error", "Please type in your Venmo account correctly (With the @ in the beginning)");
      return
    }

    if (error) {
      error = false;
      return
    }

    try {
      const credential = PhoneAuthProvider.credential(vid, sms);

      await signInWithCredential(auth, credential).then(async (credential) => {
        // Registered
        const user = credential.user;
        let logo_url = null;
        let cover_url = null;
        
        const logo_ref = ref(storage, `images/${auth.currentUser.uid}/logo/${Date.now()}`);
        const cover_ref = ref(storage, `images/${auth.currentUser.uid}/cover/${Date.now()}`);

        // Convert image to bytes
        const logo_img = await fetch(logo);
        const logo_bytes = await logo_img.blob();
        const cover_img = await fetch(cover);
        const cover_bytes = await cover_img.blob();

        await uploadBytes(logo_ref, logo_bytes).then(async () => {
          // We retrieve the URL of where the image is located at
          await getDownloadURL(logo_ref).then(async (logo) => {
            logo_url = logo;
          });
        }).then(async () => {
          await uploadBytes(cover_ref, cover_bytes).then(async () => {
            // We retrieve the URL of where the image is located at
            await getDownloadURL(cover_ref).then(async (cover) => {
              cover_url = cover;
            });
          });
        }).then(async () => {
          await setDoc(doc(db, "Users", user.uid), {
            name: name,
            phone: phone,
            role: farmer,
            farmer: farmer,
            email: email,
            address: address,
            coordinates: coordinates,
            logo: logo_url,
            cover: cover_url,
            business: business,
            description: description,
            website: website,
            // location: new firestore.GeoPoint(coordinates.lat, coordinates.lng)
            schedule: {
              monday: monday, tuesday: tuesday, wednesday: wednesday, thursday: thursday, friday: friday, saturday: saturday, sunday: sunday
            },
            payments: {
              paypal: paypal,
              cashapp: cashapp,
              venmo: venmo,
            },
            rating: 0,
            ratings: 0,
            token: [token],
          });

          showToast("success", "Success", "Your phone number has been authenticated!")
        })
        .catch((error) => {
          showToast("error", "Error", `${error.message}`);
        });
      });
    } catch (error) {
      showToast("error", "Error", `${error.message}`);
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
      <View style={global.field}>
        <TouchableOpacity style={[global.btn, global.bgOrange]} onPress={goToPrevStep}>
          <Text style={[global.btnText, global.white]}>Back</Text>
        </TouchableOpacity>
      </View>
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
      <View style={global.field}>
        <TouchableOpacity style={[global.btn, global.bgOrange]} onPress={goToNextStep}>
          <Text style={[global.btnText, global.white]}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const PersonalInformation = () => {
    return (
      <View style={[global.container, global.spaceEvenly]}>
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
        
        <View style={global.field}>
          {Next()}
        </View>
      </View>
    )
  }

  const ProfileSetup = () => {
    return (
      <View style={[global.container, global.spaceEvenly]}>
        <Text title>Profile Images</Text>

        <View style={global.field}>
          <TouchableOpacity style={global.center} onPress={selectLogo}>
            {!logo
              ? <Avatar size={100} source={require("../../assets/profile.png")} />
              : <Avatar size={100} source={{ uri: logo }} />
            }
          </TouchableOpacity>
        </View>

        <View style={global.field}>
          <TouchableOpacity onPress={selectCover}>
            {!cover
              ? <AnimatedImage style={{ width: "100%", height: 250 }} source={require("../../assets/image.png")} />
              : <AnimatedImage style={{ width: "100%", height: 250 }} source={{ uri: cover }} />
            }
          </TouchableOpacity>
        </View>

        <View flexG />

        <View style={global.field}>
          {Prev()}
          {Next()}
          <ActionSheet 
            containerStyle={{ height: 128 }}
            dialogStyle={{ borderRadius: 8 }}
            cancelButtonIndex={3} 
            destructiveButtonIndex={0}
            visible={false} 
            options={[{label: 'Camera', onPress: () => {}},  {label: 'Gallery', onPress: () => {}}]}
          />
        </View>
      </View>
    );
  };

  const FarmerInformation = () => {
    return (
      <View style={styles.stepContainer}>
        <Text title>Farmer Information</Text>

        <View style={global.field}>
          <Text subtitle>Business Name *</Text>
          <TextField value={business} onChangeText={(value) => setBusiness(value)} style={global.input} placeholder="Enter your business" migrate validate={'required'} />
        </View>

        <View style={global.field}>
          <Text subtitle>Describe Your Business *</Text>
          <TextField value={description} onChangeText={(value) => setDescription(value)} style={global.textArea}  placeholder="Describe what listings and services you sell" multiline maxLength={250} migrate validate={'required'} />
        </View>

        <View style={global.field}>
          <Text subtitle>Website</Text>
          <TextField value={website} onChangeText={(value) => setWebsite(value)} style={global.input} placeholder="Enter your website" migrate />
        </View>

        <View flexG />

        <View style={global.field}>
          {Prev()}
          {Next()}
        </View>
      </View>
    );
  };

  const FarmerSchedule = () => {
    return (
      <View style={styles.stepContainer}>
        <Text title>Farmer Schedule</Text>
        <View style={global.field}>
          <View style={[global.row, global.spaceBetween]}>
            <Text subtitle>Monday</Text>
            <Switch value={monday.enable} onValueChange={() => setMonday({...monday, enable: !monday.enable})} />
          </View>

          {monday.enable && <View style={[global.row, global.spaceBetween]}>
            <DateTimePicker mode="time" placeholder="Start Time" timeFormat={'HH:mm'} migrateTextField />
            <DateTimePicker mode="time" placeholder="End Time" timeFormat={'HH:mm'} migrateTextField />
          </View>}
        </View>
        <View style={global.field}>
          <View style={[global.row, global.spaceBetween]}>
            <Text subtitle>Tuesday</Text>
            <Switch value={tuesday.enable} onValueChange={() => setTuesday({...tuesday, enable: !tuesday.enable})} />
          </View>

          {tuesday.enable && <View style={[global.row, global.spaceBetween]}>
            <DateTimePicker mode="time" placeholder="Start Time" timeFormat={'HH:mm'} migrateTextField />
            <DateTimePicker mode="time" placeholder="End Time" timeFormat={'HH:mm'} migrateTextField />
          </View>}
        </View>
        <View style={global.field}>
          <View style={[global.row, global.spaceBetween]}>
            <Text subtitle>Wednesday</Text>
            <Switch value={wednesday.enable} onValueChange={() => setWednesday({...wednesday, enable: !wednesday.enable})} />
          </View>

          {wednesday.enable && <View style={[global.row, global.spaceBetween]}>
            <DateTimePicker mode="time" placeholder="Start Time" timeFormat={'HH:mm'} migrateTextField />
            <DateTimePicker mode="time" placeholder="End Time" timeFormat={'HH:mm'} migrateTextField />
          </View>}
        </View>
        <View style={global.field}>
          <View style={[global.row, global.spaceBetween]}>
            <Text subtitle>Thursday</Text>
            <Switch value={thursday.enable} onValueChange={() => setThursday({...thursday, enable: !thursday.enable})} />
          </View>

          {thursday.enable && <View style={[global.row, global.spaceBetween]}>
            <DateTimePicker mode="time" placeholder="Start Time" timeFormat={'HH:mm'} migrateTextField/>
            <DateTimePicker mode="time" placeholder="End Time" timeFormat={'HH:mm'} migrateTextField />
          </View>}
        </View>
        <View style={global.field}>
          <View style={[global.row, global.spaceBetween]}>
            <Text subtitle>Friday</Text>
            <Switch value={friday.enable} onValueChange={() => setFriday({...friday, enable: !friday.enable})} />
          </View>

          {friday.enable && <View style={[global.row, global.spaceBetween]}>
            <DateTimePicker mode="time" placeholder="Start Time" timeFormat={'HH:mm'} migrateTextField/>
            <DateTimePicker mode="time" placeholder="End Time" timeFormat={'HH:mm'} migrateTextField />
          </View>}
        </View>
        <View style={global.field}>
          <View style={[global.row, global.spaceBetween]}>
            <Text subtitle>Saturday</Text>
            <Switch value={saturday.enable} onValueChange={() => setSaturday({...saturday, enable: !saturday.enable})} />
          </View>

          {saturday.enable && <View style={[global.row, global.spaceBetween]}>
            <DateTimePicker mode="time" placeholder="Start Time" timeFormat={'HH:mm'} migrateTextField/>
            <DateTimePicker mode="time" placeholder="End Time" timeFormat={'HH:mm'} migrateTextField />
          </View>}
        </View>
        <View style={global.field}>
          <View style={[global.row, global.spaceBetween]}>
            <Text subtitle>Sunday</Text>
            <Switch value={sunday.enable} onValueChange={() => setSunday({...sunday, enable: !sunday.enable})} />
          </View>

          {sunday.enable && <View style={[global.row, global.spaceBetween]}>
            <DateTimePicker mode="time" placeholder="Start Time" timeFormat={'HH:mm'} migrateTextField/>
            <DateTimePicker mode="time" placeholder="End Time" timeFormat={'HH:mm'} migrateTextField />
          </View>}
        </View>

        <View flexG />

        <View style={global.field}>
          {Prev()}
          {Next()}
        </View>
      </View>
    );
  };

  const PaymentInformation = () => {
    return (
      <View style={styles.stepContainer}>
        <Text title>Payment Information</Text>

        <View style={global.field}>
          <Text subtitle>PayPal</Text>
          <TextField value={paypal} onChangeText={(value) => setPaypal(value)} style={global.input} placeholder="Ex: example@gmail.com" migrate />
        </View>

        <View style={global.field}>
          <Text subtitle>CashApp</Text>
          <TextField value={cashapp} onChangeText={(value) => setCashapp(value)} style={global.input} placeholder="Ex: $example" migrate />
        </View>

        <View style={global.field}>
          <Text subtitle>Venmo</Text>
          <TextField value={venmo} onChangeText={(value) => setVenmo(value)} style={global.input} placeholder="Ex: @Example" migrate />
        </View>

        <View flexG />
        
        <View style={global.field}>
          {Prev()}
          {Next()}
        </View>
      </View>
    );
  };

  const AccountInformation = () => {
    return (
      <View style={[global.container, global.spaceEvenly]}>

        <Image
          style={{ width: "auto", height: 100 }}
          source={require("../../assets/logo.png")}
          resizeMode="contain"
        />

        <View>
          <Text title>Register</Text>
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
              console.log(phone);
            }}
            textProps={{
              placeholder: 'Enter a phone number...'
            }}
          />
        </View>

        <View style={global.field}>
          <TouchableOpacity style={[global.btn, global.bgOrange]} onPress={verifyPhone}>
            <Text style={[global.btnText, global.white]}>Send Verification Code</Text>
          </TouchableOpacity>
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
            onCodeFilled={code => onSubmit(code)}
          />
        </View>          
        
        <View style={global.field}>
          {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
          {Prev()}
        </View>
      </View>
    );
  };

  const Current = () => {
    switch (active) {
      case 0:
      default:
        return PersonalInformation();
      case 1:
        return ProfileSetup();
      case 2:
        if (route.params.farmer)
          return FarmerInformation();

        return AccountInformation();
      case 3:
        return FarmerSchedule();
      case 4:
        return PaymentInformation();
      case 5:
        return AccountInformation();
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
      <LoaderScreen />
    )
  }

  return (
    <View useSafeArea flex>
      <TouchableWithoutFeedback style={global.flex} onPress={Platform.OS !== "web" && Keyboard.dismiss}>
        <KeyboardAvoidingView style={global.flex} behavior={Platform.OS == "ios" ? "padding" : "height"}>
          <ScrollView contentContainerStyle={global.flex}>
            {route.params.farmer 
              ? <Wizard testID={'uilib.wizard'} activeIndex={active} onActiveIndexChanged={onActiveIndexChanged}>
                  <Wizard.Step state={getStepState(0)} label={'Personal Information'} />
                  <Wizard.Step state={getStepState(1)} label={'Profile Setup'} />
                  <Wizard.Step state={getStepState(2)} label={'Farmer Information'} />
                  <Wizard.Step state={getStepState(3)} label={'Farmer Schedule'} />
                  <Wizard.Step state={getStepState(4)} label={'Payment Information'} />
                  <Wizard.Step state={getStepState(5)} label={'Account Information'} />
                </Wizard>
              : <Wizard testID={'uilib.wizard'} activeIndex={active} onActiveIndexChanged={onActiveIndexChanged}>
                  <Wizard.Step state={getStepState(0)} label={'Personal Information'} />
                  <Wizard.Step state={getStepState(1)} label={'Profile Setup'} />
                  <Wizard.Step state={getStepState(2)} label={'Account Information'} />
                </Wizard>
            }
            {Current()}
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      <Toast topOffset={0} />
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