import React from "react";

import Dashboard from "../../screens/dashboard";
import CreateListing from "../../screens/dashboard/create-listing";
import CreatePost from "../../screens/dashboard/create-post";
import EditListing from "../../screens/dashboard/edit-listing";
import EditPost from "../../screens/dashboard/edit-post";

import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const DashboardStack = () => {
  return (
    <Stack.Navigator initialRouteName="Index">
      <Stack.Screen name="Index" component={Dashboard} />
      <Stack.Screen name="Create Listing" component={CreateListing} />
      <Stack.Screen name="Create Post" component={CreatePost} />
      <Stack.Screen name="Edit Listing" component={EditListing} />
      <Stack.Screen name="Edit Post" component={EditPost} />
    </Stack.Navigator>
  )
}

export default DashboardStack