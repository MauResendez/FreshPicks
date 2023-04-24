import React, { useLayoutEffect } from "react";


import { getFocusedRouteNameFromRoute, useNavigation, useRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Transactions from "../../screens/transactions";
import CreateTransaction from "../../screens/transactions/create-transaction";

const Stack = createStackNavigator();

const TransactionStack = () => {
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
      <Stack.Screen name="Index" component={Transactions} />
      <Stack.Screen name="Create Transaction" component={CreateTransaction} />
    </Stack.Navigator>
  )
}

export default TransactionStack