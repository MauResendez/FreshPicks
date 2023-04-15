import { useNavigation } from "@react-navigation/native"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import React, { useEffect, useState } from "react"
import { Keyboard, KeyboardAvoidingView, Platform, TouchableOpacity, TouchableWithoutFeedback } from "react-native"
import { LoaderScreen, Text, TextField, View } from "react-native-ui-lib"
import { auth, db } from "../../firebase"
import { global } from "../../style"

const UpdateFarmer = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<any>(null);
  const [business, setBusiness] = useState<any>(null);
  const [description, setDescription] = useState<any>(null);
  const [loading, setLoading] = useState<any>(true);

  const onSubmit = async () => {
    let error = false;

    if (business.length == 0) {
      error = true;
      // Toast.show("Business is required", {
      //   duration: Toast.durations.SHORT,
      //   backgroundColor: "orange",
      //   position: Toast.positions.BOTTOM - 150,
      //   opacity: 1,
      // });
      return;
    }
    
    if (description.length == 0) {
      error = true;
      // Toast.show("Description is required", {
      //   duration: Toast.durations.SHORT,
      //   backgroundColor: "orange",
      //   position: Toast.positions.BOTTOM - 150,
      //   opacity: 1,
      // });
      return;
    }

    if (error) {
      error = false;
      return;
    }

    await updateDoc(doc(db, "Users", auth.currentUser.uid), {
      business: business, description: description
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
      setBusiness(user.business);
      setDescription(user.description);
    }
  }, [user]);

  useEffect(() => {
    if (business && description) {
      setLoading(false);
    }
  }, [business, description]);

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
          style={global.container}
          behavior={Platform.OS == "ios" ? "padding" : "height"}
        >
          <Text title>Farmer Information</Text>

          <View style={global.field}>
            <Text subtitle>Business Name *</Text>
            <TextField
              value={business}
              onChangeText={(value) => setBusiness(value)}
              style={global.input}
              placeholder="Enter your business"
              migrate
            />
          </View>
          
          <View style={global.field}>
            <Text subtitle>Describe your business *</Text>
            <TextField
              value={description}
              onChangeText={(value) => setDescription(value)}
              style={global.textArea}
              placeholder="Describe what listings and services you sell"
              multiline
              maxLength={100}
              migrate
            />
          </View>

          <View flexG />

          <View style={global.field}>
            <TouchableOpacity style={[global.btn, global.bgOrange]} onPress={onSubmit}>
              <Text style={[global.btnText, global.white]}>Update Farmer Information</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default UpdateFarmer