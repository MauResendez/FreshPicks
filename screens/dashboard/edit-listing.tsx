import { useNavigation, useRoute } from "@react-navigation/native"
import * as ImagePicker from "expo-image-picker"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import React, { useEffect, useState } from "react"
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native"
import SelectDropdown from "react-native-select-dropdown"
import { Button, Text, TextField, View } from "react-native-ui-lib"
import Loading from "../../components/extra/loading"
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
  const produceTypes = ["Fruits", "Vegetables", "Dairy & Eggs", "Herbs", "Microgreens", "Other"];
  const quantityTypes = ["Each", "LB", "Bunch"];
  const [title, setTitle] = useState<any>("");
  const [description, setDescription] = useState<any>("");
  const [image, setImage] = useState<any>("");
  const [price, setPrice] = useState<any>(0);
  const [produceType, setProduceType] = useState<any>(produceTypes[0]);
  const [quantity, setQuantity] = useState<any>("");
  const [quantityType, setQuantityType] = useState<any>(quantityTypes[0]);
  const [loading, setLoading] = useState<any>(true);

  const selectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    try {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        aspect: [4, 3],
        quality: 0.25,
      });

      if (!result.cancelled) {
        setImage(result.uri);
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
    const storage_ref = ref(storage, `images/${auth.currentUser.uid}/listings/${Date.now()}`);

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
        await updateDoc(doc(db, "Listings", route.params.id), {
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
      getDoc(doc(db, "Listings", route.params.id)).then((docSnapshot) => {
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
      <Loading />
    )
  }
  
  return (
    <View useSafeArea flex>
      <ScrollView contentContainerStyle={styles.spread}>
        <KeyboardAvoidingView style={[global.center]} behavior={Platform.OS == "ios" ? "padding" : "height"}>
          <View style={global.field}>
            <Text subtitle>Listing Title</Text>
            <TextField value={title} style={global.input} placeholder="Enter the listing title here" onChangeText={(value) => setTitle(value)} />
          </View>
          <View style={global.field}>
            <Text subtitle>Listing Description</Text>
            <TextField value={description} style={global.textArea} placeholder="Enter the listing description here" multiline maxLength={100} onChangeText={(value) => setDescription(value)} />
          </View>
          <View style={global.field}>
            <Text subtitle>Listing Image</Text>
            <Button title="Produce Image" color="green" onPress={selectImage}/>
          </View>
          <View style={global.field}>
            <Text subtitle>Listing Price</Text>
            <TextField style={global.input} keyboardType="number-pad" onChangeText={(value) => setDescription(Number(value))} />
          </View>
          <View style={global.field}>
            <Text subtitle>Listing Type</Text>
            <SelectDropdown 
              defaultValue={produceType}
              data={produceTypes}
              buttonStyle={global.input}
              rowStyle={global.dropdown} 
              onSelect={(selected, index) => { setProduceType(selected) }} 
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
          </View>
          <View style={global.field}>
            <Text subtitle>Quantity</Text>
            <TextField value={quantity} style={global.input} placeholder="Enter the quantity amount here" keyboardType="numeric" onChangeText={(value) => setQuantity(value)} />
          </View>
          <View style={global.field}>
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
          </View>
          <View style={global.field}>
            <Button style={global.button} title="Submit" onPress={onSubmit} />
          </View>
        </KeyboardAvoidingView>
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