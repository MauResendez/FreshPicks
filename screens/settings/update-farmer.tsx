import { useNavigation } from "@react-navigation/native"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { Formik } from "formik"
import React, { useEffect, useState } from "react"
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native"
import { Button, Carousel, Colors, Image, KeyboardAwareScrollView, LoaderScreen, Text, TextField, View } from "react-native-ui-lib"
import * as Yup from 'yup'
import { auth, db } from "../../firebase"
import { global } from "../../style"

const UpdateFarmer = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<any>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<any>(true);
  const IMAGES = [
    'https://images.pexels.com/photos/2529159/pexels-photo-2529159.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    'https://images.pexels.com/photos/2529146/pexels-photo-2529146.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    'https://images.pexels.com/photos/2529158/pexels-photo-2529158.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
  ];

  const onSubmit = async (values) => {
    await updateDoc(doc(db, "Users", auth.currentUser.uid), values)
      .then(() => {
        navigation.navigate("Index");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getDoc(doc(db, "Users", auth.currentUser.uid)).then((docSnapshot) => {
      const data = docSnapshot.data();
      setUser(data);
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
    business: Yup.string().required('Business is required'), 
    description: Yup.string().required('Description is required'), 
    website: Yup.string().url("Website must be a valid URL\nE.g. (https://www.google.com)").required('Website is required'), 
    // images: Yup.array().required('Images is required')
  });
  
  return (
    <View useSafeArea flex>
      <TouchableWithoutFeedback style={global.flex} onPress={Platform.OS !== "web" && Keyboard.dismiss}>
        <KeyboardAwareScrollView style={global.flex} contentContainerStyle={global.flex}>
          <Formik 
            initialValues={{ business: user.business, description: user.description, website: user.website, address: user.address, images: [] } || { business: "", description: "", website: "", images: [] }} 
            onSubmit={onSubmit}
            validationSchema={validate}
            enableReinitialize={true}
          >
            {({ errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values }) => (
              <View flex>
                <Carousel containerStyle={{ height: 200 }}>
                  <View flex centerV>
                    {values.images.length == 0
                      ? <Image style={global.flex} source={require("../../assets/default.png")} overlayType={Image.overlayTypes.BOTTOM} />
                      : <Image style={global.flex} source={{ uri: values.image[0] }} cover overlayType={Image.overlayTypes.BOTTOM} />
                    }
                  </View>
                </Carousel>
                <View flex style={global.container}>
                  <View style={global.field}>
                    <Text subtitle>Business Name *</Text>
                    <TextField
                      value={values.business}
                      onChangeText={handleChange('business')}
                      onBlur={handleBlur('business')}
                      style={global.input}
                      migrate
                    />
                  </View>
                  {errors.business && touched.business && <Text style={{ color: Colors.red30 }}>{errors.business}</Text>}
                  
                  <View style={global.field}>
                    <Text subtitle>Describe your business *</Text>
                    <TextField
                      value={values.description}
                      onChangeText={handleChange('description')}
                      onBlur={handleBlur('description')}
                      style={global.textArea}
                      multiline
                      maxLength={100}
                      migrate
                    />
                  </View>
                  {errors.description && touched.description && <Text style={{ color: Colors.red30 }}>{errors.description}</Text>}

                  <View style={global.field}>
                    <Text subtitle>Website</Text>
                    <TextField
                      value={values.website}
                      onChangeText={handleChange('website')}
                      onBlur={handleBlur('website')}
                      style={global.input}
                      migrate
                    />
                  </View>
                  {errors.website && touched.website && <Text style={{ color: Colors.red30 }}>{errors.website}</Text>}

                  <View flexG />

                  <Button 
                    backgroundColor={"#ff4500"}
                    color={Colors.white}
                    label={"Update Farmer Information"} 
                    labelStyle={{ fontWeight: '600', padding: 8 }} 
                    style={global.btnTest} 
                    onPress={() => handleSubmit()}                
                  />
                </View>
              </View>
            )}
          </Formik>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default UpdateFarmer