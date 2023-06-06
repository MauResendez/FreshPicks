import React from "react";

import Landing from "../../screens/auth/landing";
import Login from "../../screens/auth/login";
import Register from "../../screens/auth/register";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import Instructions from "../../screens/instructions";
// import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
// options={{ headerLeft: () => <MCIcon name="chevron-left" size={36} style={{ marginLeft: 8 }} />}}

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <NavigationContainer>
      <StatusBar style={"auto"} animated />
      <Stack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Landing" component={Landing} />
        <Stack.Screen name="Login" component={Login}  />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Instructions" component={Instructions} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AuthStack