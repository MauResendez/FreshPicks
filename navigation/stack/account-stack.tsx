import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import Account from "../../screens/account";
import AddBusiness from "../../screens/account/add-business";
import OrderHistory from "../../screens/account/order-history";
import UpdateFarmer from "../../screens/account/update-farmer";
import UpdatePayments from "../../screens/account/update-payments";
import UpdatePersonal from "../../screens/account/update-personal";
import UpdateSchedule from "../../screens/account/update-schedule";
import ChangePhone from "../../screens/auth/change-phone";
import Conversation from "../../screens/chat/conversation";

const Stack = createStackNavigator();

const AccountStack = () => {
  return (
    <Stack.Navigator initialRouteName="Index">
      <Stack.Screen name="Index" component={Account} />
      <Stack.Screen name="Order History" component={OrderHistory} />
      <Stack.Screen name="Conversation" component={Conversation} />
      <Stack.Screen name="Change Phone" component={ChangePhone} />
      <Stack.Screen name="Add Your Business" component={AddBusiness} />
      <Stack.Screen name="Update Personal Information" component={UpdatePersonal} />
      <Stack.Screen name="Update Farmer Information" component={UpdateFarmer} />
      <Stack.Screen name="Update Farmer Schedule" component={UpdateSchedule} />
      <Stack.Screen name="Update Payment Information" component={UpdatePayments} />
    </Stack.Navigator>
  )
}

export default AccountStack