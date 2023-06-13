import { useNavigation } from "@react-navigation/native";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { FirebaseRecaptchaBanner, FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import * as Notifications from 'expo-notifications';
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { Formik } from "formik";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from "react-native";
import PhoneInput from 'react-native-phone-input';
import { Button, Colors, Image, LoaderScreen, Text, View } from "react-native-ui-lib";
import { app, auth, db } from "../../firebase";
import { global } from "../../style";

const Login = () => {
  const navigation = useNavigation<any>();
  const phoneRef = useRef<any>(null);
  const appConfig = require("../../app.json");
  const projectId = appConfig?.expo?.extra?.eas?.projectId;
  const recaptchaVerifier = useRef<any>(null);
  const attemptInvisibleVerification = true;

  const [vid, setVID] = useState<any>("");
  const [token, setToken] = useState<any>(null)
  const [loading, setLoading] = useState(true);

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

  const getToken = async () => {
    let token = await Notifications.getExpoPushTokenAsync({ projectId });

    setToken(token.data);
  }

  // const showToast = (type, title, message) => {
  //   Toast.show({
  //     type: type,
  //     text1: title,
  //     text2: message
  //   });
  // }

  const verifyPhone = async (phone) => {
    console.log(phone);
    try {
      const i = await checkIfUserExists(phone);

      if (i.result.exists) {
        const phoneProvider = new PhoneAuthProvider(auth);
        const vid = await phoneProvider.verifyPhoneNumber(phone, recaptchaVerifier.current);
        setVID(vid);

        // showToast("info", "Info", "Verification code has been sent to your phone");
      } else {
        Alert.alert("User doesn't exist", "There's no user with that registered with this phone number.\n\n Would you like to create an account?", [
          {text: 'Cancel', style: 'cancel'},
          {text: 'OK', onPress: () => navigation.navigate("Register")},
        ]);
      }
    } catch (err: any) {
      console.log(err.message);
      // showToast("error", "Error", `${err.message}`);
    }
  }

  const onSubmit = async (values) => {
    try {
      console.log(values);
      const credential = PhoneAuthProvider.credential(vid, values.sms);

      await signInWithCredential(auth, credential).then(async (credential) => {
        const user = credential.user;

        await updateDoc(doc(db, "Users", user.uid), {
          token: arrayUnion(token),
          createdAt: new Date(),
        });
      });
    } catch (err: any) {
      // showToast("error", "Error", `${err.message}`);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

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

  return (
    <View useSafeArea flex>
      <TouchableWithoutFeedback style={global.flex} onPress={Platform.OS !== "web" && Keyboard.dismiss}>
        <KeyboardAvoidingView style={[global.container, global.flex]} behavior={Platform.OS == "ios" ? "padding" : "height"}>
          <Formik 
            initialValues={{ phone: "", sms: "" }} 
            onSubmit={onSubmit}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <View flex style={global.spaceEvenly}>
                <View style={global.field}>
                  <Image
                    style={{ width: "auto", height: 100 }}
                    source={require("../../assets/images/logo.png")}
                    resizeMode="contain"
                  />
                  <FirebaseRecaptchaVerifierModal
                    ref={recaptchaVerifier}
                    firebaseConfig={app.options}
                    androidHardwareAccelerationDisabled
                    androidLayerType="software"
                    attemptInvisibleVerification={attemptInvisibleVerification}
                  />
                </View>

                <View style={global.field}>
                  <Text text65 marginV-4>Phone Number</Text>
                  <PhoneInput
                    ref={phoneRef}
                    initialCountry={'us'}
                    style={global.input}
                    onChangePhoneNumber={handleChange('phone')}
                    textProps={{
                      placeholder: 'Enter a phone number...'
                    }}
                  />
                </View>
                

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
                    codeInputHighlightStyle={global.underline}
                    onCodeFilled={() => handleSubmit()}
                  />
                </View>   

                <View style={global.field}>
                  {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
                </View>
              </View>
            )}
          </Formik>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default Login