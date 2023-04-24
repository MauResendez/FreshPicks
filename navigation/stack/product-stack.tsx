import React, { useLayoutEffect } from "react";

import Dashboard from "../../screens/products";
import CreatePost from "../../screens/products/create-post";
import CreateSubscription from "../../screens/products/create-subscription";
import EditPost from "../../screens/products/edit-post";
import EditSubscription from "../../screens/products/edit-subscription";

import { getFocusedRouteNameFromRoute, useNavigation, useRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import CreateProduct from "../../screens/products/create-product";
import EditProduct from "../../screens/products/edit-product";

const Stack = createStackNavigator();

const ProductStack = () => {
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
      <Stack.Screen name="Index" component={Dashboard} />
      <Stack.Screen name="Create Listing" component={CreateProduct} />
      <Stack.Screen name="Create Post" component={CreatePost} />
      <Stack.Screen name="Create Subscription" component={CreateSubscription} />
      <Stack.Screen name="Edit Listing" component={EditProduct} />
      <Stack.Screen name="Edit Post" component={EditPost} />
      <Stack.Screen name="Edit Subscription" component={EditSubscription} />
    </Stack.Navigator>
  )
}

export default ProductStack