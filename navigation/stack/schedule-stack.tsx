import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Conversation from "../../screens/chat/conversation";
import Order from "../../screens/orders/order";
import Schedule from "../../screens/schedule";

const Stack = createNativeStackNavigator();

const ScheduleStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Orders" 
      screenOptions={{ 
        headerShown: true,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: 17,
        }, 
      }}
    >
      <Stack.Screen name="Schedule" component={Schedule} />
      <Stack.Screen name="Order" component={Order} />
      <Stack.Screen name="Conversation" component={Conversation} />
    </Stack.Navigator>
  )
}

export default ScheduleStack