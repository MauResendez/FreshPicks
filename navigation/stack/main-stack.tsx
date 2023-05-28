import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Platform } from "react-native";
import Instructions from "../../screens/instructions";
import MainDrawer from "../drawer";
import MainTabs from "../tabs";

const Stack = createStackNavigator();

const MainStack = () => {
  return (
    <NavigationContainer>
      {Platform.OS !== "web" ? <MainTabs /> : <MainDrawer />}
      <Stack.Screen name="Instructions" component={Instructions} />
    </NavigationContainer>
  )
}

export default MainStack