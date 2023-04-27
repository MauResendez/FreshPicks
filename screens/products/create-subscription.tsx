import { useNavigation } from "@react-navigation/native"
import * as ImageManipulator from 'expo-image-manipulator'
import * as ImagePicker from "expo-image-picker"
import { addDoc, collection } from "firebase/firestore"
import { Formik } from "formik"
import React, { useState } from "react"
import { Keyboard, Platform, TouchableOpacity, TouchableWithoutFeedback } from "react-native"
import { Colors, KeyboardAwareScrollView, NumberInput, Picker, Text, TextField, View } from "react-native-ui-lib"
import * as Yup from 'yup'
import { auth, db } from "../../firebase"
import { global } from "../../style"

const CreateSubscription = () => {
  const navigation = useNavigation<any>();
  const subscriptionTypes = [
    {label: "Weekly", value: "Weekly"},
    {label: "Monthly", value: "Monthly"},
    {label: "Yearly", value: "Yearly"}
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

  // const onSubmit = async () => {
  //   let error = false;

  //   if (!title) {
  //     error = true;
  //     // Toast.show("Title is required", {
  //     //   duration: Toast.durations.LONG,
  //     //   position: Toast.positions.BOTTOM - 100,
  //     //   backgroundColor: "red",
  //     //   opacity: 1,
  //     //   keyboardAvoiding: true
  //     // });
  //     return
  //   }

  //   if (!description) {
  //     error = true;
  //     // Toast.show("Description is required", {
  //     //   duration: Toast.durations.LONG,
  //     //   position: Toast.positions.BOTTOM - 100,
  //     //   backgroundColor: "red",
  //     //   opacity: 1,
  //     //   keyboardAvoiding: true
  //     // });
  //     return
  //   }

  //   if (!price) {
  //     error = true;
  //     // Toast.show("Price is required", {
  //     //   duration: Toast.durations.LONG,
  //     //   position: Toast.positions.BOTTOM - 100,
  //     //   backgroundColor: "red",
  //     //   opacity: 1,
  //     //   keyboardAvoiding: true
  //     // });
  //     return
  //   }

  //   if (Number.isNaN(price)) {
  //     error = true;
  //     // Toast.show("Price is not a number", {
  //     //   duration: Toast.durations.LONG,
  //     //   position: Toast.positions.BOTTOM - 100,
  //     //   backgroundColor: "red",
  //     //   opacity: 1,
  //     //   keyboardAvoiding: true
  //     // });
  //   }

  //   if (error) {
  //     error = false;
  //     return
  //   }

  //   // How the image will be addressed inside the storage
  //   const storage_ref = ref(storage, `images/${auth.currentUser.uid}/subscriptions/${Date.now()}`);

  //   // Convert image to bytes
  //   const img = await fetch(image);
  //   const bytes = await img.blob();

  //   // Uploads the image bytes to the Firebase Storage
  //   await uploadBytes(storage_ref, bytes).then(async () => {
  //     // We retrieve the URL of where the image is located at
  //     await getDownloadURL(storage_ref).then(async (image) => {
  //       // Then we create the Market with it's image on it
  //       await addDoc(collection(db, "Subscriptions"), {
  //         user: auth.currentUser.uid,
  //         title: title,
  //         description: description,
  //         price: price,
  //         image: image,
  //         type: subscriptionType,
  //       }).then(() => {
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

  const onSubmit = async (values) => {
    await addDoc(collection(db, "Subscriptions"), values).then(() => {
      console.log("Data saved!");
      navigation.navigate("Index");
    }).catch((error) => {
      console.log(error);
    });
  };

  const validate = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    type: Yup.string().required('Type is required'),
    price: Yup.number().required('Price is required'),
  });

  return (
    <View useSafeArea flex>
      <TouchableWithoutFeedback onPress={Platform.OS !== "web" && Keyboard.dismiss}>
        <KeyboardAwareScrollView style={global.container} contentContainerStyle={global.flex}>
          <Formik
            initialValues={{ user: auth.currentUser.uid, title: '', description: '', type: '', amount: '', price: 5.00, quantity: 1 }}
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

                {/* <View style={global.field}>
                  <Text subtitle>Image</Text>
                  <TouchableOpacity onPress={gallery}>
                    {!image
                      ? <AnimatedImage style={{ width: "100%", height: 200 }} source={require("../../assets/image.png")} />
                      : <AnimatedImage style={{ width: "100%", height: 200 }} source={{ uri: image }} />
                    }
                  </TouchableOpacity>
                </View> */}

                <View style={global.field}>
                  <Text subtitle>Price</Text>
                  <NumberInput
                    initialNumber={values.price}
                    style={global.input}
                    onChangeNumber={() => handleChange('price')}
                    fractionDigits={2}
                    migrate
                  />
                </View>
                {errors.price && touched.price && <Text style={{ color: Colors.red30}}>{errors.price}</Text>}

                <View style={global.field}>
                  <Text subtitle>Type</Text>
                  <Picker  
                    style={[global.input, { marginBottom: -16 }]}
                    value={values.type}
                    onChange={handleChange('type')}
                    onBlur={handleBlur('type')}
                    migrate 
                    useSafeArea={true} 
                    topBarProps={{ title: 'Types' }} 
                    migrateTextField           
                  >  
                    {subscriptionTypes.map((type) => (   
                      <Picker.Item key={type.value} value={type.value} label={type.label} />
                    ))}
                  </Picker>
                </View>
                {errors.type && touched.type && <Text style={{ color: Colors.red30}}>{errors.type}</Text>}

                {/* <View style={global.field}>
                    <Text subtitle>Image</Text>
                    <TouchableOpacity onPress={gallery}>
                      {!image
                        ? <AnimatedImage style={{ width: "100%", height: 200 }} source={require("../../assets/image.png")} />
                        : <AnimatedImage style={{ width: "100%", height: 200 }} source={{ uri: image }} />
                      }
                    </TouchableOpacity>
                  </View> */}

                <View flexG />

                <View style={global.field}>
                  <TouchableOpacity style={[global.btn, global.bgOrange]} onPress={() => handleSubmit()}>
                    <Text style={[global.btnText, global.white]}>Create Subscription</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default CreateSubscription