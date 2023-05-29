import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import Instructions from "../../screens/instructions";

const Stack = createStackNavigator();

const InstructionStack = () => {
  return (
    <Stack.Navigator initialRouteName="Instructions" screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Instructions" component={Instructions} />
    </Stack.Navigator>
  )
}

export default InstructionStack