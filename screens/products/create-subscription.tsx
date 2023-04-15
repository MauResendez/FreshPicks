import { useNavigation } from "@react-navigation/native"
import * as ImageManipulator from 'expo-image-manipulator'
import * as ImagePicker from "expo-image-picker"
import { addDoc, collection } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import React, { useState } from "react"
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from "react-native"
import { AnimatedImage, Picker, Text, TextField, View } from "react-native-ui-lib"
import { auth, db, storage } from "../../firebase"
import { global } from "../../style"

const CreateSubscription = () => {
  const navigation = useNavigation<any>();
  const subscriptionTypes = [
    {label: "Weekly", value: "Weekly"},
    {label: "Monthly", value: "Monthly"},
    {label: "Yearly", value: "Yearly"}
  ]
  const [title, setTitle] = useState<any>(null);
  const [description, setDescription] = useState<any>(null);
  const [image, setImage] = useState<any>(null);
  const [price, setPrice] = useState<any>(0);
  const [subscriptionType, setSubscriptionType] = useState<any>(subscriptionTypes[0]);

  const compress = async (uri: string) => {
    const manipulatedImage = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 300, height: 150 }}], { compress: 0.5 });
    setImage(manipulatedImage.uri);
  };

  const gallery = async () => {
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
        compress(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const onSubmit = async () => {
    let error = false;

    if (!title) {
      error = true;
      // Toast.show("Title is required", {
      //   duration: Toast.durations.LONG,
      //   position: Toast.positions.BOTTOM - 100,
      //   backgroundColor: "red",
      //   opacity: 1,
      //   keyboardAvoiding: true
      // });
      return
    }

    if (!description) {
      error = true;
      // Toast.show("Description is required", {
      //   duration: Toast.durations.LONG,
      //   position: Toast.positions.BOTTOM - 100,
      //   backgroundColor: "red",
      //   opacity: 1,
      //   keyboardAvoiding: true
      // });
      return
    }

    if (!price) {
      error = true;
      // Toast.show("Price is required", {
      //   duration: Toast.durations.LONG,
      //   position: Toast.positions.BOTTOM - 100,
      //   backgroundColor: "red",
      //   opacity: 1,
      //   keyboardAvoiding: true
      // });
      return
    }

    if (Number.isNaN(price)) {
      error = true;
      // Toast.show("Price is not a number", {
      //   duration: Toast.durations.LONG,
      //   position: Toast.positions.BOTTOM - 100,
      //   backgroundColor: "red",
      //   opacity: 1,
      //   keyboardAvoiding: true
      // });
    }

    if (error) {
      error = false;
      return
    }

    // How the image will be addressed inside the storage
    const storage_ref = ref(storage, `images/${auth.currentUser.uid}/subscriptions/${Date.now()}`);

    // Convert image to bytes
    const img = await fetch(image);
    const bytes = await img.blob();

    // Uploads the image bytes to the Firebase Storage
    await uploadBytes(storage_ref, bytes).then(async () => {
      // We retrieve the URL of where the image is located at
      await getDownloadURL(storage_ref).then(async (image) => {
        // Then we create the Market with it's image on it
        await addDoc(collection(db, "Subscriptions"), {
          user: auth.currentUser.uid,
          title: title,
          description: description,
          price: price,
          image: image,
          st: subscriptionType,
        }).then(() => {
          console.log("Data saved!");
          navigation.navigate("Index");
        }).catch((error) => {
          console.log(error);
        });
      });
    })
    .catch((error) => {
      console.log(error);
    });
  };

  return (
    <View useSafeArea flex>
      <ScrollView style={global.flex}>
        <TouchableWithoutFeedback onPress={Platform.OS !== "web" && Keyboard.dismiss}>
          <KeyboardAvoidingView style={global.container} behavior={Platform.OS == "ios" ? "padding" : "height"}>
            <View style={global.field}>
              <Text title>Create Subscription</Text>
            </View>

            <View style={global.field}>
              <Text subtitle>Subscription Title</Text>
              <TextField
                style={global.input}
                placeholder="Enter the subscription title here"
                onChangeText={(value) => setTitle(value)}
                migrate
              />
            </View>

            <View style={global.field}>
              <Text style={global.subtitle}>Subscription Description</Text>
              <TextField
                style={global.textArea}
                placeholder="Enter the subscription description here"
                multiline
                maxLength={100}
                onChangeText={(value) => setDescription(value)}
                migrate
              />
            </View>

            <View style={global.field}>
              <Text style={global.subtitle}>Subscription Image</Text>
              <TouchableOpacity onPress={gallery}>
                {!image
                  ? <AnimatedImage style={{ width: "100%", height: 200 }} source={require("../../assets/image.png")} />
                  : <AnimatedImage style={{ width: "100%", height: 200 }} source={{ uri: image }} />
                }
              </TouchableOpacity>
            </View>

            <View style={global.field}>
              <Text style={global.subtitle}>Subscription Price</Text>
              <TextField
                style={global.input}
                placeholder="Enter the price amount here"
                keyboardType="numeric"
                onChangeText={(value) => setPrice(Number(value))}
                migrate
              />
            </View>

            <View style={global.field}>
              <Text style={global.subtitle}>Subscription Type</Text>
              <Picker  
                value={subscriptionType}
                placeholder={'Subscription Type'}
                onChange={(value) => setSubscriptionType(value)}
                style={global.input} 
                migrate 
                useSafeArea={true} 
                topBarProps={{ title: 'Subscription Types' }} 
                migrateTextField           
              >  
                {subscriptionTypes.map((type) => (   
                  <Picker.Item key={type.value} value={type.value} label={type.label} />
                ))}
              </Picker>
            </View>

            <View style={global.field}>
              <TouchableOpacity style={[global.btn, global.bgOrange]} onPress={onSubmit}>
                <Text style={[global.btnText, global.white]}>Create Subscription</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  );
}

export default CreateSubscription