import React from "react";

import Dashboard from "../../screens/dashboard";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Cashflow from "../../screens/dashboard/cashflow";
import Products from "../../screens/dashboard/products";
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
      <Stack.Screen name="Cashflow" component={Cashflow} />
      <Stack.Screen name="Products" component={Products} />
      <Stack.Screen name="Report" component={Report} />
      <Stack.Screen name="Instructions" component={Instructions} />
    </Stack.Navigator>
  )
}

export default DashboardStack