import { useNavigation } from "@react-navigation/native"
import * as ImageManipulator from 'expo-image-manipulator'
import * as ImagePicker from "expo-image-picker"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { Formik } from 'formik'
import React, { useEffect, useState } from "react"
import { Alert, Keyboard, Platform, TouchableOpacity, TouchableWithoutFeedback } from "react-native"
import CurrencyInput from "react-native-currency-input"
import { Button, Colors, Image, KeyboardAwareScrollView, LoaderScreen, Picker, Text, TextField, View } from "react-native-ui-lib"
import * as Yup from 'yup'
import { auth, db, storage } from "../../firebase"
import { global } from "../../style"

const EditProduct = ({ route }) => {
  const navigation = useNavigation<any>();
  const [product, setProduct] = useState<any>(null);
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
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState(false);

  const checkIfImageIsAppropriate = async (images) => {
    try {
      const response = await fetch("https://us-central1-utrgvfreshpicks.cloudfunctions.net/checkIfImageIsAppropriate", {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'data': {
            'image': images[0],
          }
        }),
      });

      // console.log(response);

      const json = await response.json();

      console.log(json);

      return json;
    } catch (error) {
      console.error(error);
    }
  }

  const compress = async (result: ImagePicker.ImagePickerResult, setFieldValue) => {
    const compressed = [];
    
    result.assets.forEach(async (asset) => {
      const manipulatedImage = await ImageManipulator.manipulateAsync(asset.uri, [{ resize: { height: 400 }}], { compress: 0 });

      compressed.push(manipulatedImage.uri);
    });

    const i = await checkIfImageIsAppropriate(result.assets);

    if (!i.result) {
      Alert.alert("Image has inappropriate content", "The image has been scanned to have some inappropriate content. Please select another image to upload.", [
        {text: 'OK', style: 'cancel'},
      ]);
    } else {
      setFieldValue('images', compressed)
    }
  };

  const camera = async (setFieldValue) => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    try {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchCameraAsync({
        base64: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 0,
      });

      if (!result.canceled) {
        compress(result, setFieldValue);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const gallery = async (setFieldValue) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    try {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        base64: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 0,
      });

      if (!result.canceled) {
        compress(result, setFieldValue);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const uploadImages = async (images) => {
    const imagePromises = Array.from(images, (image) => uploadImage(image));
  
    const imageRes = await Promise.all(imagePromises);
    return imageRes; // list of url like ["https://..", ...]
  }

  const uploadImage = async (image) => {
    const storageRef = ref(storage, `${auth.currentUser.uid}/images/${Date.now()}`);
    const img = await fetch(image);
    const blob = await img.blob();

    const response = await uploadBytesResumable(storageRef, blob);
    const url = await getDownloadURL(response.ref);
    return url;
  }

  const editProduct = async (values, images) => {
    await updateDoc(doc(db, "Products", route.params.id), {
      amount: values.amount,
      description: values.description,
      images: images,
      price: values.price,
      title: values.title,
      type: values.type,
      user: values.user,
    }).then(() => {
      console.log("Data saved!");
      navigation.goBack();
    }).catch((error) => {
      console.log(error);
    });
  };

  const handleSubmit = async (values) => {
    try {
      // console.log(values.images[0]);
      const imgs = await uploadImages(values.images);
      // const oldImg = ref(storage, values.images[0]);
      // await deleteObject(oldImg);
      await editProduct(values, imgs);
    } catch (error) {
      console.log(error);
    }
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
      console.log(product);
      setLoading(false);
    }
  }, [product]);

  if (loading) {
    return (
      <LoaderScreen color={"#32CD32"} />
    )
  }

  const validate = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    type: Yup.string().required('Type is required'),
    amount: Yup.string().required('Amount is required'),
    price: Yup.number().required('Price is required'),
  });
  
  return (
    <View useSafeArea flex>
      <TouchableWithoutFeedback onPress={Platform.OS !== "web" && Keyboard.dismiss}>
        <KeyboardAwareScrollView>
          <Formik 
            initialValues={product || { user: "", title: "", description: "", type: '', amount: "", price: 1, images: [] }} 
            onSubmit={handleSubmit}
            validationSchema={validate}
            enableReinitialize={true}
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
                {errors.type && touched.type && <Text style={{ color: Colors.red30}}>{errors.type}</Text>}

                <View style={global.field}>
                  <Text subtitle>Price</Text>
                  <CurrencyInput
                    value={values.price}
                    onChangeValue={(price) => setFieldValue("price", price)}
                    style={global.input}
                    prefix={"$ "}
                    delimiter=","
                    separator="."
                    precision={2}
                    minValue={0}
                    onChangeText={(formattedValue) => {
                      console.log(formattedValue); // R$ +2.310,46
                    }}
                  />
                </View>
                {errors.price && touched.price && <Text style={{ color: Colors.red30}}>{errors.price}</Text>}

                <View style={global.field}>
                  <Text subtitle>Amount</Text>
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
                {errors.amount && touched.amount && <Text style={{ color: Colors.red30}}>{errors.amount}</Text>}

                <View style={global.field}>
                  <Text subtitle>Image</Text>
                  <TouchableOpacity onPress={() => Alert.alert("Options", "Select photo from which option", [
                    {text: 'Cancel', style: 'cancel'},
                    {text: 'Camera', onPress: async () => await camera(setFieldValue)},
                    {text: 'Gallery', onPress: async () => await gallery(setFieldValue)},
                  ])}>
                    {values.images.length == 0
                      ? <Image style={{ width: "100%", height: 150 }} source={require("../../assets/image.png")} />
                      : <Image style={{ width: "100%", height: 150 }} source={{ uri: values.images[0] }} />
                    }
                  </TouchableOpacity>
                </View>

                <Button 
                  backgroundColor={Colors.primary}
                  color={Colors.white}
                  label={"Edit Product"} 
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
  )
}

export default EditProduct