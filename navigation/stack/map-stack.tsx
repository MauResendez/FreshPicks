import React from "react";

import Map from "../../screens/map";
import Profile from "../../screens/profile";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const MapStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Map" 
      screenOptions={{ 
        headerShadowVisible: false,
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