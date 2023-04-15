import React, { useLayoutEffect } from "react";

import Conversation from "../../screens/chat/conversation";
import Profile from "../../screens/profile";
import Search from "../../screens/search";
import Farmers from "../../screens/search/farmers";
import Listings from "../../screens/search/listings";

import { getFocusedRouteNameFromRoute, useNavigation, useRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const SearchStack = () => {
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
      <Stack.Screen name="Index" component={Search} />
      <Stack.Screen name="Farmers" component={Farmers} />
      <Stack.Screen name="Listings" component={Listings} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Conversation" component={Conversation} />
    </Stack.Navigator>
  )
}

export default SearchStack