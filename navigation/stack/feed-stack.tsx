import React, { useLayoutEffect } from "react";

import Feed from "../../screens/feed";
import Profile from "../../screens/profile";

import { getFocusedRouteNameFromRoute, useNavigation, useRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const FeedStack = () => {
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
      <Stack.Screen name="Index" component={Feed} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  )
}

export default FeedStack