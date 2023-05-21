import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";

import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";

import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../firebase";

import { Platform } from "react-native";
import { Colors, LoaderScreen } from "react-native-ui-lib";
import Instructions from "../../screens/instructions";
import BasketStack from "../stack/basket-stack";
import DashboardStack from "../stack/dashboard-stack";
import HistoryStack from "../stack/history-stack";
import MapStack from "../stack/map-stack";
import MeetingStack from "../stack/meeting-stack";
import ProductStack from "../stack/product-stack";
import SearchStack from "../stack/search-stack";
import SettingStack from "../stack/setting-stack";
import TransactionStack from "../stack/transaction-stack";

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "Users", auth.currentUser.uid), (doc) => {
      setUser(doc.data());
      setLoading(false);
    });

    return unsubscribe
  }, [auth.currentUser.uid]);

  if (loading) {
    return (
      <LoaderScreen color={"#32CD32"} />
    );
  }

  return (
    <Tab.Navigator
      initialRouteName={user?.role ? "Dashboard" : "Home"}
      screenOptions={{
        headerShown: false,
        tabBarActiveBackgroundColor: Colors.white,
        tabBarActiveTintColor: "#32CD32",
        tabBarInactiveTintColor: Colors.grey40,
        tabBarShowLabel: false,
        unmountOnBlur: true
      }}
    >
      <Tab.Screen
        name={user?.role ? "Dashboard" : "Home"}
        component={user?.role ? DashboardStack : SearchStack}
        options={({ route }) => {
          let routeName = user?.role ? "Dashboard" : "Home";
          const current = getFocusedRouteNameFromRoute(route) ?? "Index";
          
          return {
            tabBarIcon: ({ color }) => (
              <MCIcon 
                name={user?.role ? "google-analytics" : "home"}
                size={24} 
                color={color} 
              />
            ),
            tabBarItemStyle: { paddingVertical: Platform.OS == "android" ? 4 : 0},
            tabBarLabel: routeName,
            // tabBarStyle: { display: current != "Index" ? "none" : "flex" },
            // headerShown: current != "Index" ? false : false,
            swipeEnabled: current != "Index" ? false : true,
          };
        }}
      />
      <Tab.Screen
        name={user?.role ? "Products" : "Basket"}
        component={user?.role ? ProductStack : BasketStack}
        options={({ route }) => {
          let routeName = user?.role ? "Products" : "Basket";
          const current = getFocusedRouteNameFromRoute(route) ?? "Index";
          
          return {
            tabBarIcon: ({ color }) => (
              <MCIcon
                name={user?.role ? "food-apple" : "basket"}
                size={24}
                color={color}
              />
            ),
            tabBarItemStyle: { paddingVertical: Platform.OS == "android" ? 4 : 0},
            tabBarLabel: routeName,
            // tabBarStyle: { display: current != "Index" ? "none" : "flex" },
            // headerShown: current != "Index" ? false : true,
            swipeEnabled: current != "Index" ? false : true,
          };
        }}
      />
      <Tab.Screen
        name={user?.role ? "Transactions" : "Map"}
        component={user?.role ? TransactionStack : MapStack}
        options={({ route }) => {
          let routeName = user?.role ? "Transactions" : "Map";
          const current = getFocusedRouteNameFromRoute(route) ?? "Index";

          return {
            tabBarIcon: ({ color }) => (
              <MCIcon
                name={user?.role ? "swap-horizontal-circle-outline" : "map-marker"}
                size={24}
                color={color}
              />
            ),
            tabBarItemStyle: { paddingVertical: Platform.OS == "android" ? 4 : 0},
            tabBarLabel: routeName,
            // tabBarStyle: { display: current != "Index" ? "none" : "flex" },
            // headerShown: current != "Index" ? false : true,
            swipeEnabled: current != "Index" ? false : true,
          };
        }}
      />
      <Tab.Screen
        name={user?.role ? "Meetings" : "History"}
        component={user?.role ? MeetingStack : HistoryStack}
        options={({ route }) => {
          let routeName = user?.role ? "Meetings" : "History";
          const current = getFocusedRouteNameFromRoute(route) ?? "Index";
          
          return {
            tabBarIcon: ({ color }) => (
              <MCIcon
                name={user?.role ? "clock-time-four-outline" : "history"}
                size={24}
                color={color}
              />
            ),
            tabBarItemStyle: { paddingVertical: Platform.OS == "android" ? 4 : 0},
            tabBarLabel: routeName,
            // tabBarStyle: { display: current != "Index" ? "none" : "flex" },
            // headerShown: current != "Index" ? false : true,
            swipeEnabled: current != "Index" ? false : true,
          };
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingStack}
        options={({ route }) => {
          const current = getFocusedRouteNameFromRoute(route) ?? "Index";
          
          return {
            tabBarIcon: ({ color }) => (
              <MCIcon name="cog" size={24} color={color} />
            ),
            tabBarItemStyle: { paddingVertical: Platform.OS == "android" ? 4 : 0},
            tabBarLabel: "Settings",
            // tabBarStyle: { display: current != "Index" ? "none" : "flex" },
            // headerShown: current != "Index" ? false : true,
            swipeEnabled: current != "Index" ? false : true,
          };
        }}
      />
      {/* <Tab.Screen
        name="Instructions"
        component={Instructions}
        options={({ route }) => {
          const current = getFocusedRouteNameFromRoute(route) ?? "Index";
          
          return {
            tabBarLabel: "Instructions",
            tabBarItemStyle: { display: "none" },
            // headerShown: current != "Instructions" ? false : true,
            swipeEnabled: current != "Index" ? false : true,
          };
        }}
      /> */}
      <Tab.Screen
        name="Instructions"
        component={Instructions}
        options={({ route }) => {
          const current = getFocusedRouteNameFromRoute(route) ?? "Index";
          
          return {
            tabBarLabel: "Instructions",
            tabBarItemStyle: { display: "none" },
            tabBarStyle: { display: "none" },
            // headerShown: current != "Instructions" ? false : true,
            swipeEnabled: current != "Index" ? false : true,
          };
        }}
      />
    </Tab.Navigator>
  );
}

export default MainTabs