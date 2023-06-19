import React from "react";


import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Issues from "../../screens/issues";

const Stack = createNativeStackNavigator();

const IssueStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Issues" 
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: 17,
        }, 
      }}
    >
      <Stack.Screen name="Issues" component={Issues} />
    </Stack.Navigator>
  )
}

export default IssueStack