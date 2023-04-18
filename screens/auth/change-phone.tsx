import { useNavigation } from "@react-navigation/native";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { FirebaseRecaptchaBanner, FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import * as React from "react";
import { useRef, useState } from "react";
import { Keyboard, Platform, StyleSheet, TouchableWithoutFeedback } from "react-native";
import PhoneInput from 'react-native-phone-input';
import { Text, TouchableOpacity, View } from "react-native-ui-lib";
import { app, auth } from "../../firebase";
import { global } from "../../style";

const ChangePhone = () => {
  const navigation = useNavigation<any>();
  const phoneRef = useRef(null);
  const recaptchaVerifier = useRef<any>(null);
  const attemptInvisibleVerification = true;

  const [phone, setPhone] = useState<string>("");
  const [vid, setVID] = useState<any>();
  const [sms, setSMS] = useState<any>("");

  const checkIfUserExists = async () => {
    try {
      const response = await fetch("https://us-central1-utrgvfreshpicks.cloudfunctions.net/checkIfUserExists ", {
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

      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const verifyPhone = async () => {
    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      const vid = await phoneProvider.verifyPhoneNumber(phone, recaptchaVerifier.current);
      setVID(vid);
      // Toast.show("Verification code has been sent to your phone.", {
      //   duration: Toast.durations.SHORT,
      // });
    } catch (err: any) {
      console.log(err.message);
      // Toast.show(`Error: ${err.message}`, {
      //   duration: Toast.durations.SHORT,
      // });
    }
  }

  const onSubmit = async (sms: string) => {
    let error = false;

    if (phone.length == 0) {
      error = true;
      // Toast.show("Phone is required", {
      //   duration: Toast.durations.SHORT,
      //   backgroundColor: "orange",
      //   position: Platform.OS == "web" ? 650 : 700
      // });
      return
    }

    let i = await checkIfUserExists();

    console.log(i);

    console.log("HI");

    if (error) {
      error = false;
      return
    }

    try {
      const credential = PhoneAuthProvider.credential(vid, sms);

      await signInWithCredential(auth, credential);
    } catch (err: any) {
      // Toast.show(`Error: ${err.message}`, {
      //   duration: Toast.durations.SHORT,
      // });
    }
  };

  return (
    <View useSafeArea flex>
      <TouchableWithoutFeedback onPress={Platform.OS !== "web" && Keyboard.dismiss}>
        <View style={[global.container, global.spaceEvenly]}>
          <View>
            <Text title>Change Phone Number</Text>
            <FirebaseRecaptchaVerifierModal
              ref={recaptchaVerifier}
              firebaseConfig={app.options}
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
        </View>
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

export default ChangePhone