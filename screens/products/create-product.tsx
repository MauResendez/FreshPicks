import { useNavigation } from "@react-navigation/native"
import * as ImageManipulator from 'expo-image-manipulator'
import * as ImagePicker from "expo-image-picker"
import { addDoc, collection } from "firebase/firestore"
import { Formik } from 'formik'
import React, { useState } from "react"
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native"
import { Button, Colors, KeyboardAwareScrollView, NumberInput, Picker, Text, TextField, View } from "react-native-ui-lib"
import * as Yup from 'yup'
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
  const [image, setImage] = useState<any>(null);

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

  // const hideToast = () => {
  //   setToast("");
  //   setVisible(false);
  // }

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

  const validate = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    type: Yup.string().required('Type is required'),
    amount: Yup.string().required('Amount is required'),
    price: Yup.number().required('Price is required'),
    quantity: Yup.string().required('Quantity is required')
  });

  return (
    <View useSafeArea flex>
      <TouchableWithoutFeedback onPress={Platform.OS !== "web" && Keyboard.dismiss}>
        <KeyboardAwareScrollView style={global.container}>
          <Formik
            initialValues={{ user: auth.currentUser.uid, title: '', description: '', type: '', amount: '', price: 1.00, quantity: 1 }}
            validationSchema={validate}
            onSubmit={onSubmit}
          >
            {({ errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values }) => (
              <View flex>
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
                {errors.title && touched.title && <Text style={{ color: Colors.red30}}>{errors.title}</Text>}

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
                {errors.description && touched.description && <Text style={{ color: Colors.red30}}>{errors.description}</Text>}

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
                {errors.type && touched.type && <Text style={{ color: Colors.red30}}>{errors.type}</Text>}

                <View style={global.field}>
                  <Text subtitle>Price</Text>
                  <NumberInput
                    initialNumber={values.price}
                    style={global.input}
                    onChangeNumber={(data) => setFieldValue("price", data.number)}
                    onBlur={handleBlur('price')}
                    keyboardType={'numeric'}
                    fractionDigits={2}
                    migrate
                  />
                </View>
                {errors.price && touched.price && <Text style={{ color: Colors.red30}}>{errors.price}</Text>}

                <View style={global.field}>
                  <Text subtitle>Amount</Text>
                  <Picker 
                    style={[global.input, { marginBottom: -16 }]}
                    value={values.amount} 
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
                {errors.amount && touched.amount && <Text style={{ color: Colors.red30}}>{errors.amount}</Text>}

                <View style={global.field}>
                  <Text subtitle>Quantity</Text>
                  <NumberInput
                    initialNumber={values.quantity}
                    style={global.input}
                    onChangeNumber={(data) => setFieldValue("quantity", data.number)}
                    onBlur={handleBlur('quantity')}
                    keyboardType={'numeric'}
                    fractionDigits={2}
                    migrate
                  />
                </View>
                {errors.quantity && touched.quantity && <Text style={{ color: Colors.red30}}>{errors.quantity}</Text>}

                {/* <View style={global.field}>
                  <Text subtitle>Listing Image</Text>
                  <TouchableOpacity onPress={gallery}>
                    {!image
                      ? <AnimatedImage style={{ width: "100%", height: 200 }} source={require("../../assets/image.png")} />
                      : <AnimatedImage style={{ width: "100%", height: 200 }} source={{ uri: image }} />
                    }
                  </TouchableOpacity>
                </View> */}

                <Button 
                  backgroundColor={"#ff4500"}
                  color={Colors.white}
                  label={"Create Product"} 
                  labelStyle={{ fontWeight: '600', padding: 8 }} 
                  style={global.btnTest} 
                  onPress={() => handleSubmit()}                
                />
              </View>
            )}
          </Formik>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default CreateProduct