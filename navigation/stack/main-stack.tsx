import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { Platform } from "react-native";
import Drawer from "../drawer";

const MainStack = () => {
  return (
    <NavigationContainer>
      {Platform.OS == "web" ? <Drawer /> : <Drawer />}
    </NavigationContainer>
  )
}

export default MainStack