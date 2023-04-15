import { useNavigation } from "@react-navigation/native"
import * as ImageManipulator from 'expo-image-manipulator'
import * as ImagePicker from "expo-image-picker"
import { addDoc, collection, doc, getDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import React, { useEffect, useState } from "react"
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from "react-native"
import Toast from "react-native-toast-message"
import { AnimatedImage, LoaderScreen, Text, TextField, View } from "react-native-ui-lib"
import { auth, db, storage } from "../../firebase"
import { global } from "../../style"

const CreatePost = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

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
  
  const onSubmit = async () => {
    let error = false;

    if (title.length == 0) {
      error = true;
      showToast("error", "Error", "Title is required");
    }

    if (description.length == 0) {
      error = true;
      showToast("error", "Error", "Description is required");
    }

    if (error) {
      error = false;
      return
    }

    if (image) {
      // How the image will be addressed inside the storage
      const storage_ref = ref(storage, `images/${auth.currentUser.uid}/posts/${Date.now()}`);

      // Convert image to bytes
      const img = await fetch(image);
      const bytes = await img.blob();

      // Uploads the image bytes to the Firebase Storage
      await uploadBytes(storage_ref, bytes).then(async () => {
        // We retrieve the URL of where the image is located at
        await getDownloadURL(storage_ref).then(async (image) => {
          // Then we create the Market with it's image on it
          await addDoc(collection(db, "Posts"), {
            user: auth.currentUser.uid,
            logo: user.logo,
            business: user.business,
            address: user.address,
            title: title,
            description: description,
            image: image
          })
          .then(() => {
            console.log("Data saved!");
            navigation.navigate("Index");
          })
          .catch((error) => {
            console.log(error);
          });
        });
      })
      .catch((error) => {
        console.log(error);
      });
    } else {
      await addDoc(collection(db, "Posts"), {
        user: auth.currentUser.uid,
        logo: user.logo,
        business: user.business,
        address: user.address,
        title: title,
        description: description,
        image: image
      })
      .then(() => {
        console.log("Data saved!");
        navigation.navigate("Index");
      })
      .catch((error) => {
        console.log(error);
      });
    }
  };

  const showToast = (type, title, message) => {
    Toast.show({
      type: type,
      text1: title,
      text2: message
    });
  }

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

  return (
    <View useSafeArea flex>
      <ScrollView style={global.flex}>
        <TouchableWithoutFeedback onPress={Platform.OS !== "web" && Keyboard.dismiss}>
          <KeyboardAvoidingView style={global.container} behavior={Platform.OS == "ios" ? "padding" : "height"}>
            <View style={global.field}>
              <Text title>Create Post</Text>
            </View>
            
            <View style={global.field}>
              <Text subtitle>Post Title</Text>
              <TextField
                style={global.input}
                placeholder="Enter the post title here"
                onChangeText={(value) => setTitle(value)}
                value={title}
                migrate
              />
            </View>

            <View style={global.field}>
              <Text style={global.subtitle}>Post Description</Text>
              <TextField
                style={global.textArea}
                placeholder="Enter the post description here"
                multiline
                maxLength={100}
                onChangeText={(value) => setDescription(value)}
                value={description}
                migrate
              />
            </View>

            <View style={global.field}>
              <Text style={global.subtitle}>Listing Image</Text>
              <TouchableOpacity onPress={gallery}>
                {!image
                  ? <AnimatedImage style={{ width: "100%", height: 200 }} source={require("../../assets/image.png")} />
                  : <AnimatedImage style={{ width: "100%", height: 200 }} source={{ uri: image }} />
                }
              </TouchableOpacity>
            </View>

            <View flexG />

            <View style={global.field}>
              <TouchableOpacity style={[global.btn, global.bgOrange]} onPress={onSubmit}>
                <Text style={[global.btnText, global.white]}>Create Post</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  )
}

export default CreatePost