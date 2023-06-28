import React from "react";


import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Accounts from "../../screens/accounts";

const Stack = createNativeStackNavigator();

const AccountStack = () => { 
  return (
    <Stack.Navigator 
      initialRouteName="Content" 
      screenOptions={{ 
        headerShown: true,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: 17,
        }, 
      }}
    >
      <Stack.Screen name="Accounts" component={Accounts} />
    </Stack.Navigator>
  )
}

export default AccountStack