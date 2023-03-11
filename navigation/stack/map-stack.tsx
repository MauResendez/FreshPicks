import React from "react";

import Map from "../../screens/map";
import Profile from "../../screens/profile";

import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const MapStack = () => {
  return (
    <Stack.Navigator initialRouteName="Index">
      <Stack.Screen name="Index" component={Map} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  )
}

export default MapStack