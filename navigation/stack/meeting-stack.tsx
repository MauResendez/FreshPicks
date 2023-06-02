import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Conversation from "../../screens/chat/conversation";
import Meetings from "../../screens/meetings";
import Meeting from "../../screens/meetings/meeting";

const Stack = createNativeStackNavigator();

const MeetingStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Meetings" 
      screenOptions={{ 
        headerShown: true,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: 17,
        }
      }}
    >
      <Stack.Screen name="Calendar" component={Meetings} />
      <Stack.Screen name="Meeting" component={Meeting} />
      <Stack.Screen name="Conversation" component={Conversation} />
    </Stack.Navigator>
  )
}

export default MeetingStack