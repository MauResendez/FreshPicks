import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import { Platform } from "react-native";
import { Image } from "react-native-ui-lib";
import History from "../../screens/history";
import { global } from "../../style";

const Stack = createStackNavigator();

const HistoryStack = () => {
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
      <Stack.Screen name="Index" component={History} />
    </Stack.Navigator>
  )
}

export default HistoryStack