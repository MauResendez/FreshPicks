import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import { Platform } from "react-native";
import { Image } from "react-native-ui-lib";
import Basket from "../../screens/basket";
import { global } from "../../style";

const Stack = createStackNavigator();

const BasketStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Index" 
      screenOptions={{ 
        headerShown: true,
        headerTitle: () => (
          <Image
            style={Platform.OS == "android" ? global.androidHeader : global.iosHeader}
            source={require("../../assets/logo.png")}
            resizeMode="contain"
          />
        ), 
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="Index" component={Basket} />
    </Stack.Navigator>
  )
}

export default BasketStack