import { useNavigation } from "@react-navigation/native"
import * as ImageManipulator from 'expo-image-manipulator'
import * as ImagePicker from "expo-image-picker"
import { addDoc, collection } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import React, { useState } from "react"
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from "react-native"
import { AnimatedImage, DateTimePicker, Picker, Text, TextField, View } from "react-native-ui-lib"
import { auth, db, storage } from "../../firebase"
import { global } from "../../style"

const CreateListing = () => {
  const navigation = useNavigation<any>();
  const types = [
    {label: "Fruits", value: "Fruits"},
    {label: "Vegetables", value: "Vegetables"},
    {label: "Dairy", value: "Dairy"},
    {label: "Meat", value: "Meat"},
    {label: "Deli", value: "Deli"},
    {label: "Bakery", value: "Bakery"},
    {label: "Frozen", value: "Frozen"},
    {label: "Other", value: "Other"},
  ]
  const amounts = [
    {label: 'Each', value: 'Each'},
    {label: 'LB', value: 'LB'},
    {label: 'Bunch', value: 'Bunch'},
  ]
  const [title, setTitle] = useState<any>(null);
  const [description, setDescription] = useState<any>(null);
  const [image, setImage] = useState<any>(null);
  const [price, setPrice] = useState<any>(0);
  const [expiration, setExpiration] = useState<any>(new Date());
  const [type, setType] = useState<any>(types[0]);
  const [quantity, setQuantity] = useState<any>(null);
  const [amount, setAmount] = useState<any>(amounts[0]);

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

    if (!quantity) {
      error = true;
      // Toast.show("Quantity is required", {
      //   duration: Toast.durations.LONG,
      //   position: Toast.positions.BOTTOM - 100,
      //   backgroundColor: "red",
      //   opacity: 1,
      //   keyboardAvoiding: true
      // });
      return
    }

    if (!Number.isInteger(quantity)) {
      error = true;
      // Toast.show("Quantity is not a number", {
      //   duration: Toast.durations.LONG,
      //   position: Toast.positions.BOTTOM - 100,
      //   backgroundColor: "red",
      //   opacity: 1,
      //   keyboardAvoiding: true
      // });
      return
    }

    if (error) {
      error = false;
      return
    }

    // How the image will be addressed inside the storage
    const storage_ref = ref(storage, `images/${auth.currentUser.uid}/listings/${Date.now()}`);

    // Convert image to bytes
    const img = await fetch(image);
    const bytes = await img.blob();

    // Uploads the image bytes to the Firebase Storage
    await uploadBytes(storage_ref, bytes).then(async () => {
      // We retrieve the URL of where the image is located at
      await getDownloadURL(storage_ref).then(async (image) => {
        // Then we create the Market with it's image on it
        await addDoc(collection(db, "Listings"), {
          user: auth.currentUser.uid,
          title: title,
          description: description,
          quantity: quantity,
          price: price,
          image: image,
          amount: amount,
          type: type,
          expiration: expiration
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
              <Text title>Create Listing</Text>
            </View>

            <View style={global.field}>
              <Text subtitle>Listing Title</Text>
              <TextField
                style={global.input}
                placeholder="Enter the listing title here"
                onChangeText={(value) => setTitle(value)}
                migrate
              />
            </View>

            <View style={global.field}>
              <Text style={global.subtitle}>Listing Description</Text>
              <TextField
                style={global.textArea}
                placeholder="Enter the listing description here"
                multiline
                maxLength={100}
                onChangeText={(value) => setDescription(value)}
                migrate
              />
            </View>

            <View style={global.field}>
              <Text style={global.subtitle}>Listing Image</Text>
              <TouchableOpacity onPress={gallery}>
                {!image
                  ? <AnimatedImage style={{ width: "100%", height: 200 }} source={require("../../assets/image.png")} />
                  : <AnimatedImage style={{ width: "100%", height: 200 }} source={{ uri: image }} />
                }
              </TouchableOpacity>
            </View>

            <View style={global.field}>
              <Text style={global.subtitle}>Price</Text>
              <TextField
                style={global.input}
                placeholder="Enter the price amount here"
                keyboardType="numeric"
                onChangeText={(value) => setPrice(Number(value))}
                migrate
              />
            </View>

            <View style={global.field}>
              <Text style={global.subtitle}>Type</Text>
              <Picker  
                value={type}
                placeholder={'Listing Type'}
                onChange={(value) => setType(value)}
                style={global.input} 
                migrate 
                useSafeArea={true} 
                topBarProps={{ title: 'Type' }} 
                migrateTextField           
              >  
                {types.map((type) => (   
                  <Picker.Item key={type.value} value={type.value} label={type.label} />
                ))}
              </Picker>
            </View>

            <View style={global.field}>
              <Text style={global.subtitle}>Quantity</Text>
              <TextField
                style={global.input}
                placeholder="Enter the quantity amount here"
                keyboardType="number-pad"
                onChangeText={(value) => setQuantity(Number(value))}
                migrate
              />
            </View>

            <View style={global.field}>
              <Text style={global.subtitle}>Amount</Text>
              <Picker  
                value={amount}
                placeholder={'Quantity Type'}
                onChange={(value) => setAmount(value)}
                style={global.input}
                useSafeArea={true} 
                topBarProps={{ title: 'Amount' }} 
              >  
                {amounts.map((type) => (   
                  <Picker.Item key={type.value} value={type.value} label={type.label} />
                ))}
              </Picker>
            </View>

            <View style={global.field}>
              <Text subtitle>Expiration Date</Text>
              <DateTimePicker style={global.input} mode="date" placeholder="Expiration Date" onChange={(date) => setExpiration(date)} minimumDate={new Date()} migrateTextField />
            </View>

            <View style={global.field}>
              <TouchableOpacity style={[global.btn, global.bgOrange]} onPress={onSubmit}>
                <Text style={[global.btnText, global.white]}>Create Post</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  );
}

export default CreateListing