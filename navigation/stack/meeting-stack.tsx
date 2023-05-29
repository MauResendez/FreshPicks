import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform } from "react-native";
import { Image } from "react-native-ui-lib";
import Conversation from "../../screens/chat/conversation";
import Meetings from "../../screens/meetings";
import Meeting from "../../screens/meetings/meeting";
import { global } from "../../style";

const Stack = createNativeStackNavigator();

const MeetingStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Meetings" 
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
      <Stack.Screen name="Meetings" component={Meetings} />
      <Stack.Screen name="Meeting" component={Meeting} />
      <Stack.Screen name="Conversation" component={Conversation} />
    </Stack.Navigator>
  )
}

export default MeetingStack