import { useNavigation, useRoute } from "@react-navigation/native"
import * as ImageManipulator from 'expo-image-manipulator'
import * as ImagePicker from "expo-image-picker"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { Formik } from 'formik'
import React, { useEffect, useState } from "react"
import { Keyboard, Platform, TouchableOpacity, TouchableWithoutFeedback } from "react-native"
import { Colors, KeyboardAwareScrollView, LoaderScreen, NumberInput, Picker, Text, TextField, View } from "react-native-ui-lib"
import * as Yup from 'yup'
import { db } from "../../firebase"
import { global } from "../../style"

const EditProduct = ({ route }) => {
  const {
    params: {
      id
    }
  } = useRoute<any>();

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

  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);


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
    
    await updateDoc(doc(db, "Products", route.params.id), values).then(() => {
      console.log("Data saved!");
      navigation.navigate("Index");
    }).catch((error) => {
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
    quantity: Yup.string().required('Quantity is required')
  });
  
  return (
    <View useSafeArea flex>
      <TouchableWithoutFeedback onPress={Platform.OS !== "web" && Keyboard.dismiss}>
        <KeyboardAwareScrollView style={global.container}>
          <Formik 
            initialValues={product || { user: "", title: "", description: "", amount: "", price: 1, quantity: 1 }} 
            onSubmit={onSubmit}
            validationSchema={validate}
            enableReinitialize={true}
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

                <View style={global.field}>
                  <TouchableOpacity style={[global.btn, global.bgOrange]} onPress={() => handleSubmit()}>
                    <Text style={[global.btnText, global.white]}>Edit Product</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </View>
  )
}

export default EditProduct