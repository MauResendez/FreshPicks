import React from "react";

import Dashboard from "../../screens/dashboard";

import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform } from "react-native";
import { Image } from "react-native-ui-lib";
import Report from "../../screens/dashboard/report";
import { global } from "../../style";

const Stack = createNativeStackNavigator();

const DashboardStack = () => {
  const navigation = useNavigation<any>();
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
      <Stack.Screen name="Index" component={Dashboard} />
      <Stack.Screen name="Report" component={Report} />
    </Stack.Navigator>
  )
}

export default DashboardStack