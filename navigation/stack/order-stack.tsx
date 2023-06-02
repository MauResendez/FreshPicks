import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Conversation from "../../screens/chat/conversation";
import Meeting from "../../screens/meetings/meeting";
import Orders from "../../screens/orders";

const Stack = createNativeStackNavigator();

const OrderStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Orders" 
      screenOptions={{ 
        headerShown: true,
        // headerTitle: () => (
        //   <Image
        //     style={Platform.OS == "android" ? global.androidHeader : global.iosHeader}
        //     source={require("../../assets/logo.png")}
        //     resizeMode="contain"
        //   />
        // ), 
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="Orders" component={Orders} />
      <Stack.Screen name="Meeting" component={Meeting} />
      <Stack.Screen name="Conversation" component={Conversation} />
    </Stack.Navigator>
  )
}

export default OrderStack