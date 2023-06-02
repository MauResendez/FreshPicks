import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import Basket from "../../screens/basket";

const Stack = createStackNavigator();

const BasketStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Basket" 
      screenOptions={{ 
        headerShown: true,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: 17,
        }
      }}
    >
      <Stack.Screen name="Basket" component={Basket} />
    </Stack.Navigator>
  )
}

export default BasketStack