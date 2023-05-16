import React from "react";

import Map from "../../screens/map";
import Profile from "../../screens/profile";

import { createStackNavigator } from "@react-navigation/stack";
import { Platform } from "react-native";
import { Image } from "react-native-ui-lib";
import { global } from "../../style";

const Stack = createStackNavigator();

const MapStack = () => {
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
      <Stack.Screen name="Index" component={Map} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  )
}

export default MapStack