import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { LoaderScreen, Text, TextField, View } from "react-native-ui-lib";
import { auth, db } from "../../firebase";
import { global } from "../../style";

const UpdatePayments = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<any>(null);
  const [paypal, setPaypal] = useState<any>(null);
  const [cashapp, setCashapp] = useState<any>(null);
  const [venmo, setVenmo] = useState<any>(null);
  const [loading, setLoading] = useState<any>(true);

  const onSubmit = async () => {
    let error = false;

    if ((paypal.length == 0 && cashapp.length == 0 && venmo.length == 0)) {
      error = true;
      // Toast.show("At least one payment method is required", {
      //   duration: Toast.durations.SHORT,
      //   backgroundColor: "orange",
      //   position: Toast.positions.BOTTOM - 150,
      //   opacity: 1
      // });
      return
    }

    if (error) {
      error = false;
      return;
    }

    await updateDoc(doc(db, "Users", auth.currentUser.uid), {
      payments: { paypal: paypal, cashapp: cashapp, venmo: venmo },
    })
      .then(() => {
        navigation.navigate("Index");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getDoc(doc(db, "Users", auth.currentUser.uid)).then((docSnapshot) => {
      const data = docSnapshot.data();
      setUser(data);
    });
  }, []);

  useEffect(() => {
    if (user) {
      console.log(user.payments);
      setPaypal(user.payments.paypal);
      setCashapp(user.payments.cashapp);
      setVenmo(user.payments.venmo);
    }
  }, [user]);

  useEffect(() => {
    if (paypal || cashapp || venmo) {
      setLoading(false);
    }
  }, [paypal, cashapp, venmo]);

  if (loading) {
    return (
      <LoaderScreen color={"#32CD32"} />
    )
  }

  return (
    <View useSafeArea flex>
      <TouchableWithoutFeedback
        onPress={Platform.OS !== "web" && Keyboard.dismiss}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          style={global.container}
        >
          <Text title>Payment Information</Text>

          <View style={global.field}>
            <Text style={global.subtitle}>PayPal</Text>
            <TextField
              value={paypal}
              onChangeText={(value) => setPaypal(value)}
              style={global.input}
              placeholder="PayPal Handle"
              migrate
            />
          </View>

          <View style={global.field}>
            <Text style={global.subtitle}>CashApp</Text>
            <TextField
              value={cashapp}
              onChangeText={(value) => setCashapp(value)}
              style={global.input}
              placeholder="CashApp Handle"
              migrate
            />
          </View>

          <View style={global.field}>
            <Text style={global.subtitle}>Venmo</Text>
            <TextField
              value={venmo}
              onChangeText={(value) => setVenmo(value)}
              style={global.input}
              placeholder="Venmo Handle"
              migrate
            />
          </View>

          <View flexG />

          <View style={global.field}>
            <TouchableOpacity style={[global.btn, global.bgOrange]} onPress={onSubmit}>
              <Text style={[global.btnText, global.white]}>Update Payment Information</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default UpdatePayments