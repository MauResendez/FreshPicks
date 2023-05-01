import React from "react";


import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image } from "react-native-ui-lib";
import ChangePhone from "../../screens/auth/change-phone";
import Conversation from "../../screens/chat/conversation";
import Settings from "../../screens/settings";
import AddBusiness from "../../screens/settings/add-business";
import UpdateFarmer from "../../screens/settings/update-farmer";
import UpdatePersonal from "../../screens/settings/update-personal";
import UpdateSchedule from "../../screens/settings/update-schedule";

const Stack = createNativeStackNavigator();

const SettingStack = () => {
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
      <Stack.Screen name="Index" component={Settings} />
      <Stack.Screen name="Conversation" component={Conversation} />
      <Stack.Screen name="Change Phone" component={ChangePhone} />
      <Stack.Screen name="Add Your Business" component={AddBusiness} />
      <Stack.Screen name="Update Personal Information" component={UpdatePersonal} />
      <Stack.Screen name="Update Farmer Information" component={UpdateFarmer} />
      <Stack.Screen name="Update Farmer Schedule" component={UpdateSchedule} />
    </Stack.Navigator>
  )
}

export default SettingStack