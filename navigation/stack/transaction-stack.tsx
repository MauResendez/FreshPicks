import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform } from "react-native";
import { Image } from "react-native-ui-lib";
import Transactions from "../../screens/transactions";
import CreateTransaction from "../../screens/transactions/create-transaction";
import { global } from "../../style";

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
            style={Platform.OS == "android" ? global.androidHeader : global.iosHeader}
            source={require("../../assets/logo.png")}
            resizeMode="contain"
          />
        ), 
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="Index" component={Transactions} />
      <Stack.Screen name="Create Transaction" component={CreateTransaction} />
    </Stack.Navigator>
  )
}

export default TransactionStack