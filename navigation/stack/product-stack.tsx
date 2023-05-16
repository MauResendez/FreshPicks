import React from "react";

import Dashboard from "../../screens/products";
import CreatePost from "../../screens/products/create-post";
import CreateSubscription from "../../screens/products/create-subscription";
import EditPost from "../../screens/products/edit-post";
import EditSubscription from "../../screens/products/edit-subscription";

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from "react-native";
import { Image } from "react-native-ui-lib";
import CreateProduct from "../../screens/products/create-product";
import EditProduct from "../../screens/products/edit-product";
import { global } from "../../style";

const Stack = createNativeStackNavigator();

const ProductStack = () => {
  // const navigation = useNavigation<any>();
  // const parent = navigation.getParent("MainDrawer");
  // const route = useRoute();

  // useLayoutEffect(() => {
  //   const current = getFocusedRouteNameFromRoute(route) ?? "Index";

  //   parent.setOptions({
  //     headerShown: current == "Index" ? true : false
  //   });
  // }, [route]);
  
  return (
    <Stack.Navigator 
      initialRouteName="Index" 
      screenOptions={{ 
        headerShown: true,
        headerTitle: () => (
          <Image
            style={Platform.OS == "android" ? global.androidHeader : global.iosHeader}
            source={require("../../assets/logo.png")}
            resizeMode="contain"
          />
        ), 
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="Index" component={Dashboard} />
      <Stack.Screen name="Create Product" component={CreateProduct} />
      <Stack.Screen name="Create Post" component={CreatePost} />
      <Stack.Screen name="Create Subscription" component={CreateSubscription} />
      <Stack.Screen name="Edit Listing" component={EditProduct} />
      <Stack.Screen name="Edit Post" component={EditPost} />
      <Stack.Screen name="Edit Subscription" component={EditSubscription} />
    </Stack.Navigator>
  )
}

export default ProductStack