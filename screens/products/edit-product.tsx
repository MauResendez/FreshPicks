import { useNavigation, useRoute } from "@react-navigation/native"
import * as ImageManipulator from 'expo-image-manipulator'
import * as ImagePicker from "expo-image-picker"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { Formik } from 'formik'
import React, { useEffect, useState } from "react"
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback } from "react-native"
import { Button, LoaderScreen, NumberInput, Picker, Text, TextField, View } from "react-native-ui-lib"
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
  const [initialValues, setInitialValues] = useState<boolean>(false);

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
  
  return (
    <View useSafeArea flex>
      <ScrollView style={global.flex}>
        <TouchableWithoutFeedback onPress={Platform.OS !== "web" && Keyboard.dismiss}>
          <KeyboardAvoidingView style={global.container} behavior={Platform.OS == "ios" ? "padding" : "height"}>
            <Formik 
              initialValues={product || { user: "", title: "", description: "", amount: "", price: "", quantity: "" }} 
              onSubmit={onSubmit}
              enableReinitialize={true}
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
  )
}

export default EditProduct