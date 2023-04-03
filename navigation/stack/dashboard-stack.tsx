import React from "react";

import Dashboard from "../../screens/dashboard";

import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const DashboardStack = () => {
  return (
    <Stack.Navigator initialRouteName="Index">
      <Stack.Screen name="Index" component={Dashboard} />
    </Stack.Navigator>
  )
}

export default DashboardStack