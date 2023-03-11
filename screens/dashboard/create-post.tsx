import { useNavigation } from "@react-navigation/native"
import * as ImagePicker from "expo-image-picker"
import { addDoc, collection, doc, getDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import React, { useEffect, useState } from "react"
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from "react-native"
import { ActionSheet, Text, TextField, Toast, View } from "react-native-ui-lib"
import Loading from "../../components/extra/loading"
import { auth, db, storage } from "../../firebase"
import { global } from "../../style"

const CreatePost = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);

  const selectImage = async () => {
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
        quality: 0.25,
      });

      if (!result.canceled) {
        setImage(result.uri);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const onSubmit = async () => {
    let error = false;

    if (message.length == 0) {
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

    // How the image will be addressed inside the storage
    const storage_ref = ref(storage, `images/${auth.currentUser.uid}/posts/${Date.now()}`);

    // Convert image to bytes
    const img = await fetch(image);
    const bytes = await img.blob();

    if (image) {
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
            message: message,
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
        message: message,
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
      <Loading />
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
                onChangeText={(value) => setMessage(value)}
                value={message}
                migrate
              />
            </View>

            <View style={global.field}>
              <Text style={global.subtitle}>Post Image</Text>
              <TouchableOpacity style={[global.btn, global.bgOrange]} onPress={() => setVisible(true)}>
                <Text style={[global.btnText, global.white]}>Create</Text>
              </TouchableOpacity>
            </View>

            <View style={global.field}>
              <TouchableOpacity style={[global.btn, global.bgOrange]} onPress={onSubmit}>
                <Text style={[global.btnText, global.white]}>Create</Text>
              </TouchableOpacity>
            </View>
            <Toast
              position={'top'}
              message="Toast with two lines of text. Toast with two lines of text"
              // autoDismiss={3000}
              // action={{iconSource: Assets.icons.x, onPress: () => console.log('dismiss')}}
            />
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </ScrollView>
      <ActionSheet 
        containerStyle={{ height: 128 }}
        dialogStyle={{ borderRadius: 8 }}
        cancelButtonIndex={3} 
        destructiveButtonIndex={0}
        visible={visible} 
        onDismiss={() => setVisible(false)}
        options={[{label: 'Camera', onPress: selectImage}, {label: 'Gallery', onPress: selectImage}]}
      />
    </View>
  )
}

export default CreatePost