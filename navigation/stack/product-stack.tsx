import React, { useLayoutEffect } from "react";

import Dashboard from "../../screens/products";
import CreateListing from "../../screens/products/create-listing";
import CreatePost from "../../screens/products/create-post";
import CreateSubscription from "../../screens/products/create-subscription";
import EditListing from "../../screens/products/edit-listing";
import EditPost from "../../screens/products/edit-post";
import EditSubscription from "../../screens/products/edit-subscription";

import { getFocusedRouteNameFromRoute, useNavigation, useRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const ProductStack = () => {
  const navigation = useNavigation<any>();
  const parent = navigation.getParent("MainDrawer");
  const route = useRoute();

  useLayoutEffect(() => {
    const current = getFocusedRouteNameFromRoute(route) ?? "Index";

    parent.setOptions({
      headerShown: current == "Index" ? true : false,
    });
  }, [route]);
  
  return (
    <Stack.Navigator initialRouteName="Index" screenOptions={{ headerShown: true, headerBackTitleVisible: false }}>
      <Stack.Screen name="Index" component={Dashboard} />
      <Stack.Screen name="Create Listing" component={CreateListing} />
      <Stack.Screen name="Create Post" component={CreatePost} />
      <Stack.Screen name="Create Subscription" component={CreateSubscription} />
      <Stack.Screen name="Edit Listing" component={EditListing} />
      <Stack.Screen name="Edit Post" component={EditPost} />
      <Stack.Screen name="Edit Subscription" component={EditSubscription} />
    </Stack.Navigator>
  )
}

export default ProductStack