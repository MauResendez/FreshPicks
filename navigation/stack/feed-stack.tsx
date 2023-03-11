import React from "react";

import Feed from "../../screens/feed";
import Profile from "../../screens/profile";

import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const FeedStack = () => {
  return (
    <Stack.Navigator initialRouteName="Index">
      <Stack.Screen name="Index" component={Feed} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  )
}

export default FeedStack