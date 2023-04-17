import { useNavigation } from "@react-navigation/native";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { FirebaseRecaptchaBanner, FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import * as Notifications from 'expo-notifications';
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import PhoneInput from 'react-native-phone-input';
import Toast from "react-native-toast-message";
import { Image, LoaderScreen, Text, View } from "react-native-ui-lib";
import { app, auth, db } from "../../firebase";
import { global } from "../../style";

const Login = () => {
  const navigation = useNavigation<any>();
  const phoneRef = useRef<any>(null);
  const recaptchaVerifier = useRef<any>(null);
  const attemptInvisibleVerification = true;

  const [phone, setPhone] = useState<string>("");
  const [vid, setVID] = useState<any>();
  const [sms, setSMS] = useState<any>("");
  const [token, setToken] = useState<any>(null)
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

      console.log(response);

      const json = await response.json();

      console.log(json);

      return json;
    } catch (error) {
      console.error(error);
    }
  };

  const getToken = async () => {
    let token = await Notifications.getExpoPushTokenAsync();

    setToken(token.data);
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

      if (i.result.exists) {
        const phoneProvider = new PhoneAuthProvider(auth);
        const vid = await phoneProvider.verifyPhoneNumber(phone, recaptchaVerifier.current);
        setVID(vid);

        showToast("info", "Info", "Verification code has been sent to your phone");
      } else {
        Alert.alert("User doesn't exist", "There's no user with that registered with this phone number.\n\n Would you like to create an account?", [
          {text: 'Cancel', style: 'cancel'},
          {text: 'OK', onPress: () => navigation.navigate("Role")},
        ]);
      }
    } catch (err: any) {
      console.log(err.message);
      showToast("error", "Error", `${err.message}`);
    }
  }

  const onSubmit = async (sms: string) => {
    let error = false;

    if (phone.length == 0) {
      error = true;
      showToast("error", "Error", "Phone is required");
      return
    }

    if (error) {
      error = false;
      return
    }

    try {
      const credential = PhoneAuthProvider.credential(vid, sms);

      await signInWithCredential(auth, credential).then(async (credential) => {
        const user = credential.user;

        await updateDoc(doc(db, "Users", user.uid), {
          token: arrayUnion(token),
          createdAt: new Date(),
        });
      });
    } catch (err: any) {
      showToast("error", "Error", `${err.message}`);
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
      <LoaderScreen color={"#32CD32"} />
    )
  }

  return (
    <View useSafeArea flex>
      <TouchableWithoutFeedback style={global.flex} onPress={Platform.OS !== "web" && Keyboard.dismiss}>
        <KeyboardAvoidingView style={[global.container, global.spaceEvenly]} behavior={Platform.OS == "ios" ? "padding" : "height"}>
          <Image
            style={{ width: "auto", height: 100 }}
            source={require("../../assets/logo.png")}
            resizeMode="contain"
          />
          
          <View>
            <Text title>Login</Text>
            <FirebaseRecaptchaVerifierModal
              ref={recaptchaVerifier}
              firebaseConfig={app.options}
              androidHardwareAccelerationDisabled
              androidLayerType="software"
              attemptInvisibleVerification={attemptInvisibleVerification}
            />
          </View>

          <View style={global.field}>
            <Text style={global.subtitle}>Phone Number</Text>
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
            <TouchableOpacity style={[global.btn, global.bgOrange]} onPress={verifyPhone}>
              <Text style={[global.btnText, global.white]}>Send Verification Code</Text>
            </TouchableOpacity>
          </View>

          <View style={global.field}>
            <Text style={global.subtitle}>Verify SMS Code</Text>
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

          {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  borderStyleBase: {
    width: 30,
    height: 45
  },

  borderStyleHighLighted: {
    borderColor: "#03DAC6",
  },

  underlineStyleBase: {
    width: 30,
    height: 45,
    borderColor: "black",
    borderWidth: 0,
    borderBottomWidth: 1,
    color: "black"
  },

  underlineStyleHighLighted: {
    borderColor: "#03DAC6",
  },
});

export default Login