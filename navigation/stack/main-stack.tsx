import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { Platform } from "react-native";
import MainDrawer from "../drawer";
import MainTabs from "../tabs";

const MainStack = () => {  
  return (
    <NavigationContainer>
      {Platform.OS !== "web" ? <MainTabs /> : <MainDrawer />}
    </NavigationContainer>
  )
}

export default MainStack