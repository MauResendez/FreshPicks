import React from "react";

import Dashboard from "../../screens/dashboard";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Report from "../../screens/dashboard/report";
import Instructions from "../../screens/instructions";

const Stack = createNativeStackNavigator();

const DashboardStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Dashboard" 
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: 17,
        }, 
      }}
    >
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Report" component={Report} />
      <Stack.Screen name="Instructions" component={Instructions} />
    </Stack.Navigator>
  )
}

export default DashboardStack