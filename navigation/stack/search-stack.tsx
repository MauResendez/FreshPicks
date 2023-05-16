import React from "react";

import Conversation from "../../screens/chat/conversation";
import Profile from "../../screens/profile";
import Search from "../../screens/search";
import Farmers from "../../screens/search/farmers";
import Products from "../../screens/search/products";

import { useNavigation, useRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform } from "react-native";
import { Image } from "react-native-ui-lib";
import Basket from "../../screens/basket";
import { global } from "../../style";

const Stack = createNativeStackNavigator();

const SearchStack = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
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
      <Stack.Screen name="Index" component={Search} />
      <Stack.Screen name="Farmers" component={Farmers} />
      <Stack.Screen name="Products" component={Products} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Conversation" component={Conversation} />
      <Stack.Screen name="Basket" component={Basket} />
    </Stack.Navigator>
  )
}

export default SearchStack