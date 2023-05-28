import { useNavigation } from "@react-navigation/native"
import { addDoc, collection, onSnapshot, query, where } from "firebase/firestore"
import { Formik } from 'formik'
import React, { useEffect, useState } from "react"
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native"
import CurrencyInput from 'react-native-currency-input'
import { Button, Colors, DateTimePicker, KeyboardAwareScrollView, LoaderScreen, Picker, Text, TextField, View } from "react-native-ui-lib"
import { auth, db } from "../../firebase"
import { global } from "../../style"

const CreateTransaction = () => {
  const navigation = useNavigation<any>();
  const types = [
    {label: "Expense", value: "Expense"},
    {label: "Revenue", value: "Revenue"},
  ]
  const expense = [
    {label: "Uncategorized", value: "Uncategorized"},
    {label: "Assets", value: "Assets"},
    {label: "Business Administration", value: "Business Administration"},
    {label: "Farm Building Maintenance", value: "Farm Building Maintenance"},
    {label: "Farm Equipment", value: "Farm Equipment"},
    {label: "Farm Vehicle", value: "Farm Vehicle"},
    {label: "Labor", value: "Labor"},
    {label: "Loans & Interest", value: "Loans & Interest"},
    {label: "Inputs", value: "Inputs"},
    {label: "Other", value: "Other"},
    {label: "Rent", value: "Rent"},
    {label: "Storage", value: "Storage"},
  ]
  const revenue = [
    {label: "Uncategorized", value: "Uncategorized"},
    {label: "Agricultural Sales", value: "Agricultural Sales"},
    {label: "Custom Work Income", value: "Custom Work Income"},
    {label: "Government Ag Program Payments", value: "Government Ag Program Payments"},
    {label: "Insurance", value: "Insurance"},
    {label: "Rent Received", value: "Rent Received"},
    {label: "Other", value: "Other"}
  ]
  const [products, setProducts] = useState<any>(null);
  const [loading, setLoading] = useState<any>(true);

  const onSubmit = async (values) => {
    console.log(values);

    await addDoc(collection(db, "Transactions"), values).then(() => {
      console.log("Data saved!");
      navigation.navigate("Index");
    }).catch((error) => {
      console.log(error);
    });
  }

  // const validationSchema = yup.object({
  //   title: yup.string().required('First name is required'),
  //   description: yup.string().required('Last name is required'),
  //   type: yup.string().email('Invalid email address').required('Email is required'),
  //   amount: yup.string().email('Invalid email address').required('Email is required'),
  //   price: yup.string().email('Invalid email address').required('Email is required'),
  //   quantity: yup.number().,
  // });

  useEffect(() => {
    onSnapshot(query(collection(db, "Products"), where("user", "==", auth.currentUser?.uid)), async (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
  }, []);

  useEffect(() => {
    if (products) {
      setLoading(false);
    }
  }, [products]);

  if (loading) {
    return (
      <LoaderScreen />
    )
  }

  return (
    <View useSafeArea flex>
      <TouchableWithoutFeedback onPress={Platform.OS !== "web" && Keyboard.dismiss}>
        <KeyboardAwareScrollView style={global.container} contentContainerStyle={global.flex}>
          <Formik
            initialValues={{ user: auth.currentUser.uid, party: '', type: '', price: 0.00, product: '', label: '', category: '', notes: '', createdAt: new Date(), date: new Date() }}
            onSubmit={onSubmit}
          >
            {({ errors, handleChange, handleBlur, handleSubmit, setFieldValue, touched, values }) => (
              <View flex>
                <View row spread style={{ paddingVertical: 8 }}>
                  <View style={{ width: "30%" }}>
                    <Text subtitle>Type</Text>
                    <Picker  
                      value={values.type}
                      style={[global.input, { marginBottom: -16 }]}
                      onChange={handleChange('type')}
                      onBlur={handleBlur('type')}
                      useSafeArea={true} 
                      topBarProps={{ title: 'Type' }} 
                    >  
                      {types.map((type) => (   
                        <Picker.Item key={type.value} value={type.value} label={type.label} />
                      ))}
                    </Picker>
                  </View>

                  <View style={{ width: "30%" }}>
                    <Text subtitle>Price</Text>
                    <CurrencyInput
                      value={values.price}
                      onChangeValue={(price) => setFieldValue("price", price)}
                      style={global.input}
                      prefix={values.type == 'Expense' ? "- $ " : "+ $ "}
                      delimiter=","
                      separator="."
                      precision={2}
                      minValue={0}
                      onChangeText={(formattedValue) => {
                        console.log(formattedValue); // R$ +2.310,46
                      }}
                    />
                  </View>

                  <View style={{ width: "30%" }}>
                    <Text subtitle>Date</Text>
                    <DateTimePicker 
                      value={values.date} 
                      onChange={(date) => setFieldValue("date", date)} 
                      style={global.input} 
                      placeholder="Transaction Date" 
                      pm 
                    />
                  </View>
                </View>

                <View style={global.field}>
                  {values.type == 'Expense' 
                    ? <Text subtitle>Vendor Name</Text>
                    : <Text subtitle>Customer Name</Text>
                  }
                  <TextField
                    style={global.input}
                    onChangeText={handleChange('party')}
                    onBlur={handleBlur('party')}
                    value={values.party}
                    migrate
                  />
                </View>

                <View style={global.field}>
                  <Text subtitle>Product</Text>
                  <Picker  
                    value={values.product}
                    style={[global.input, { marginBottom: -16 }]}
                    onChange={handleChange('product')}
                    onBlur={handleBlur('product')}
                    useSafeArea={true} 
                    topBarProps={{ title: 'Products' }} 
                  >  
                    {products.map((product) => (   
                      <Picker.Item key={product.id} value={product.id} label={product.title} />
                    ))}
                  </Picker>
                </View>

                <View style={global.field}>
                  <Text subtitle>Category</Text>
                  <Picker  
                    value={values.category}
                    style={[global.input, { marginBottom: -16 }]}
                    onChange={handleChange('category')}
                    onBlur={handleBlur('category')}
                    useSafeArea={true} 
                    topBarProps={{ title: 'Categories' }} 
                  >  
                    {values.type == 'Expense' 
                      ? expense.map((category) => (   
                          <Picker.Item key={category.value} value={category.value} label={category.label} />
                        ))
                      : revenue.map((category) => (   
                          <Picker.Item key={category.value} value={category.value} label={category.label} />
                        ))
                    }
                  </Picker>
                </View>

                <View style={global.field}>
                  <Text subtitle>Notes</Text>
                  <TextField
                    style={global.textArea}
                    multiline
                    maxLength={100}
                    onChangeText={handleChange('notes')}
                    onBlur={handleBlur('notes')}
                    value={values.notes}
                    migrate
                  />
                </View>

                <View flexG />

                <Button 
                  backgroundColor={"#32CD32"}
                  color={Colors.white}
                  label={"Create Transaction"} 
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

export default CreateTransaction