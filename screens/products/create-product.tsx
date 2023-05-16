import { useNavigation } from "@react-navigation/native"
import * as ImageManipulator from 'expo-image-manipulator'
import * as ImagePicker from "expo-image-picker"
import { addDoc, collection } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { Formik } from 'formik'
import React from "react"
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native"
import { AnimatedImage, Button, Colors, KeyboardAwareScrollView, NumberInput, Picker, Text, TextField, TouchableOpacity, View } from "react-native-ui-lib"
import Ionicon from 'react-native-vector-icons/Ionicons'
import * as Yup from 'yup'
import { auth, db, storage } from "../../firebase"
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

  const compress = async (uri: string, setFieldValue) => {
    const manipulatedImage = await ImageManipulator.manipulateAsync(uri, [{ resize: { height: 512 }}], { compress: 1 });
    setFieldValue('image', manipulatedImage.uri)
  };

  const gallery = async (setFieldValue) => {
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
        quality: 1,
      });

      if (!result.canceled) {
        compress(result.assets[0].uri, setFieldValue);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = async (values) => {
    console.log(values.image);
    const imgs = await uploadImages(values.image);
    await createProduct(values, auth.currentUser, imgs);
  };

  const uploadImage = async (image) => {
    const storageRef = ref(storage, `${auth.currentUser.uid}/images/${Date.now()}`);
    const img = await fetch(image);
    const blob = await img.blob();

    const response = await uploadBytesResumable(storageRef, blob);
    const url = await getDownloadURL(response.ref);
    return url;
  }
  
  const uploadImages = async (images) => {
    const imagePromises = Array.from(images, (image) => uploadImage(image));
  
    const imageRes = await Promise.all(imagePromises);
    return imageRes; // list of url like ["https://..", ...]
  }

  const validate = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    type: Yup.string().required('Type is required'),
    amount: Yup.string().required('Amount is required'),
    price: Yup.number().required('Price is required'),
    quantity: Yup.string().required('Quantity is required')
  });

  const createProduct = async (values, user, u) => {
    await addDoc(collection(db, "Products"), values).then(() => {
      console.log("Data saved!");
      navigation.navigate("Index");
    }).catch((error) => {
      console.log(error);
    });
  };

  return (
    <View useSafeArea flex>
      <TouchableWithoutFeedback onPress={Platform.OS !== "web" && Keyboard.dismiss}>
        <KeyboardAwareScrollView>
          <Formik
            initialValues={{ user: auth.currentUser.uid, title: '', description: '', type: '', amount: '', price: 1.00, quantity: 1, image: [] }}
            validationSchema={validate}
            onSubmit={handleSubmit}
          >
            {({ errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values }) => (
              <View flex style={global.container}>
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
                {errors.type && touched.type && <Text style={{ color: Colors.red30 }}>{errors.type}</Text>}

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
                    leadingAccessory={<Ionicon name="search" color={Colors.grey30} size={20} style={{ marginRight: 8 }} />}
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

                <View style={global.field}>
                  <Text subtitle>Image</Text>
                  <TouchableOpacity onPress={() => gallery(setFieldValue)}>
                    {values.image.length == 0
                      ? <AnimatedImage style={{ width: "100%", height: 150 }} source={require("../../assets/image.png")} />
                      : <AnimatedImage style={{ width: "100%", height: 150 }} source={{ uri: values.image }} />
                    }
                  </TouchableOpacity>
                </View>

                <View style={global.field}>
                  <Button 
                    backgroundColor={"#ff4500"}
                    color={Colors.white}
                    label={"Create Product"} 
                    labelStyle={{ fontWeight: '600', padding: 8 }} 
                    style={global.btn}
                    onPress={handleSubmit}                
                  />
                </View>
              </View>
            )}
          </Formik>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default CreateProduct