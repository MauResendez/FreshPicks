import React from "react";

import Chat from "../../screens/chat";
import Conversation from "../../screens/chat/conversation";
import Search from "../../screens/chat/search";

import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const ChatStack = () => {
  return (
    <Stack.Navigator initialRouteName="Chat" screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="Conversation" component={Conversation} />
      <Stack.Screen name="Search" component={Search} />
    </Stack.Navigator>
  )
}

export default ChatStack