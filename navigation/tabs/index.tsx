import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, View } from "react-native-ui-lib";

import Ionicon from "react-native-vector-icons/Ionicons";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";

import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../firebase";

import Cart from "../../screens/cart";
import Instructions from "../../screens/instructions";
import Inventory from "../../screens/inventory";
import AccountStack from "../stack/account-stack";
import ChatStack from "../stack/chat-stack";
import DashboardStack from "../stack/dashboard-stack";
import FeedStack from "../stack/feed-stack";
import MapStack from "../stack/map-stack";
import OrderStack from "../stack/order-stack";
import SearchStack from "../stack/search-stack";

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "Users", auth.currentUser.uid), (doc) => {
      setUser(doc.data());
    });

    return unsubscribe
  }, [auth.currentUser.uid]);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerLeft: () => (
          <View style={{ flexDirection: "row" }}>
            <Ionicon
              name={"notifications"}
              size={24}
              color={"green"}
              style={{ marginHorizontal: 16 }}
              onPress={() => navigation.navigate("Notifications")}
            />
          </View>
        ),
        headerRight: () => (
          <View style={{ flexDirection: "row" }}>
            {!user?.role && (
              <Ionicon
                name={"cart"}
                size={24}
                color={"green"}
                style={{ marginHorizontal: 12 }}
                onPress={() => navigation.navigate("Cart")}
              />
            )}
          </View>
        ),
        headerTitle: () => (
          <Image
            style={{ width: 160, height: 40 }}
            source={require("../../assets/logo.png")}
            resizeMode="contain"
          />
        ),
        headerTitleAlign: "center",
      }}
    >
      <Tab.Screen
        name="Home"
        component={user?.role ? DashboardStack : SearchStack}
        options={({ route }) => {
          const current = getFocusedRouteNameFromRoute(route) ?? "Index";

          return {
            tabBarIcon: ({ color }) => (
              <Ionicon name="home" size={24} color={color} />
            ),
            tabBarLabel: "Home",
            tabBarStyle: { display: current != "Index" ? "none" : "flex" },
            headerShown: current != "Index" ? false : true,
            swipeEnabled: current != "Index" ? false : true,
            tabBarActiveTintColor: "green",
          };
        }}
      />
      <Tab.Screen
        name={user?.role ? "Inbox" : "Chat"}
        component={ChatStack}
        options={({ route }) => {
          let routeName = user?.role ? "Inbox" : "Chat";
          const current = getFocusedRouteNameFromRoute(route) ?? "Index";

          return {
            tabBarIcon: ({ color }) => (
              <MCIcon
                name={user?.role ? "inbox" : "chat"}
                size={24}
                color={color}
              />
            ),
            tabBarLabel: routeName,
            tabBarStyle: { display: current != "Index" ? "none" : "flex" },
            headerShown: current != "Index" ? false : true,
            swipeEnabled: current != "Index" ? false : true,
            tabBarActiveTintColor: "green",
          };
        }}
      />
      <Tab.Screen
        name={user?.role ? "Orders" : "Map"}
        component={user?.role ? OrderStack : MapStack}
        options={({ route }) => {
          let routeName = user?.role ? "Orders" : "Map";
          const current = getFocusedRouteNameFromRoute(route) ?? "Index";

          return {
            tabBarIcon: ({ color }) => (
              <Ionicon
                name={user?.role ? "basket" : "location-sharp"}
                size={24}
                color={color}
              />
            ),
            tabBarLabel: routeName,
            tabBarStyle: { display: current != "Index" ? "none" : "flex" },
            headerShown: current != "Index" ? false : true,
            swipeEnabled: current != "Index" ? false : true,
            tabBarActiveTintColor: "green",
          };
        }}
      />
      <Tab.Screen
        name={user?.role ? "Inventory" : "Feed"}
        component={user?.role ? Inventory : FeedStack}
        options={({ route }) => {
          let routeName = user?.role ? "Inventory" : "Feed";
          const current = getFocusedRouteNameFromRoute(route) ?? "Index";

          return {
            tabBarIcon: ({ color }) => (
              <Ionicon
                name={user?.role ? "clipboard" : "analytics"}
                size={24}
                color={color}
              />
            ),
            tabBarLabel: routeName,
            tabBarStyle: { display: current != "Index" ? "none" : "flex" },
            headerShown: current != "Index" ? false : true,
            swipeEnabled: current != "Index" ? false : true,
            tabBarActiveTintColor: "green",
          };
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountStack}
        options={({ route }) => {
          const current = getFocusedRouteNameFromRoute(route) ?? "Index";

          return {
            tabBarIcon: ({ color }) => (
              <Ionicon name="person" size={24} color={color} />
            ),
            tabBarLabel: "Account",
            tabBarStyle: { display: current != "Index" ? "none" : "flex" },
            headerShown: current != "Index" ? false : true,
            swipeEnabled: current != "Index" ? false : true,
            tabBarActiveTintColor: "green",
          };
        }}
      />
      <Tab.Screen
        name="Cart"
        component={Cart}
        options={({ route }) => {
          const current = getFocusedRouteNameFromRoute(route) ?? "Cart";

          return {
            tabBarLabel: "Cart",
            tabBarItemStyle: { display: "none" },
            headerShown: current != "Cart" ? false : true,
            swipeEnabled: current != "Cart" ? false : true,
          };
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={AccountStack}
        options={({ route }) => {
          const current = getFocusedRouteNameFromRoute(route) ?? "Index";

          return {
            tabBarIcon: ({ color }) => (
              <Ionicon name="person" size={24} color={color} />
            ),
            tabBarLabel: "Index",
            tabBarItemStyle: { display: "none" },
            headerShown: current != "Index" ? false : true,
            swipeEnabled: current != "Index" ? false : true,
          };
        }}
      />
      <Tab.Screen
        name="Instructions"
        component={Instructions}
        options={({ route }) => {
          const current = getFocusedRouteNameFromRoute(route) ?? "Instructions";

          return {
            tabBarLabel: "Instructions",
            tabBarItemStyle: { display: "none" },
            headerShown: current != "Instructions" ? false : true,
            swipeEnabled: current != "Instructions" ? false : true,
          };
        }}
      />
    </Tab.Navigator>
  );
}

export default MainTabs