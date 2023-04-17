import { useNavigation, useRoute } from "@react-navigation/native"
import * as ImageManipulator from 'expo-image-manipulator'
import * as ImagePicker from "expo-image-picker"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import React, { useEffect, useState } from "react"
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from "react-native"
import { AnimatedImage, LoaderScreen, Picker, Text, TextField, View } from "react-native-ui-lib"
import { auth, db, storage } from "../../firebase"
import { global } from "../../style"

const EditListing = ({ route }) => {
  const {
    params: {
      id
    }
  } = useRoute<any>();

  const navigation = useNavigation<any>();
  const [product, setProduct] = useState<any>(null);
  const produceTypes = [
    {label: "Fruits", value: "Fruits"},
    {label: "Vegetables", value: "Vegetables"},
    {label: "Dairy", value: "Dairy"},
    {label: "Meat", value: "Meat"},
    {label: "Deli", value: "Deli"},
    {label: "Bakery", value: "Bakery"},
    {label: "Frozen", value: "Frozen"},
    {label: "Other", value: "Other"},
  ]
  const quantityTypes = [
    {label: 'Each', value: 'Each'},
    {label: 'LB', value: 'LB'},
    {label: 'Bunch', value: 'Bunch'},
  ]
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<any>("");
  const [price, setPrice] = useState<number>(0);
  const [produceType, setProduceType] = useState<any>(produceTypes[0]);
  const [quantity, setQuantity] = useState<any>("");
  const [quantityType, setQuantityType] = useState<any>(quantityTypes[0]);
  const [loading, setLoading] = useState<any>(true);

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

    if (title.length == 0) {
      error = true;
      // Toast.show("Title is required", {
      //   duration: Toast.durations.LONG,
      //   backgroundColor: "yellow",
      //   position: Platform.OS == "web" ? 650 : 700
      // });
    }

    if (description.length == 0) {
      error = true;
      // Toast.show("Description is required", {
      //   duration: Toast.durations.LONG,
      //   backgroundColor: "yellow",
      //   position: Platform.OS == "web" ? 650 : 700
      // });
    }

    if (error) {
      error = false;
      return
    }

    console.log("Past here 1");

    // How the image will be addressed inside the storage
    const storage_ref = ref(storage, `images/${auth.currentUser.uid}/products/${Date.now()}`);

    console.log("Past here 2");

    // Convert image to bytes
    const img = await fetch(image);
    const bytes = await img.blob();

    console.log("Past here 3");

    // Uploads the image bytes to the Firebase Storage
    await uploadBytes(storage_ref, bytes).then(async () => {
      console.log("Past here 4");
      // We retrieve the URL of where the image is located at
      await getDownloadURL(storage_ref).then(async (image) => {
        // Then we create the Market with it's image on it
        console.log("Past here 5");
        await updateDoc(doc(db, "Products", route.params.id), {
          user: auth.currentUser.uid,
          title: title,
          description: description,
          quantity: quantity,
          price: price,
          image: image,
          qt: quantityType,
          pt: produceType
        })
          .then(() => {
            console.log("Data saved!");
            navigation.navigate("Index");
          })
          .catch((error) => {
            console.log(error);
          });
      });
    })
    .catch((error) => {
      console.log(error);
    });
  };

  useEffect(() => {
    if (route.params.id) {
      getDoc(doc(db, "Products", route.params.id)).then((docSnapshot) => {
        const data = docSnapshot.data();
        setProduct(data);
      });
    }
  }, [route.params.id]);

  useEffect(() => {
    if (product) {
      setTitle(product.title);
      setDescription(product.description);
      setImage(product.image);
      setPrice(product.price);
      setProduceType(product.pt);
      console.log(product);
      setQuantity(product.quantity);
      setQuantityType(product.qt);
      setLoading(false);
    }
  }, [product])

  if (loading) {
    return (
      <LoaderScreen color={"#32CD32"} />
    )
  }
  
  return (
    <View useSafeArea flex>
      <ScrollView style={global.flex}>
        <TouchableWithoutFeedback onPress={Platform.OS !== "web" && Keyboard.dismiss}>
          <KeyboardAvoidingView style={global.container} behavior={Platform.OS == "ios" ? "padding" : "height"}>
            <View style={global.field}>
              <Text subtitle>Listing Title</Text>
              <TextField value={title} style={global.input} placeholder="Enter the listing title here" onChangeText={(value) => setTitle(value)} />
            </View>

            <View style={global.field}>
              <Text subtitle>Listing Description</Text>
              <TextField value={description} style={global.textArea} placeholder="Enter the listing description here" multiline maxLength={100} onChangeText={(value) => setDescription(value)} />
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
              <Text subtitle>Listing Price</Text>
              <TextField value={String(price)} style={global.input} keyboardType="number-pad" onChangeText={(value) => setPrice(Number(value))} />
            </View>

            <View style={global.field}>
              <Text style={global.subtitle}>Listing Type</Text>
              <Picker  
                value={produceType}
                placeholder={'Listing Type'}
                onChange={(value) => setProduceType(value)}
                style={global.input} 
                migrate 
                useSafeArea={true} 
                topBarProps={{ title: 'Listing Types' }} 
                migrateTextField           
              >  
                {produceTypes.map((type) => (   
                  <Picker.Item key={type.value} value={type.value} label={type.label} />
                ))}
              </Picker>
            </View>

            <View style={global.field}>
              <Text subtitle>Quantity</Text>
              <TextField value={String(quantity)} style={global.input} placeholder="Enter the quantity amount here" keyboardType="numeric" onChangeText={(value) => setQuantity(value)} />
            </View>

            {/* <View style={global.field}>
              <Text subtitle>Quantity Type</Text>
              <SelectDropdown 
                defaultValue={quantityType}
                data={quantityTypes} 
                buttonStyle={global.input}
                rowStyle={global.dropdown} 
                onSelect={(selected, index) => { setQuantityType(selected) }} 
                buttonTextAfterSelection={(selectedItem, index) => {
                  // text represented after item is selected
                  // if data array is an array of objects then return selectedItem.property to render after item is selected
                  return selectedItem
                }}
                rowTextForSelection={(item, index) => {
                  // text represented for each item in dropdown
                  // if data array is an array of objects then return item.property to represent item in dropdown
                  return item
                }}
              />
            </View> */}

            <View style={global.field}>
              <Text style={global.subtitle}>Quantity Type</Text>
              <Picker  
                value={quantityType}
                placeholder={'Quantity Type'}
                onChange={(value) => setQuantityType(value)}
                style={global.input} 
                migrate 
                useSafeArea={true} 
                topBarProps={{ title: 'Quantity Types' }} 
                migrateTextField           
              >  
                {quantityTypes.map((type) => (   
                  <Picker.Item key={type.value} value={type.value} label={type.label} />
                ))}
              </Picker>
            </View>

            <View style={global.field}>
              <TouchableOpacity style={[global.btn, global.bgOrange]} onPress={onSubmit}>
                <Text style={[global.btnText, global.white]}>Edit Listing</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  spread: {
    justifyContent: "space-evenly"
  }
});

export default EditListing