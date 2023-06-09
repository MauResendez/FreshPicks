import { useNavigation } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native";
import { Button, Colors, KeyboardAwareScrollView, LoaderScreen, Text, TextField, View } from 'react-native-ui-lib';
import * as Yup from 'yup';
import { auth, db } from '../../firebase';
import { global } from '../../style';

const UpdatePersonal = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<any>(true);

  const onSubmit = async (values) => {
    await updateDoc(doc(db, "Users", auth.currentUser.uid), values)
      .then(() => {
        navigation.goBack();
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
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }

  const validate = Yup.object().shape({ 
    name: Yup.string().required("Name is required"), 
    email: Yup.string().required("Email is required"), 
    // location: Yup.array().required("Address is required"),
  });

  return (
    <View useSafeArea flex>
      <TouchableWithoutFeedback style={global.flex} onPress={Platform.OS !== "web" && Keyboard.dismiss}>
        <KeyboardAwareScrollView contentContainerStyle={global.flex}>
          <Formik 
            enableReinitialize={true}
            initialValues={{ name: user.name, email: user.email } || { name: "", email: "" }} 
            onSubmit={onSubmit}
            validationSchema={validate}
          >
					  {({ errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values }) => (
              <View flex style={global.container}>
                <View style={global.field}>
                  <Text text65 marginV-4>Full Name *</Text>
                  <TextField 
                    value={values.name}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    style={global.input} 
                    autoComplete="name" 
                    migrate 
                    validate={'required'} 
                  />
                </View>
                {errors.name && touched.name && <Text style={{ color: Colors.red30 }}>{errors.name}</Text>}

                <View style={global.field}>
                  <Text text65 marginV-4>Email *</Text>
                  <TextField 
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')} 
                    style={global.input} 
                    autoComplete="email" 
                    migrate 
                    validate={'required'} 
                  />
                </View>
                {errors.email && touched.email && <Text style={{ color: Colors.red30 }}>{errors.email}</Text>}

                <View flexG />

                <Button 
                  backgroundColor={Colors.primary}
                  color={Colors.white}
                  label={"Update Personal Information"} 
                  labelStyle={{ fontWeight: '600', padding: 8 }} 
                  style={global.button} 
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

export default UpdatePersonal