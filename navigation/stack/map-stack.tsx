import React from "react";

import Map from "../../screens/map";
import Profile from "../../screens/profile";

import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const MapStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Index" 
      screenOptions={{ 
        headerShown: true,
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
      <Stack.Screen name="Map" component={Map} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  )
}

export default MapStack