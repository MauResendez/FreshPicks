import React from "react";

import Feed from "../../screens/feed";
import Profile from "../../screens/profile";

import { createStackNavigator } from "@react-navigation/stack";
import { Image } from "react-native-ui-lib";

const Stack = createStackNavigator();

const FeedStack = () => {
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
            style={{ width: 200, height: 50, justifyContent: "center", alignItems: "center", alignSelf: "center", marginTop: 8 }}
            source={require("../../assets/logo.png")}
            resizeMode="contain"
          />
        ), 
        headerTitleAlign: "center",
      }}
    >      
      <Stack.Screen name="Index" component={Feed} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  )
}

export default FeedStack