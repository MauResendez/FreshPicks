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
import { Alert, Keyboard, Platform, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker } from 'react-native-maps';
import PhoneInput from 'react-native-phone-input';
import { Button, Carousel, Checkbox, Colors, DateTimePicker, Image, KeyboardAwareScrollView, LoaderScreen, PageControl, Text, TextField, View, Wizard } from 'react-native-ui-lib';
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
  const days = [
    {label: 'Monday', value: 'Monday'},
    {label: 'Tuesday', value: 'Tuesday'},
    {label: 'Wednesday', value: 'Wednesday'},
    {label: 'Thursday', value: 'Thursday'},
    {label: 'Friday', value: 'Friday'},
    {label: 'Saturday', value: 'Saturday'},
    {label: 'Sunday', value: 'Sunday'},
  ];

  const IMAGES = [
    'https://images.pexels.com/photos/2529159/pexels-photo-2529159.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    'https://images.pexels.com/photos/2529146/pexels-photo-2529146.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    'https://images.pexels.com/photos/2529158/pexels-photo-2529158.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
  ];

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
      const manipulatedImage = await ImageManipulator.manipulateAsync(asset.uri, [{ resize: { height: 200 }}], { compress: 0.5 });

      compressed.push(manipulatedImage.uri);
      console.log("Pushed!");

      console.log("Assets:", asset);
      console.log("Asset URI:", asset.uri);
    });

    setFieldValue('images', compressed)
  };

  const camera = async (setFieldValue) => {
    console.log("HERE 2");
    setVisible(true);
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    try {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 0,
        selectionLimit: 4
      });

      if (!result.canceled) {
        compress(result, setFieldValue);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const gallery = async (setFieldValue) => {
    setVisible(true);
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    try {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 0,
        selectionLimit: 4
      });

      if (!result.canceled) {
        compress(result, setFieldValue);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const uploadImages = async (images) => {
    const imagePromises = Array.from(images, (image) => uploadImage(image));
  
    const imageRes = await Promise.all(imagePromises);
    return imageRes; // list of url like ["https://..", ...]
  }

  const uploadImage = async (image) => {
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
      let i = await checkIfUserExists(phone);

      if (!i.result.exists) {
        const phoneProvider = new PhoneAuthProvider(auth);
        const vid = await phoneProvider.verifyPhoneNumber(phone, recaptchaVerifier.current);
        setVID(vid);

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

  const createUser = async (values, user, u) => {
    console.log(values);
    try {
      await setDoc(doc(db, "Users", user.uid), {
        name: values.name,
        phone: values.phone,
        role: values.farmer,
        admin: false,
        farmer: farmer,
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
        token: [token],
      }).then(() => {
        console.log("HI");
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
      const imgs = await uploadImages(values.images);
      await createUser(values, user, imgs);
      console.log("HERE");
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
          ? <Button style={active !== 4 && {backgroundColor: "#ff4500"}} iconSource={() => <MCIcon name={"chevron-right"} size={48} color={Colors.white} />} onPress={goToNextStep} disabled={active === 4} />
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
          {/* <Text>{active}</Text> */}
          <PageControl numOfPages={farmer ? 5 : 2} currentPage={active} color={"#ff4500"} />
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
          <Text subtitle>Register as a Farmer?</Text>
          <Checkbox 
            value={farmer} 
            onValueChange={() => setFarmer(!farmer)} 
            style={global.checkbox}
            color={"#ff4500"}
          />
        </View>

        <View style={global.field}>
          <Text subtitle>Full Name *</Text>
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
          <Text subtitle>Email *</Text>
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

    // <ActionSheet
    //               containerStyle={{ height: 192 }}
    //               dialogStyle={{ borderRadius: 8 }}
    //               title={'Select Photo Option'} 
    //               options={[{label: 'Camera', onPress: async () => camera(setFieldValue), icon: () => <MCIcon name={"camera"} size={24} color={Colors.black} style={{ marginRight: 8 }} />}, {label: 'Gallery', onPress: async () => gallery(setFieldValue), icon: () => <MCIcon name={"image"} size={24} color={Colors.black} style={{ marginRight: 8 }} />}]}
    //               visible={visible}
    //               onDismiss={() => {console.log("HERE"); setVisible(false)}}
    //             />

    return (
      <View useSafeArea flex>
        <TouchableOpacity onPress={() => setVisible(true)}>
          <Carousel
            containerStyle={{
              height: 200
            }}
            autoplay
            loop
            pageControlProps={{
              size: 10,
              containerStyle: {
                position: 'absolute',
                bottom: 15,
                left: 10
              }
            }}
            pageControlPosition={Carousel.pageControlPositions.OVER}
            showCounter
          >
            {IMAGES.map((image, i) => {
              return (
                <View flex centerV key={i}>
                  <Image
                    overlayType={Image.overlayTypes.BOTTOM}
                    style={{flex: 1}}
                    source={{
                      uri: image
                    }}
                    cover
                  />
                </View>
              );
            })}
          </Carousel>
        </TouchableOpacity>
        
        <View flexG style={{ padding: 24 }}>
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
          {errors.business && touched.business && <Text style={{ color: Colors.red30 }}>{errors.business}</Text>}
          
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
          {errors.description && touched.description && <Text style={{ color: Colors.red30 }}>{errors.description}</Text>}

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
      // <KeyboardAwareScrollView contentContainerStyle={global.container} keyboardShouldPersistTaps="always">
      //   <Text subtitle>Business Address *</Text>
      //   <GooglePlacesAutocomplete
      //     textInputProps={{
      //       onChange(text) {
      //         setFieldValue('address', text);
      //         setFieldValue('location', null);
      //       },
      //       autoCapitalize: "none",
      //       autoCorrect: false,
      //       value: values.address
      //     }}
      //     styles={{
      //       textInput: {
      //         height: 50,
      //         width: "100%",
      //         borderWidth: 1,
      //         borderColor: "rgba(0, 0, 0, 0.2)",
      //         borderRadius: 8,
      //         paddingHorizontal: 8,
      //         backgroundColor: "white",
      //         marginBottom: 16,
      //       },
      //       listView: {
      //         marginBottom: 16,
      //       }
      //     }}
      //     onPress={(data, details) => {
      //       if (!data || !details) return;

      //       const geopoint = new GeoPoint(details.geometry.location.lat, details.geometry.location.lng);
        
      //       setFieldValue('address', data.description);
      //       setFieldValue('location', geopoint);
      //     }}
      //     fetchDetails={true}
      //     minLength={4}
      //     enablePoweredByContainer={false}
      //     placeholder="Enter your address here"
      //     debounce={1000}
      //     nearbyPlacesAPI="GooglePlacesSearch"
      //     keepResultsAfterBlur={true}
      //     query={{
      //       key: "AIzaSyDdDiIwvLlEcpjOK3DVEmbO-ydkrMOS1cM",
      //       language: "en",
      //     }}
      //     requestUrl={{
      //       url: "https://proxy-jfnvyeyyea-uc.a.run.app/https://maps.googleapis.com/maps/api",
      //       useOnPlatform: "web"
      //     }}
      //   />
        
      //   {Buttons()}  
      // </KeyboardAwareScrollView> 
      <MapView
        style={{ flex: 1 }}
        region={region}
        moveOnMarkerPress={true}
        mapType={"standard"}
        showsTraffic
      >
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
              },
              textInputContainer: {
                paddingHorizontal: 16,
                paddingTop: 16
              },
              listView: {
                paddingHorizontal: 16
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
      </MapView>
    );
  };

  const FarmerSchedule = (props) => {
    const { errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values } = props;

    return (
      <ScrollView contentContainerStyle={[global.container, global.flex]}>
        <View row spread style={{ paddingVertical: 4, alignItems: "center" }}>
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

          <Dialog
            visible={true}
            centerH
            centerV
          >
            <View margin-16 row spread>
              <DateTimePicker 
                mode="time" 
                label="Start Time" 
                timeFormat={'HH:mm A'} 
                display="clock" 
              />
              <DateTimePicker mode="time" label="End Time" timeFormat={'HH:mm A'} />
            </View>
            <View margin-16 right>
              <Button text60 label="Save" />
            </View>
          </Dialog>
        </View>

        

        {/* <Dialog visible={true} onDismiss={() => console.log('dismissed')} position={"center"}><Text text60>Content</Text></Dialog> */}

        <View flexG />

        {Buttons()}
      </ScrollView>
    );
  };

  const AccountInformation = (props) => {
    const { errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values } = props;

    return (
      <View style={[global.container, global.flex]}>
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
            onChangePhoneNumber={(phone) => setFieldValue('phone', phone)}
            textProps={{
              placeholder: 'Enter a phone number...'
            }}
          />
        </View>
        {errors.phone && touched.phone && <Text style={{ color: Colors.red30 }}>{errors.phone}</Text>}

        <View style={global.field}>
          <Button 
            backgroundColor={"#ff4500"}
            color={Colors.white}
            label={"Send Verification Code"} 
            labelStyle={{ fontWeight: '600', padding: 8 }}
            style={global.btnTest} 
            onPress={() => verifyPhone(values.phone)}                
          />
        </View>

        <View style={global.field}>
          <Text subtitle>Verify SMS Code</Text>
          <OTPInputView
            style={{width: '100%', height: 50}}
            pinCount={6}
            code={values.sms}
            onCodeChanged={handleChange("sms")}
            autoFocusOnLoad={false}
            codeInputFieldStyle={global.otpInput}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
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
      <LoaderScreen color={"#ff4500"} />
    )
  }

  const fv = Yup.object().shape({
    name: Yup.string().required('Name is required'), 
    email: Yup.string().email("Email must be a valid email").required('Email is required'), 
    // address: Yup.string().required('Address is required'), 
    // location: Yup.array().required('Location is required'), 
    business: Yup.string().required('Business is required'), 
    description: Yup.string().required('Description is required'), 
    website: Yup.string().url("Website must be a valid URL\nE.g. (https://www.google.com)").required('Website is required'), 
    phone: Yup.string().required('Phone is required'), 
    sms: Yup.string().required('SMS is required'), 
    // images: Yup.array().required('Images is required')
  });

  const cv = Yup.object().shape({
    name: Yup.string().required('Name is required'), 
    email: Yup.string().email("Email must be a valid email").required('Email is required'), 
    phone: Yup.string().required('Phone is required'), 
    sms: Yup.string().required('SMS is required'), 
  });

  return (
    <View useSafeArea flex>
      <TouchableWithoutFeedback style={global.flex} onPress={Platform.OS !== "web" && Keyboard.dismiss}> 
        <Formik 
          initialValues={{ farmer: false, name: null, email: null, address: null, location: null, business: null, description: null, website: null, phone: null, sms: null, images: [] }} 
          validationSchema={farmer ? fv : cv}
          onSubmit={handleSubmit}
        >
            {({ errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values }) => (
            <View flex>
              {/* <Toast visible={Object.keys(errors).length > 0} message={"One or more fields currently have errors. Please correct them to register your account"} position={'top'} backgroundColor={Colors.red30} autoDismiss={1000} onDismiss={hideToast} swipeable /> */}
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
              <KeyboardAwareScrollView style={global.flex} contentContainerStyle={global.flex}> 
                {Current({ errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values })}
              </KeyboardAwareScrollView>
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