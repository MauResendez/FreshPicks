import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import { Image } from "react-native-ui-lib";
import History from "../../screens/history";

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
            style={{ width: 200, height: 50 }}
            source={require("../../assets/logo.png")}
            resizeMode="contain"
          />
        ), 
      }}
    >      
      <Stack.Screen name="Index" component={History} />
    </Stack.Navigator>
  )
}

export default HistoryStack