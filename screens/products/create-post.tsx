import { useNavigation } from "@react-navigation/native"
import * as ImageManipulator from 'expo-image-manipulator'
import * as ImagePicker from "expo-image-picker"
import { addDoc, collection, doc, getDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { Formik } from "formik"
import React, { useEffect, useState } from "react"
import { Keyboard, Platform, TouchableOpacity, TouchableWithoutFeedback } from "react-native"
import Toast from "react-native-toast-message"
import { AnimatedImage, Button, Colors, KeyboardAwareScrollView, LoaderScreen, Text, TextField, View } from "react-native-ui-lib"
import * as Yup from 'yup'
import { auth, db, storage } from "../../firebase"
import { global } from "../../style"

const CreatePost = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const compress = async (uri: string, setFieldValue) => {
    const manipulatedImage = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 300, height: 150 }}], { compress: 0.5 });
    // setImage(manipulatedImage.uri);

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
        quality: 0,
      });

      if (!result.canceled) {
        compress(result.assets[0].uri, setFieldValue);
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  const handleSubmit = async (values) => {
    const imgs = await uploadImages(values.image);
    await createPost(values, auth.currentUser, imgs);
  };

  const showToast = (type, title, message) => {
    Toast.show({
      type: type,
      text1: title,
      text2: message
    });
  }

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

  const createPost = async (values, user, u) => {
    await addDoc(collection(db, "Posts"), {
      user: user.uid,
      business: user.business,
      address: user.address,
      title: values.title,
      description: values.description,
      image: u
    })
    .then(() => {
      console.log("Data saved!");
      navigation.navigate("Index");
    })
    .catch((error) => {
      console.log(error);
    });
  };

  useEffect(() => {
    getDoc(doc(db, "Users", auth.currentUser.uid)).then((docSnapshot) => {
      const data = docSnapshot.data();
      setUser({...data, id: auth.currentUser.uid});
    });
  }, []);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <LoaderScreen color={"#32CD32"} />
    )
  }

  const validate = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
  });

  return (
    <View useSafeArea flex>
      <TouchableWithoutFeedback style={global.flex} onPress={Platform.OS !== "web" && Keyboard.dismiss}>
        <KeyboardAwareScrollView contentContainerStyle={global.flex}>
          <Formik
            initialValues={{ user: auth.currentUser.uid, title: '', description: '', image: [] }}
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
                  <Text subtitle>Image</Text>
                  <TouchableOpacity onPress={() => gallery(setFieldValue)}>
                    {values.image.length == 0
                      ? <AnimatedImage style={{ width: "100%", height: 150 }} source={require("../../assets/image.png")} />
                      : <AnimatedImage style={{ width: "100%", height: 150 }} source={{ uri: values.image }} />
                    }
                  </TouchableOpacity>
                </View>

                <View flexG />

                <Button 
                  backgroundColor={"#ff4500"}
                  color={Colors.white}
                  label={"Create Post"} 
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

export default CreatePost