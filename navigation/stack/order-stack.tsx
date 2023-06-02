import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Conversation from "../../screens/chat/conversation";
import Orders from "../../screens/orders";
import Order from "../../screens/orders/order";

const Stack = createNativeStackNavigator();

const OrderStack = () => {
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
      <Stack.Screen name="Orders" component={Orders} />
      <Stack.Screen name="Order" component={Order} />
      <Stack.Screen name="Conversation" component={Conversation} />
    </Stack.Navigator>
  )
}

export default OrderStack