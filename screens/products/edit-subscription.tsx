import { useNavigation, useRoute } from "@react-navigation/native"
import * as ImageManipulator from 'expo-image-manipulator'
import * as ImagePicker from "expo-image-picker"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { Formik } from "formik"
import React, { useEffect, useState } from "react"
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native"
import { Button, Colors, KeyboardAwareScrollView, LoaderScreen, NumberInput, Picker, Text, TextField, View } from "react-native-ui-lib"
import * as Yup from 'yup'
import { auth, db, storage } from "../../firebase"
import { global } from "../../style"

const EditSubscription = ({ route }) => {
	const {
    params: {
      id
    }
  } = useRoute<any>();

  const navigation = useNavigation<any>();
	const [subscription, setSubscription] = useState<any>(null);
  const subscriptionTypes = [
    {label: "Weekly", value: "Weekly"},
    {label: "Monthly", value: "Monthly"},
    {label: "Yearly", value: "Yearly"}
  ]
  const [image, setImage] = useState<any>(null);
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

  const onSubmit = async (values) => {
    // How the image will be addressed inside the storage
    const storage_ref = ref(storage, `images/${auth.currentUser.uid}/subscriptions/${Date.now()}`);

    // Convert image to bytes
    const img = await fetch(image);
    const bytes = await img.blob();

    // Uploads the image bytes to the Firebase Storage
    await uploadBytes(storage_ref, bytes).then(async () => {
      // We retrieve the URL of where the image is located at
      await getDownloadURL(storage_ref).then(async (image) => {
        // Then we create the Market with it's image on it
        await updateDoc(doc(db, "Subscriptions", route.params.id), {
          user: auth.currentUser.uid,
          title: values.title,
          description: values.description,
          price: values.price,
          image: image,
          type: values.type,
        }).then(() => {
          console.log("Data saved!");
          navigation.navigate("Index");
        }).catch((error) => {
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
      getDoc(doc(db, "Subscriptions", route.params.id)).then((docSnapshot) => {
        const data = docSnapshot.data();
        setSubscription(data);
      });
    }
  }, [route.params.id]);

  useEffect(() => {
    if (subscription) {
      setLoading(false);
    }
  }, [subscription])

  if (loading) {
    return (
      <LoaderScreen color={"#32CD32"} />
    )
  }

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
            initialValues={subscription || { title: "", description: "", price: 1, type: "" }} 
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
                    placeholder="Enter the subscription title here"
                    onChangeText={handleChange('title')}
                    value={values.title}
                    migrate
                  />
                </View>
                {errors.title && touched.title && <Text style={{ color: Colors.red30}}>{errors.title}</Text>}

                <View style={global.field}>
                  <Text subtitle>Description</Text>
                  <TextField
                    style={global.textArea}
                    placeholder="Enter the subscription description here"
                    multiline
                    maxLength={100}
                    onChangeText={handleChange('description')}
                    value={values.description}
                    migrate
                  />
                </View>
                {errors.description && touched.description && <Text style={{ color: Colors.red30}}>{errors.description}</Text>}

                {/* <View style={global.field}>
                  <Text subtitle>Subscription Image</Text>
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
                    onChangeNumber={(data) => setFieldValue("price", data.number)}
                    onBlur={handleBlur('price')}
                    keyboardType={'numeric'}
                    fractionDigits={2}
                    migrate
                  />
                </View>
                {errors.price && touched.price && <Text style={{ color: Colors.red30}}>{errors.price}</Text>}

                <View style={global.field}>
                  <Text subtitle>Type</Text>
                  <Picker  
                    value={values.type}
                    placeholder={'Subscription Type'}
                    onChange={handleChange('type')}
                    style={[global.input, { marginBottom: -16 }]}
                    migrate 
                    useSafeArea={true} 
                    topBarProps={{ title: 'Subscription Types' }} 
                    migrateTextField           
                  >  
                    {subscriptionTypes.map((type) => (   
                      <Picker.Item key={type.value} value={type.value} label={type.label} />
                    ))}
                  </Picker>
                </View>
                {errors.type && touched.type && <Text style={{ color: Colors.red30}}>{errors.type}</Text>}

                <Button 
                  backgroundColor={"#ff4500"}
                  color={Colors.white}
                  label={"Edit Subscription"} 
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

export default EditSubscription