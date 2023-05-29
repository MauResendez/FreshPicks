import { useNavigation } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native";
import { Button, Colors, KeyboardAwareScrollView, LoaderScreen, Text, TextField, View } from 'react-native-ui-lib';
import { auth, db } from '../../firebase';
import { global } from '../../style';

const UpdatePersonal = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<any>(true);

  const onSubmit = async (values) => {
    await updateDoc(doc(db, "Users", auth.currentUser.uid), values)
      .then(() => {
        navigation.navigate("Settings");
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

  return (
    <View useSafeArea flex>
      <TouchableWithoutFeedback style={global.flex} onPress={Platform.OS !== "web" && Keyboard.dismiss}>
        <KeyboardAwareScrollView contentContainerStyle={global.flex}>
          <Formik 
            initialValues={{ name: user.name, email: user.email, address: user.address, location: user.location } || { name: "", email: "", address: "", location: "" }} 
            onSubmit={onSubmit}
            enableReinitialize={true}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <View flex style={global.container}>
                <View style={global.field}>
                  <Text subtitle>Full Name *</Text>
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

                <View style={global.field}>
                  <Text subtitle>Email *</Text>
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

                <View flexG />

                <Button 
                  backgroundColor={"#ff4500"}
                  color={Colors.white}
                  label={"Update Personal Information"} 
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

export default UpdatePersonal