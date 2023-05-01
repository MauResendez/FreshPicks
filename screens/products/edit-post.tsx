import { useNavigation, useRoute } from "@react-navigation/native"
import * as ImageManipulator from 'expo-image-manipulator'
import * as ImagePicker from "expo-image-picker"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { Formik } from "formik"
import React, { useEffect, useState } from "react"
import { Keyboard, Platform, TouchableOpacity, TouchableWithoutFeedback } from "react-native"
import { AnimatedImage, Button, Colors, KeyboardAwareScrollView, LoaderScreen, Text, TextField, View } from "react-native-ui-lib"
import * as Yup from 'yup'
import { auth, db } from "../../firebase"
import { global } from "../../style"

const EditPost = ({ route }) => {
  const {
    params: {
      id
    }
  } = useRoute<any>();

  const navigation = useNavigation<any>();
  const [post, setPost] = useState<any>(null);
  const [image, setImage] = useState<any>("");
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

  // const onSubmit = async () => {
  //   let error = false;

  //   if (title.length == 0) {
  //     error = true;
  //     // Toast.show("Title is required", {
  //     //   duration: Toast.durations.LONG,
  //     //   backgroundColor: "yellow",
  //     //   position: Platform.OS == "web" ? 650 : 700
  //     // });
  //   }

  //   if (description.length == 0) {
  //     error = true;
  //     // Toast.show("Description is required", {
  //     //   duration: Toast.durations.LONG,
  //     //   backgroundColor: "yellow",
  //     //   position: Platform.OS == "web" ? 650 : 700
  //     // });
  //   }

  //   if (error) {
  //     error = false;
  //     return
  //   }

  //   console.log("Past here 1");

  //   // How the image will be addressed inside the storage
  //   const storage_ref = ref(storage, `images/${auth.currentUser.uid}/posts/${Date.now()}`);

  //   console.log("Past here 2");

  //   // Convert image to bytes
  //   const img = await fetch(image);
  //   const bytes = await img.blob();

  //   console.log("Past here 3");

  //   // Uploads the image bytes to the Firebase Storage
  //   await uploadBytes(storage_ref, bytes).then(async () => {
  //     console.log("Past here 4");
  //     // We retrieve the URL of where the image is located at
  //     await getDownloadURL(storage_ref).then(async (image) => {
  //       // Then we create the Market with it's image on it
  //       console.log("Past here 5");
  //       await updateDoc(doc(db, "Posts", route.params.id), {
  //         user: auth.currentUser.uid,
  //         title: title,
  //         description: description,
  //         image: image
  //       })
  //         .then(() => {
  //           console.log("Data saved!");
  //           navigation.navigate("Index");
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //         });
  //     });
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
  // };

  const onSubmit = async (values) => {
    await updateDoc(doc(db, "Posts", route.params.id), {
      user: auth.currentUser.uid,
      title: values.title,
      description: values.description,
      image: image
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
    if (route.params.id) {
      getDoc(doc(db, "Posts", route.params.id)).then((docSnapshot) => {
        const data = docSnapshot.data();
        setPost(data);
      });
    }
  }, [route.params.id]);

  useEffect(() => {
    if (post) {
      setImage(post.image);
      setLoading(false);
    }
  }, [post]);

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
        <KeyboardAwareScrollView style={global.container} contentContainerStyle={global.flex}>
          <Formik 
            initialValues={post || { title: "", description: "" }} 
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
                    placeholder="Enter the post description here"
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
                  <TouchableOpacity onPress={gallery}>
                    {!image
                      ? <AnimatedImage style={{ width: "100%", height: 200 }} source={require("../../assets/image.png")} />
                      : <AnimatedImage style={{ width: "100%", height: 200 }} source={{ uri: image }} />
                    }
                  </TouchableOpacity>
                </View>

                <View flexG />

                <Button 
                  backgroundColor={"#ff4500"}
                  color={Colors.white}
                  label={"Edit Post"} 
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

export default EditPost