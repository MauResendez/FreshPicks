import React from "react";

import Map from "../../screens/map";
import Profile from "../../screens/profile";

import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const MapStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Map" 
      screenOptions={{ 
        headerShown: true,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: 17,
        }, 
      }}
    >      
      <Stack.Screen name="Map" component={Map} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  )
}

export default MapStack