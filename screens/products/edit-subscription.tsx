import { useNavigation, useRoute } from "@react-navigation/native"
import * as ImageManipulator from 'expo-image-manipulator'
import * as ImagePicker from "expo-image-picker"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { Formik } from "formik"
import React, { useEffect, useState } from "react"
import { Keyboard, Platform, TouchableOpacity, TouchableWithoutFeedback } from "react-native"
import CurrencyInput from "react-native-currency-input"
import { ActionSheet, Button, Colors, Image, KeyboardAwareScrollView, LoaderScreen, Picker, Text, TextField, View } from "react-native-ui-lib"
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'
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
  const [visible, setVisible] = useState(false);

  const compress = async (uri: string, setFieldValue) => {
    const manipulatedImage = await ImageManipulator.manipulateAsync(uri, [{ resize: { height: 512 }}], { compress: 1 });
    setFieldValue('image', [manipulatedImage.uri]);
    setVisible(false);
  };

  const camera = async (setFieldValue) => {
    console.log("HERE 2");
    setVisible(true);
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    try {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchCameraAsync({
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

  const gallery = async (setFieldValue) => {
    setVisible(true);
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

  const uploadImages = async (images) => {
    const imagePromises = Array.from(images, (image) => uploadImage(image));
  
    const imageRes = await Promise.all(imagePromises);
    return imageRes; // list of url like ["https://..", ...]
  }

  const uploadImage = async (image) => {
    const storageRef = ref(storage, `${auth.currentUser.uid}/images/subscriptions/${Date.now()}`);
    const img = await fetch(image);
    const blob = await img.blob();

    const response = await uploadBytesResumable(storageRef, blob);
    const url = await getDownloadURL(response.ref);
    return url;
  }

  const editSubscription = async (values, user, u) => {
    await updateDoc(doc(db, "Subscriptions", route.params.id), {
      description: values.description,
      image: u,
      price: values.price,
      title: values.title,
      type: values.type,
      user: values.user,
    }).then(() => {
      console.log("Data saved!");
      navigation.goBack();
    }).catch((error) => {
      console.log(error);
    });
  };

  const handleSubmit = async (values) => {
    try {
      const imgs = await uploadImages(values.image);
      await editSubscription(values, auth.currentUser, imgs);
    } catch (error) {
      console.log(error);
    }
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
      <LoaderScreen color={Colors.primary} />
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
        <KeyboardAwareScrollView>
          <Formik 
            initialValues={subscription || { title: "", description: "", price: 1, type: "" }} 
            onSubmit={handleSubmit}
            validationSchema={validate}
            enableReinitialize={true}
          >
            {({ errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values }) => (
              <View flex style={global.container}>
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

                <View style={global.field}>
                  <Text subtitle>Price</Text>
                  <CurrencyInput
                    value={values.price}
                    onChangeValue={(price) => setFieldValue("price", price)}
                    style={global.input}
                    prefix={"$ "}
                    delimiter=","
                    separator="."
                    precision={2}
                    minValue={0}
                    onChangeText={(formattedValue) => {
                      console.log(formattedValue); // R$ +2.310,46
                    }}
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

                <View style={global.field}>
                  <Text subtitle>Image</Text>
                  <TouchableOpacity onPress={() => setVisible(true)}>
                    {values.image.length == 0
                      ? <Image style={{ width: "100%", height: 150 }} source={require("../../assets/image.png")} />
                      : <Image style={{ width: "100%", height: 150 }} source={{ uri: values.image[0] }} />
                    }
                  </TouchableOpacity>
                </View>

                <View flexG />
                
                <Button 
                  backgroundColor={Colors.primary}
                  color={Colors.white}
                  label={"Edit Subscription"} 
                  labelStyle={{ fontWeight: '600', padding: 8 }} 
                  style={global.btnTest} 
                  onPress={() => handleSubmit()}                
                />

                <ActionSheet
                  containerStyle={{ height: 192 }}
                  dialogStyle={{ borderRadius: 8 }}
                  title={'Select Photo Option'} 
                  options={[{label: 'Camera', onPress: async () => camera(setFieldValue), icon: () => <MCIcon name={"camera"} size={24} color={Colors.black} style={{ marginRight: 8 }} />}, {label: 'Gallery', onPress: async () => gallery(setFieldValue), icon: () => <MCIcon name={"image"} size={24} color={Colors.black} style={{ marginRight: 8 }} />}]}
                  visible={visible}
                  onDismiss={() => {console.log("HERE"); setVisible(false)}}
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