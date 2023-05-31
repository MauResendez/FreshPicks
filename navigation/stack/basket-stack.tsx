import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import Basket from "../../screens/basket";

const Stack = createStackNavigator();

const BasketStack = () => {
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
      <Stack.Screen name="Index" component={Basket} />
    </Stack.Navigator>
  )
}

export default BasketStack