import React from "react";


import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image } from "react-native-ui-lib";
import Conversation from "../../screens/chat/conversation";
import Meetings from "../../screens/meetings";
import Meeting from "../../screens/meetings/meeting";

const Stack = createNativeStackNavigator();

const MeetingStack = () => {
  // const navigation = useNavigation<any>();
  // const parent = navigation.getParent("MainDrawer");
  // const route = useRoute();

  // useLayoutEffect(() => {
  //   const current = getFocusedRouteNameFromRoute(route) ?? "Index";

  //   parent.setOptions({
  //     headerShown: current == "Index" ? true : false,
  //     headerRight: null
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
      <Stack.Screen name="Index" component={Meetings} />
      <Stack.Screen name="Order" component={Meeting} />
      <Stack.Screen name="Conversation" component={Conversation} />
    </Stack.Navigator>
  )
}

export default MeetingStack