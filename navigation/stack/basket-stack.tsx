import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import { Image } from "react-native-ui-lib";
import Basket from "../../screens/basket";

const Stack = createStackNavigator();

const BasketStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Index" 
      screenOptions={{ 
        headerShown: true,
        headerTitle: () => (
          <Image
            style={{ width: 200, height: 50 }}
            source={require("../../assets/logo.png")}
            resizeMode="contain"
          />
        ), 
      }}
    >
      <Stack.Screen name="Index" component={Basket} />
    </Stack.Navigator>
  )
}

export default BasketStack