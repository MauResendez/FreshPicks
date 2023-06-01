import React from "react";


import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChangePhone from "../../screens/auth/change-phone";
import Conversation from "../../screens/chat/conversation";
import Settings from "../../screens/settings";
import AddBusiness from "../../screens/settings/add-business";
import LinkAccount from "../../screens/settings/link-account";
import UpdateFarmer from "../../screens/settings/update-farmer";
import UpdateLocation from "../../screens/settings/update-location";
import UpdatePersonal from "../../screens/settings/update-personal";
import UpdateSchedule from "../../screens/settings/update-schedule";

const Stack = createNativeStackNavigator();

const SettingStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Settings" 
      screenOptions={{ 
        headerShown: true,
        // headerTitle: () => (
        //   <Image
        //     style={Platform.OS == "android" ? global.androidHeader : global.iosHeader}
        //     source={require("../../assets/logo.png")}
        //     resizeMode="contain"
        //   />
        // ),
        headerTitleStyle: {
          fontSize: 17,
        },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Conversation" component={Conversation} />
      <Stack.Screen name="Change Phone" component={ChangePhone} />
      <Stack.Screen name="Add Your Business" component={AddBusiness} />
      <Stack.Screen name="Link Account" component={LinkAccount} />
      <Stack.Screen name="Update Personal Information" component={UpdatePersonal} />
      <Stack.Screen name="Update Farmer Information" component={UpdateFarmer} />
      <Stack.Screen name="Update Farmer Location" component={UpdateLocation} />
      <Stack.Screen name="Update Farmer Schedule" component={UpdateSchedule} />
    </Stack.Navigator>
  )
}

export default SettingStack