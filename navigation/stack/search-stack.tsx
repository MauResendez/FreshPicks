import React from "react";

import Conversation from "../../screens/chat/conversation";
import Profile from "../../screens/profile";
import Search from "../../screens/search";
import Farmers from "../../screens/search/farmers";
import Products from "../../screens/search/products";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Basket from "../../screens/basket";

const Stack = createNativeStackNavigator();

const SearchStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Search"
      screenOptions={{
        // headerTitle: () => (
        //   <Image
        //     style={Platform.OS == "android" ? global.androidHeader : global.iosHeader}
        //     source={require("../../assets/logo.png")}
        //     resizeMode="contain"
        //   />
        // ),
        headerTitleStyle: {
          fontSize: 17,
        },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Farmers" component={Farmers} />
      <Stack.Screen name="Products" component={Products} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Conversation" component={Conversation} />
      <Stack.Screen name="Basket" component={Basket} />
    </Stack.Navigator>
  )
}

export default SearchStack