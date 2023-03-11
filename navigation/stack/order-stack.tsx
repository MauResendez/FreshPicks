import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import Conversation from "../../screens/chat/conversation";
import Orders from "../../screens/orders";
import Order from "../../screens/orders/order";

const Stack = createStackNavigator();

const OrderStack = () => {
  return (
    <Stack.Navigator initialRouteName="Index">
      <Stack.Screen name="Index" component={Orders} />
      <Stack.Screen name="Order" component={Order} />
      <Stack.Screen name="Conversation" component={Conversation} />
    </Stack.Navigator>
  )
}

export default OrderStack