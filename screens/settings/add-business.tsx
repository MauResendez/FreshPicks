import { useNavigation } from '@react-navigation/native';
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import * as Notifications from 'expo-notifications';
import { GeoPoint, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Keyboard, Platform, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Button, Carousel, Checkbox, Colors, DateTimePicker, Image, KeyboardAwareScrollView, LoaderScreen, PageControl, Text, TextField, Toast, View, Wizard } from 'react-native-ui-lib';
import { Dialog } from 'react-native-ui-lib/src/incubator';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Yup from 'yup';
import { auth, db, storage } from '../../firebase';
import { global } from '../../style';

const AddBusiness = () => {
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
  const [loading, setLoading] = useState(true);

  const hideToast = () => {
    setVisible(false);
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
  }

  const compress = async (result: ImagePicker.ImagePickerResult, setFieldValue) => {
    const compressed = [];
    
    result.assets.forEach(async (asset) => {
      const manipulatedImage = await ImageManipulator.manipulateAsync(asset.uri, [{ resize: { height: 400 }}], { compress: 0 });

      compressed.push(manipulatedImage.uri);
    });

    // const i = await checkIfImageIsAppropriate(result.assets);

    // if (!i.result) {
    //   Alert.alert("Image has inappropriate content", "The image has been scanned to have some inappropriate content. Please select another image to upload.", [
    //     {text: 'OK', style: 'cancel'},
    //   ]);
    // } else {
    //   setFieldValue('images', compressed)
    // }

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

  const handleSubmit = async (values) => {
    try {
      await updateDoc(doc(db, "Users", auth.currentUser.uid), {
        business: values.business,
        description: values.description,
        website: values.website,
        address: values.address,
        location: values.location,
        schedule: {
          monday: monday, tuesday: tuesday, wednesday: wednesday, thursday: thursday, friday: friday, saturday: saturday, sunday: sunday
        },
        images: values.images,
        farmer: true
      }).then(() => {
        navigation.navigate("Settings");
      });
    } catch (err: any) {
      Toast.show(`Error: ${err.message}`, {
        duration: Toast.durations.SHORT,
      });
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

  const Next = (props) => {
    const { errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values } = props;

    return (
      <View>
        {active !== 3 
          ? <Button style={{ backgroundColor: Colors.primary }} iconSource={() => <MCIcon name={"chevron-right"} size={48} color={Colors.white} />} onPress={goToNextStep} />
          : <Button style={{ backgroundColor: Colors.primary }} iconSource={() => <MCIcon name={"check"} size={48} color={Colors.white} />} onPress={handleSubmit} />
        }
        </View>
    );
  };

  const Buttons = (props) => {
    return (
      <View style={global.field}>
        <View row spread centerV>
          {Prev()}
          {/* <Text>{active}</Text> */}
          <PageControl numOfPages={4} currentPage={active} color={Colors.primary} />
          {Next(props)}
        </View>
      </View>
    )
  }

  const FarmerInformation = (props) => {
    const { errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values } = props;

    return (
      <View useSafeArea flex>
        <Carousel containerStyle={{ height: 200 }}>
          <TouchableOpacity style={global.flex} onPress={() => Alert.alert("Options", "Select photo from which option", [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Camera', onPress: async () => await camera(setFieldValue)},
            {text: 'Gallery', onPress: async () => await gallery(setFieldValue)},
          ])}>
            <View flex centerV>
              {values.images.length == 0
                ? <Image style={global.flex} source={require("../../assets/images/default.png")} overlayType={Image.overlayTypes.BOTTOM} />
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

          {Buttons(props)}
        </View>
      </View>
    );
  };

  const FarmerAddress = (props) => {
    const { errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values } = props;

    return (
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
        
        {Buttons(props)}  
      </KeyboardAwareScrollView> 
    );
  };

  const FarmerSchedule = (props) => {
    const { errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values } = props;

    return (
      <ScrollView contentContainerStyle={[global.container, global.flex]}>
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

        {Buttons(props)}
      </ScrollView>
    );
  };

  const AccountInformation = (props) => {
    const { errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values } = props;

    return (
      <View style={[global.container, global.flex]}>
        <View style={global.field}>
          <Text text65 marginV-4>Add Your Business</Text>
        </View>
        {errors.phone && touched.phone && <Text style={{ color: Colors.red30 }}>{errors.phone}</Text>}

        <View style={global.field}>
          <Text text80M grey30 marginV-4>Submit to add in your business information to your account.</Text>
        </View> 

        <View flexG />

        {Buttons(props)}   
      </View>
    );
  };

  const Current = (props) => {
    switch (active) {
      case 0:
        return FarmerInformation(props);
      case 1:
        return FarmerAddress(props);
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

    return token.data;
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
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }

  const validate = Yup.object().shape({
    // address: Yup.string().required('Address is required'), 
    // location: Yup.array().required('Location is required'), 
    business: Yup.string().required('Business is required'), 
    description: Yup.string().required('Description is required'), 
    website: Yup.string().url("Website must be a valid URL\nE.g. (https://www.google.com)").required('Website is required'), 
    // images: Yup.array().required('Images is required')
  });

  return (
    <View useSafeArea flex>
      <TouchableWithoutFeedback style={global.flex} onPress={Platform.OS !== "web" && Keyboard.dismiss}> 
        <Formik 
          initialValues={{ farmer: false, name: "", email: "", address: "", location: "", business: "", description: "", website: "", phone: "", sms: "", images: [] }} 
          validationSchema={validate}
          onSubmit={handleSubmit}
        >
            {({ errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values }) => (
            <View flex>
              <Toast visible={Object.keys(errors).length > 0} message={"One or more fields currently have errors. Please correct them to register your account"} position={'top'} backgroundColor={Colors.red30} autoDismiss={1000} onDismiss={hideToast} swipeable />
              <Wizard testID={'uilib.wizard'} activeIndex={active} onActiveIndexChanged={onActiveIndexChanged}>
                <Wizard.Step state={getStepState(0)} label={'Farmer Information'} />
                <Wizard.Step state={getStepState(1)} label={'Farmer Address'} />
                <Wizard.Step state={getStepState(2)} label={'Farmer Schedule'} />
                <Wizard.Step state={getStepState(3)} label={'Account Information'} />
              </Wizard>
              <KeyboardAwareScrollView style={global.flex} contentContainerStyle={global.flex}> 
                {Current({ errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values })}
              </KeyboardAwareScrollView>
            </View>
          )}
        </Formik>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default AddBusiness