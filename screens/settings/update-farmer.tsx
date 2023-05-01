import { useNavigation } from "@react-navigation/native"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { Formik } from "formik"
import React, { useEffect, useState } from "react"
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native"
import { Button, Colors, KeyboardAwareScrollView, LoaderScreen, Text, TextField, View } from "react-native-ui-lib"
import { auth, db } from "../../firebase"
import { global } from "../../style"

const UpdateFarmer = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<any>(true);

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
  
  return (
    <View useSafeArea flex>
      <TouchableWithoutFeedback style={global.flex} onPress={Platform.OS !== "web" && Keyboard.dismiss}>
        <KeyboardAwareScrollView style={global.container} contentContainerStyle={global.flex}>
          <Formik 
            initialValues={{ business: user.business, description: user.description, website: user.website } || { business: "", description: "", website: "" }} 
            onSubmit={onSubmit}
            enableReinitialize={true}
            style={global.flex}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <View flex>
                <View style={global.field}>
                  <Text subtitle>Business Name</Text>
                  <TextField
                    value={values.business}
                    onChangeText={handleChange('business')}
                    onBlur={handleBlur('business')}
                    style={global.input}
                    migrate
                  />
                </View>
                
                <View style={global.field}>
                  <Text subtitle>Describe your business</Text>
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

                <View flexG />

                <Button 
                  backgroundColor={"#ff4500"}
                  color={Colors.white}
                  label={"Update Farmer"} 
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
  );
}

export default UpdateFarmer