import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform } from "react-native";
import { Image } from "react-native-ui-lib";
import Transactions from "../../screens/transactions";
import CreateTransaction from "../../screens/transactions/create-transaction";
import { global } from "../../style";

const Stack = createNativeStackNavigator();

const TransactionStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Transactions" 
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
      <Stack.Screen name="Transactions" component={Transactions} />
      <Stack.Screen name="Create Transaction" component={CreateTransaction} />
    </Stack.Navigator>
  )
}

export default TransactionStack