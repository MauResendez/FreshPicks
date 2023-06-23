import React from "react";

import Conversation from "../../screens/chat/conversation";
import Profile from "../../screens/profile";
import Search from "../../screens/search";
import Products from "../../screens/search/products";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Report from "../../screens/profile/report";
import Vendors from "../../screens/search/vendors";

const Stack = createNativeStackNavigator();

const SearchStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Search"
      screenOptions={{
        headerShadowVisible: false,
        headerShown: true,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: 17,
        }, 
      }}
    >
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Vendors" component={Vendors} />
      <Stack.Screen name="Products" component={Products} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Conversation" component={Conversation} />
      <Stack.Screen name="Report" component={Report} />
    </Stack.Navigator>
  )
}

export default SearchStack