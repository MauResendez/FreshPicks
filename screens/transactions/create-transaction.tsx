import { useNavigation } from "@react-navigation/native"
import * as ImageManipulator from 'expo-image-manipulator'
import * as ImagePicker from "expo-image-picker"
import { addDoc, collection } from "firebase/firestore"
import { Formik } from 'formik'
import React, { useState } from "react"
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native"
import { Button, Colors, DateTimePicker, KeyboardAwareScrollView, NumberInput, Picker, Text, TextField, View } from "react-native-ui-lib"
import { auth, db } from "../../firebase"
import { global } from "../../style"

const CreateTransaction = () => {
  const navigation = useNavigation<any>();
  const types = [
    {label: "Expense", value: "Expense"},
    {label: "Revenue", value: "Revenue"},
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

    await addDoc(collection(db, "Transactions"), values).then(() => {
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
      <TouchableWithoutFeedback onPress={Platform.OS !== "web" && Keyboard.dismiss}>
        <KeyboardAwareScrollView style={global.container} contentContainerStyle={global.flex}>
          <Formik
            initialValues={{ user: auth.currentUser.uid, title: '', vendor: '', type: '', price: 0.00, product: '', category: '', notes: '', date: new Date() }}
            onSubmit={onSubmit}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <View flex>
                <View row spread style={{ paddingVertical: 8 }}>
                  <View style={{ width: "30%" }}>
                    <Text subtitle>Type</Text>
                    <Picker  
                      value={values.type}
                      style={[global.input, { marginBottom: -16 }]}
                      placeholder={'Type'}
                      onChange={handleChange('type')}
                      onBlur={handleBlur('type')}
                      useSafeArea={true} 
                      topBarProps={{ title: 'Type' }} 
                    >  
                      {types.map((type) => (   
                        <Picker.Item key={type.value} value={type.value} label={type.label} />
                      ))}
                    </Picker>
                  </View>

                  <View style={{ width: "30%" }}>
                    <Text subtitle>Price</Text>
                    <NumberInput
                      initialNumber={values.price}
                      style={global.input}
                      placeholder="Enter the price here"
                      onChangeNumber={() => handleChange('price')}
                      fractionDigits={2}
                      migrate
                    />
                  </View>

                  <View style={{ width: "30%" }}>
                    <Text subtitle>Date</Text>
                    <DateTimePicker value={new Date()} style={global.input} placeholder="Transaction Date" timeFormat={'HH:mm'}  />
                  </View>
                </View>

                <View style={global.field}>
                  {values.type == 'Expense' 
                    ? <Text subtitle>Vendor Name</Text>
                    : <Text subtitle>Customer Name</Text>
                  }
                  <TextField
                    style={global.input}
                    onChangeText={handleChange('vendor')}
                    onBlur={handleBlur('vendor')}
                    value={values.vendor}
                    migrate
                  />
                </View>

                <View style={global.field}>
                  <Text subtitle>Product</Text>
                  <Picker  
                    value={values.type}
                    style={[global.input, { marginBottom: -16 }]}
                    placeholder={'Type'}
                    onChange={handleChange('type')}
                    onBlur={handleBlur('type')}
                    useSafeArea={true} 
                    topBarProps={{ title: 'Type' }} 
                  >  
                    {types.map((type) => (   
                      <Picker.Item key={type.value} value={type.value} label={type.label} />
                    ))}
                  </Picker>
                </View>

                <View style={global.field}>
                  <Text subtitle>Category</Text>
                  <NumberInput
                    initialNumber={values.price}
                    style={global.input}
                    placeholder="Enter the price here"
                    onChangeNumber={() => handleChange('price')}
                    fractionDigits={2}
                    migrate
                  />
                </View>

                <View style={global.field}>
                  <Text subtitle>Notes</Text>
                  <TextField
                    style={global.textArea}
                    multiline
                    maxLength={100}
                    onChangeText={handleChange('notes')}
                    onBlur={handleBlur('notes')}
                    value={values.notes}
                    migrate
                  />
                </View>

                {/* <View style={global.field}>
                  <Text subtitle>Listing Image</Text>
                  <TouchableOpacity onPress={gallery}>
                    {!image
                      ? <AnimatedImage style={{ width: "100%", height: 200 }} source={require("../../assets/image.png")} />
                      : <AnimatedImage style={{ width: "100%", height: 200 }} source={{ uri: image }} />
                    }
                  </TouchableOpacity>
                </View> */}

                <View flexG />

                <Button 
                  backgroundColor={"#ff4500"}
                  color={Colors.white}
                  label={"Create Transaction"} 
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

export default CreateTransaction