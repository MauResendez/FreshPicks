import React, { useLayoutEffect } from "react";

import { getFocusedRouteNameFromRoute, useNavigation, useRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Conversation from "../../screens/chat/conversation";
import Meetings from "../../screens/meetings";
import Meeting from "../../screens/meetings/meeting";

const Stack = createStackNavigator();

const MeetingStack = () => {
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
      <Stack.Screen name="Index" component={Meetings} />
      <Stack.Screen name="Order" component={Meeting} />
      <Stack.Screen name="Conversation" component={Conversation} />
    </Stack.Navigator>
  )
}

export default MeetingStack