import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { Platform } from "react-native";
import Drawer from "../drawer";
import Tabs from "../tabs";

const MainStack = () => {
  return (
    <NavigationContainer>
      {Platform.OS == "web" ? <Drawer /> : <Tabs />}
    </NavigationContainer>
  )
}

export default MainStack