import { useNavigation, useRoute } from "@react-navigation/native"
import * as ImageManipulator from 'expo-image-manipulator'
import * as ImagePicker from "expo-image-picker"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import React, { useEffect, useState } from "react"
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from "react-native"
import { AnimatedImage, Text, TextField, View } from "react-native-ui-lib"
import { auth, db, storage } from "../../firebase"
import { global } from "../../style"

const EditPost = ({ route }) => {
  const {
    params: {
      id
    }
  } = useRoute<any>();

  const navigation = useNavigation<any>();
  const [post, setPost] = useState<any>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<any>("");
  const [loading, setLoading] = useState<any>(true);

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
      setTitle(post.title);
      setDescription(post.description);
      setImage(post.image);
      console.log(post);
      setLoading(false);
    }
  }, [post]);

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
      // Toast.show("Title is required", {
      //   duration: Toast.durations.LONG,
      //   backgroundColor: "yellow",
      //   position: Platform.OS == "web" ? 650 : 700
      // });
    }

    if (description.length == 0) {
      error = true;
      // Toast.show("Description is required", {
      //   duration: Toast.durations.LONG,
      //   backgroundColor: "yellow",
      //   position: Platform.OS == "web" ? 650 : 700
      // });
    }

    if (error) {
      error = false;
      return
    }

    console.log("Past here 1");

    // How the image will be addressed inside the storage
    const storage_ref = ref(storage, `images/${auth.currentUser.uid}/posts/${Date.now()}`);

    console.log("Past here 2");

    // Convert image to bytes
    const img = await fetch(image);
    const bytes = await img.blob();

    console.log("Past here 3");

    // Uploads the image bytes to the Firebase Storage
    await uploadBytes(storage_ref, bytes).then(async () => {
      console.log("Past here 4");
      // We retrieve the URL of where the image is located at
      await getDownloadURL(storage_ref).then(async (image) => {
        // Then we create the Market with it's image on it
        console.log("Past here 5");
        await updateDoc(doc(db, "Posts", route.params.id), {
          user: auth.currentUser.uid,
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
  };

  return (
    <View useSafeArea flex>
      <ScrollView style={global.flex}>
        <TouchableWithoutFeedback onPress={Platform.OS !== "web" && Keyboard.dismiss}>
          <KeyboardAvoidingView style={global.container} behavior={Platform.OS == "ios" ? "padding" : "height"}>
            <View style={global.field}>
              <Text title>Edit Post</Text>
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
                <Text style={[global.btnText, global.white]}>Edit Post</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  )
}

export default EditPost