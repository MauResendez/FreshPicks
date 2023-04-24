import { useNavigation } from "@react-navigation/native"
import * as ImageManipulator from 'expo-image-manipulator'
import * as ImagePicker from "expo-image-picker"
import { addDoc, collection } from "firebase/firestore"
import { Formik } from 'formik'
import React, { useState } from "react"
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback } from "react-native"
import { Button, NumberInput, Picker, Text, TextField, View } from "react-native-ui-lib"
import { auth, db } from "../../firebase"
import { global } from "../../style"

const CreateProduct = () => {
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

  const onSubmit = async (values) => {
    console.log(values);
    
  //   // How the image will be addressed inside the storage
  //   const storage_ref = ref(storage, `images/${auth.currentUser.uid}/products/${Date.now()}`);

  //   // Convert image to bytes
  //   const img = await fetch(image);
  //   const bytes = await img.blob();

  //   // Uploads the image bytes to the Firebase Storage
  //   await uploadBytes(storage_ref, bytes).then(async () => {
  //     // We retrieve the URL of where the image is located at
  //     await getDownloadURL(storage_ref).then(async (image) => {
  //       // Then we create the Market with it's image on it
  //       await addDoc(collection(db, "Products"), values).then(() => {
  //         console.log("Data saved!");
  //         navigation.navigate("Index");
  //       }).catch((error) => {
  //         console.log(error);
  //       });
  //     });
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
  // };

    await addDoc(collection(db, "Products"), values).then(() => {
      console.log("Data saved!");
      navigation.navigate("Index");
    }).catch((error) => {
      console.log(error);
    });
  }

  // const validationSchema = yup.object({
  //   title: yup.string().required('First name is required'),
  //   description: yup.string().required('Last name is required'),
  //   type: yup.string().email('Invalid email address').required('Email is required'),
  //   amount: yup.string().email('Invalid email address').required('Email is required'),
  //   price: yup.string().email('Invalid email address').required('Email is required'),
  //   quantity: yup.number().,
  // });

  return (
    <View useSafeArea flex>
      <ScrollView style={global.flex}>
        <TouchableWithoutFeedback onPress={Platform.OS !== "web" && Keyboard.dismiss}>
          <KeyboardAvoidingView style={global.container} behavior={Platform.OS == "ios" ? "padding" : "height"}>
            <Formik
              initialValues={{ user: auth.currentUser.uid, title: '', description: '', type: '', amount: '', price: 5.00, quantity: 1 }}
              onSubmit={onSubmit}
            >
              {({ handleChange, handleBlur, handleSubmit, values }) => (
                <View>
                  <View style={global.field}>
                    <Text subtitle>Title</Text>
                    <TextField
                      style={global.input}
                      onChangeText={handleChange('title')}
                      onBlur={handleBlur('title')}
                      value={values.title}
                      migrate
                    />
                  </View>

                  <View style={global.field}>
                    <Text subtitle>Description</Text>
                    <TextField
                      style={global.textArea}
                      multiline
                      maxLength={100}
                      onChangeText={handleChange('description')}
                      onBlur={handleBlur('description')}
                      value={values.description}
                      migrate
                    />
                  </View>

                  <View style={global.field}>
                    <Text subtitle>Type</Text>
                    <Picker  
                      value={values.type}
                      style={[global.input, { marginBottom: -16 }]}
                      onChange={handleChange('type')}
                      onBlur={handleBlur('type')}
                      useSafeArea={true} 
                      topBarProps={{ title: 'Type' }} 
                      customPickerProps={{ padding: 64, margin: 64 }}
                    >  
                      {types.map((type) => (   
                        <Picker.Item key={type.value} value={type.value} label={type.label} />
                      ))}
                    </Picker>
                  </View>

                  <View style={global.field}>
                    <Text style={global.subtitle}>Price</Text>
                    <NumberInput
                      initialNumber={values.price}
                      style={global.input}
                      onChangeNumber={() => handleChange('price')}
                      fractionDigits={2}
                      migrate
                    />
                  </View>

                  <View style={global.field}>
                    <Text style={global.subtitle}>Amount</Text>
                    <Picker 
                      value={values.amount} 
                      style={[global.input, { marginBottom: -16 }]}
                      onChange={handleChange('amount')}
                      onBlur={handleBlur('amount')}
                      useSafeArea={true} 
                      topBarProps={{ title: 'Amount' }} 
                      customPickerProps={{ padding: 0, margin: 0 }}
                    >  
                      {amounts.map((type) => (   
                        <Picker.Item key={type.value} value={type.value} label={type.label} />
                      ))}
                    </Picker>
                  </View>

                  <View style={global.field}>
                    <Text style={global.subtitle}>Quantity</Text>
                    <NumberInput
                      initialNumber={values.quantity}
                      style={global.input}
                      onChangeNumber={() => handleChange('quantity')}
                      migrate
                    />
                  </View> 

                  {/* <View style={global.field}>
                    <Text style={global.subtitle}>Listing Image</Text>
                    <TouchableOpacity onPress={gallery}>
                      {!image
                        ? <AnimatedImage style={{ width: "100%", height: 200 }} source={require("../../assets/image.png")} />
                        : <AnimatedImage style={{ width: "100%", height: 200 }} source={{ uri: image }} />
                      }
                    </TouchableOpacity>
                  </View> */}

                  {/* <View style={global.field}>
                    <TouchableOpacity style={[global.btn, global.bgOrange]} onPress={() => handleSubmit}>
                      <Text style={[global.btnText, global.white]}>Create Product</Text>
                    </TouchableOpacity>
                  </View> */}

                  <Button onPress={handleSubmit} title="Submit" />
                </View>
              )}
            </Formik>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  );
}

export default CreateProduct