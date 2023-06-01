import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";



import { View } from "react-native-ui-lib";
import ConsumerTabs from "./consumer-tabs";
import FarmerTabs from "./farmer-tabs";

const Tab = createBottomTabNavigator();

const MainTabs = (props) => {
  const {user} = props;

  return (
    <View flex>
      {user?.role === "Farmer" ? <FarmerTabs /> : <ConsumerTabs />}
    </View>
  );
}

export default MainTabs