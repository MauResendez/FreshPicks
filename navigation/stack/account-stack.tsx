import React, { useLayoutEffect } from "react";

import { getFocusedRouteNameFromRoute, useNavigation, useRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Account from "../../screens/account";
import AddBusiness from "../../screens/account/add-business";
import UpdateFarmer from "../../screens/account/update-farmer";
import UpdatePersonal from "../../screens/account/update-personal";
import UpdateSchedule from "../../screens/account/update-schedule";
import ChangePhone from "../../screens/auth/change-phone";
import Conversation from "../../screens/chat/conversation";

const Stack = createStackNavigator();

const AccountStack = () => {
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
      <Stack.Screen name="Index" component={Account} />
      <Stack.Screen name="Conversation" component={Conversation} />
      <Stack.Screen name="Change Phone" component={ChangePhone} />
      <Stack.Screen name="Add Your Business" component={AddBusiness} />
      <Stack.Screen name="Update Personal Information" component={UpdatePersonal} />
      <Stack.Screen name="Update Farmer Information" component={UpdateFarmer} />
      <Stack.Screen name="Update Farmer Schedule" component={UpdateSchedule} />
    </Stack.Navigator>
  )
}

export default AccountStack