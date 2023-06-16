import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Transactions from "../../screens/transactions";
import CreateExpense from "../../screens/transactions/create-expense";
import CreateRevenue from "../../screens/transactions/create-revenue";
import CreateTransaction from "../../screens/transactions/create-transaction";
import EditTransaction from "../../screens/transactions/edit-transaction";

const Stack = createNativeStackNavigator();

const TransactionStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Transactions" 
      screenOptions={{ 
        headerShown: true,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: 17,
        },
      }}
    >
      <Stack.Screen name="Transactions" component={Transactions} />
      <Stack.Screen name="Create Transaction" component={CreateTransaction} />
      <Stack.Screen name="Create Expense" component={CreateExpense} />
      <Stack.Screen name="Create Revenue" component={CreateRevenue} />
      <Stack.Screen name="Edit Transaction" component={EditTransaction} />
    </Stack.Navigator>
  )
}

export default TransactionStack