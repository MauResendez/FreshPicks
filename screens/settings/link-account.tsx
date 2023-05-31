import { useNavigation } from '@react-navigation/native';
import { EmailAuthProvider, linkWithCredential } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, Platform, TouchableWithoutFeedback } from 'react-native';
import PhoneInput from 'react-native-phone-input';
import { Button, Colors, KeyboardAwareScrollView, LoaderScreen, Text, TextField, View } from 'react-native-ui-lib';
import * as Yup from 'yup';
import { auth, db } from '../../firebase';
import { global } from '../../style';

const LinkAccount = () => {
	const navigation = useNavigation<any>();
	const phoneRef = useRef<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<any>(true);
	
	const onSubmit = (values) => {
		try {
			const credential = EmailAuthProvider.credential(
				values.email,
				values.password
			);
	
			linkWithCredential(auth.currentUser, credential).then((credential) => {
				const user = credential.user;
				console.log("Linked email to phone number:", user);
				navigation.navigate("Settings");
			});
		} catch (error) {
			console.log(error);
		}
		
	}

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
    email: Yup.string().email("Email must be a valid email").required('Email is required'), 
    password: Yup.string().required('Password is required'),
		phone: Yup.string().required('Phone number is required'), 
  });

	return (
		<View useSafeArea flex>
      <TouchableWithoutFeedback style={global.flex} onPress={Platform.OS !== "web" && Keyboard.dismiss}>
        <KeyboardAwareScrollView style={global.flex} contentContainerStyle={global.flex}>
          <Formik 
            initialValues={{ email: user.email, password: "", phone: user.phone } || { email: "", password: "", phone: "" }} 
            onSubmit={onSubmit}
            validationSchema={validate}
            enableReinitialize={true}
          >
            {({ errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values }) => (
              <View flex>
                <View flex style={global.container}>
									<View style={global.field}>
										<Text subtitle>Phone Number</Text>
										<PhoneInput
											initialValue={values.phone}
											ref={phoneRef}
											initialCountry={'us'}
											style={global.input}
											onChangePhoneNumber={handleChange('phone')}
											textProps={{
												placeholder: 'Enter a phone number...'
											}}
										/>
									</View>

                  <View style={global.field}>
                    <Text subtitle>Email *</Text>
                    <TextField
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      style={global.input}
                      migrate
											editable={false}
                    />
                  </View>
                  {errors.email && touched.email && <Text style={{ color: Colors.red30 }}>{errors.email}</Text>}
                  
                  <View style={global.field}>
                    <Text subtitle>Password *</Text>
                    <TextField
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      style={global.input}
											secureTextEntry
                      migrate
                    />
                  </View>
                  {errors.password && touched.password && <Text style={{ color: Colors.red30 }}>{errors.password}</Text>}

                  <View flexG />

                  <Button 
                    backgroundColor={Colors.secondary}
                    color={Colors.white}
                    label={"Link Account"} 
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
	)
}

export default LinkAccount