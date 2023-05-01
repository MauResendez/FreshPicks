import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image } from "react-native-ui-lib";
import Transactions from "../../screens/transactions";
import CreateTransaction from "../../screens/transactions/create-transaction";

const Stack = createNativeStackNavigator();

const TransactionStack = () => {
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
            style={{ width: 200, height: 50 }}
            source={require("../../assets/logo.png")}
            resizeMode="contain"
          />
        ), 
      }}
    >
      <Stack.Screen name="Index" component={Transactions} />
      <Stack.Screen name="Create Transaction" component={CreateTransaction} />
    </Stack.Navigator>
  )
}

export default TransactionStack