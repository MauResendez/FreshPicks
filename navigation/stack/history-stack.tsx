import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import Conversation from "../../screens/chat/conversation";
import History from "../../screens/history";

const Stack = createStackNavigator();

const HistoryStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Index" 
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
      <Stack.Screen name="History" component={History} />
      <Stack.Screen name="Conversation" component={Conversation} />
    </Stack.Navigator>
  )
}

export default HistoryStack