import React from "react";

import Dashboard from "../../screens/dashboard";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Report from "../../screens/dashboard/report";

const Stack = createNativeStackNavigator();

const DashboardStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Dashboard" 
      screenOptions={{
        headerShown: true,
        // headerTitle: () => (
        //   <Image
        //     style={Platform.OS == "android" ? global.androidHeader : global.iosHeader}
        //     source={require("../../assets/logo.png")}
        //     resizeMode="contain"
        //   />
        // ), 
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Report" component={Report} />
    </Stack.Navigator>
  )
}

export default DashboardStack