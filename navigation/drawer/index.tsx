import { createDrawerNavigator } from "@react-navigation/drawer";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image } from "react-native";

import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../firebase";

import Cart from "../../screens/cart";
import AccountStack from "../stack/account-stack";

import MainTabs from "../tabs";

import { Colors } from "react-native-ui-lib";
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Recipes from "../../screens/recipes";
import ChatStack from "../stack/chat-stack";

const Drawer = createDrawerNavigator();

const MainDrawer = () => {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "Users", auth.currentUser.uid), (doc) => {
      setUser(doc.data());
    });

    return unsubscribe
  }, [auth.currentUser.uid]);
  
  return (
    <Drawer.Navigator
      id="MainDrawer"
      initialRouteName="Main"
      // useLegacyImplementation
      // drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={({ navigation, route }) => ({ 
        drawerLabelStyle: {
          color: Colors.black,
          fontSize: 16,
        },
        headerShown: true,
        headerTintColor: Colors.black,
        headerTitle: () => (
          <Image
            style={{ width: 200, height: 50 }}
            source={require("../../assets/logo.png")}
            resizeMode="contain"
          />
        ),
        headerTitleAlign: "center",
        unmountOnBlur: true
      })}
    >
      <Drawer.Screen
        name="App"
        component={MainTabs}
        options={({ route }) => {
          return {
            drawerIcon: ({ color }) => (
              <MCIcon name="application-brackets" size={24} color={Colors.black} />
            )
          };
        }}
      />
      <Drawer.Screen
        name="Cart"
        component={Cart}
        options={({ route }) => {
          return {
            drawerIcon: ({ color }) => (
              <MCIcon name="cart" size={24} color={Colors.black} />
            ),
          };
        }}
      />
      <Drawer.Screen
        name="Chat"
        component={ChatStack}
        options={({ route }) => {
          const current = getFocusedRouteNameFromRoute(route) ?? "Index";

          return {
            drawerIcon: ({ color }) => (
              <MCIcon name="message" size={24} color={Colors.black} />
            ),
            headerShown: current != "Index" ? false : true,
            swipeEnabled: current != "Index" ? false : true,
            drawerActiveTintColor: "#323232"
          };
        }}
      />
      <Drawer.Screen
        name="Recipes"
        component={Recipes}
        options={() => {
          return {
            drawerIcon: ({ color }) => (
              <MCIcon name="chef-hat" size={24} color={Colors.black} />
            )
          };
        }}
      />
      <Drawer.Screen
        name="About Us"
        component={Recipes}
        options={() => {
          return {
            drawerIcon: ({ color }) => (
              <MCIcon name="information-outline" size={24} color={Colors.black} />
            )
          };
        }}
      />
      <Drawer.Screen
        name="Report an Issue"
        component={AccountStack}
        options={({ route }) => {
          return {
            drawerIcon: ({ color }) => (
              <MCIcon name="bug" size={24} color={Colors.black} />
            ),
          };
        }}
      />
    </Drawer.Navigator>
  );
}

export default MainDrawer