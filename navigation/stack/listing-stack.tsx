import React from "react";

import CreateSubscription from "../../screens/listings/create-subscription";
import EditSubscription from "../../screens/listings/edit-subscription";

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Listings from "../../screens/listings";
import CreateProduct from "../../screens/listings/create-product";
import EditProduct from "../../screens/listings/edit-product";

const Stack = createNativeStackNavigator();

const ListingStack = () => { 
  return (
    <Stack.Navigator 
      initialRouteName="Products" 
      screenOptions={{ 
        headerShown: true,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: 17,
        }, 
      }}
    >
      <Stack.Screen name="Listings" component={Listings} />
      <Stack.Screen name="Create Product" component={CreateProduct} />
      <Stack.Screen name="Create Subscription" component={CreateSubscription} />
      <Stack.Screen name="Edit Product" component={EditProduct} />
      <Stack.Screen name="Edit Subscription" component={EditSubscription} />
    </Stack.Navigator>
  )
}

export default ListingStack;