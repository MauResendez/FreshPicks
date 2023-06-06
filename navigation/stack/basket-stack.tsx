import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import Basket from "../../screens/basket";
import Reserve from "../../screens/basket/reserve";

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
      <Stack.Screen name="Reserve" component={Reserve} />
    </Stack.Navigator>
  )
}

export default BasketStack