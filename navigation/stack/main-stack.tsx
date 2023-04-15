import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import Drawer from "../drawer";

const MainStack = () => {
  return (
    <NavigationContainer>
      <Drawer />
    </NavigationContainer>
  )
}

export default MainStack