import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import Drawer from "../drawer";

const MainStack = () => {
  return (
    <NavigationContainer>
      <StatusBar style={"auto"} animated />
      <Drawer />
    </NavigationContainer>
  )
}

export default MainStack