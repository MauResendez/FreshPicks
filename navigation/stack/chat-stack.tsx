import React, { useLayoutEffect } from "react";

import Chat from "../../screens/chat";
import Conversation from "../../screens/chat/conversation";
import Search from "../../screens/chat/search";

import { getFocusedRouteNameFromRoute, useNavigation, useRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const ChatStack = () => {
  const navigation = useNavigation<any>();
  const parent = navigation.getParent("MainDrawer");
  const route = useRoute();

  useLayoutEffect(() => {
    const current = getFocusedRouteNameFromRoute(route) ?? "Index";

    parent.setOptions({
      headerShown: current == "Index" ? true : false
    });
  }, [route]);
  
  return (
    <Stack.Navigator initialRouteName="Index" screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Index" component={Chat} />
      <Stack.Screen name="Conversation" component={Conversation} />
      <Stack.Screen name="Search" component={Search} />
    </Stack.Navigator>
  )
}

export default ChatStack