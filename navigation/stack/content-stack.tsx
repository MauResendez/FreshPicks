import React from "react";

import EditSubscription from "../../screens/products/edit-subscription";

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Content from "../../screens/content";
import EditProduct from "../../screens/products/edit-product";

const Stack = createNativeStackNavigator();

const ContentStack = () => { 
  return (
    <Stack.Navigator 
      initialRouteName="Content" 
      screenOptions={{ 
        headerShown: true,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: 17,
        }, 
      }}
    >
      <Stack.Screen name="Content" component={Content} />
      <Stack.Screen name="Edit Product" component={EditProduct} />
      <Stack.Screen name="Edit Subscription" component={EditSubscription} />
    </Stack.Navigator>
  )
}

export default ContentStack