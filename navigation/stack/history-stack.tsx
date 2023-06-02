import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import Conversation from "../../screens/chat/conversation";
import History from "../../screens/history";
import Order from "../../screens/orders/order";

const Stack = createStackNavigator();

const HistoryStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="History" 
      screenOptions={{ 
        headerShown: true,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: 17,
        }, 
      }}
    >      
      <Stack.Screen name="History" component={History} />
      <Stack.Screen name="Order" component={Order} />
      <Stack.Screen name="Conversation" component={Conversation} />
    </Stack.Navigator>
  )
}

export default HistoryStack