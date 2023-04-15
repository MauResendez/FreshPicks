import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import Cart from "../../screens/cart";

const Stack = createStackNavigator();

const CartStack = () => {
  return (
    <Stack.Navigator initialRouteName="Index" screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Index" component={Cart} />
    </Stack.Navigator>
  )
}

export default CartStack