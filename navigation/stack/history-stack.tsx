import React, { useLayoutEffect } from "react";

import { getFocusedRouteNameFromRoute, useNavigation, useRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import History from "../../screens/history";

const Stack = createStackNavigator();

const HistoryStack = () => {
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
      <Stack.Screen name="Index" component={History} />
    </Stack.Navigator>
  )
}

export default HistoryStack