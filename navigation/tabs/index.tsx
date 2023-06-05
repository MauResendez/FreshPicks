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
import OrderStack from "../stack/order-stack";
import ProductStack from "../stack/product-stack";
import SearchStack from "../stack/search-stack";
import SettingStack from "../stack/setting-stack";
import TransactionStack from "../stack/transaction-stack";

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriber = onSnapshot(doc(db, "Users", auth.currentUser.uid), (doc) => {
      setUser(doc.data());
      setLoading(false);
    });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, [auth.currentUser.uid]);

  if (loading) {
    return (
      <LoaderScreen color={"#32CD32"} />
    );
  }

  return (
    <Tab.Navigator
      initialRouteName={user?.role === "Farmer" ? "Dashboard" : "Home"}
      screenOptions={{
        headerShown: false,
        tabBarActiveBackgroundColor: Colors.white,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.grey40,
        tabBarShowLabel: false,
        unmountOnBlur: true
      }}
    >
      <Tab.Screen
        name={"First"}
        component={user?.role === "Farmer" ? DashboardStack : SearchStack}
        options={({ route }) => {
          let routeName = user?.role === "Farmer" ? "Dashboard" : "Search";
          
          return {
            tabBarIcon: ({ color }) => (
              <MCIcon 
                name={user?.role === "Farmer" ? "google-analytics" : "home"}
                size={24} 
                color={color} 
              />
            ),
            tabBarItemStyle: { paddingVertical: Platform.OS === "android" ? 4 : 0},
            tabBarLabel: routeName,
          };
        }}
      />
      <Tab.Screen
        name={"Second"}
        component={user?.role === "Farmer" ? ProductStack : BasketStack}
        options={({ route }) => {
          let routeName = user?.role === "Farmer" ? "Products" : "Basket";
          
          return {
            tabBarIcon: ({ color }) => (
              <MCIcon
                name={user?.role === "Farmer" ? "food-apple" : "basket"}
                size={24}
                color={color}
              />
            ),
            tabBarItemStyle: { paddingVertical: Platform.OS === "android" ? 4 : 0},
            tabBarLabel: routeName,
            unmountOnBlur: false
          };
        }}
      />
      <Tab.Screen
        name={"Third"}
        component={user?.role === "Farmer" ? TransactionStack : MapStack}
        options={({ route }) => {
          let routeName = user?.role === "Farmer" ? "Transactions" : "Map";

          return {
            headerTitle: routeName,
            tabBarIcon: ({ color }) => (
              <MCIcon
                name={user?.role === "Farmer" ? "swap-horizontal-circle-outline" : "map-marker"}
                size={24}
                color={color}
              />
            ),
            tabBarItemStyle: { paddingVertical: Platform.OS === "android" ? 4 : 0},
            tabBarLabel: routeName,
          };
        }}
      />
      <Tab.Screen
        name={"Fourth"}
        component={user?.role === "Farmer" ? OrderStack : HistoryStack}
        options={({ route }) => {
          let routeName = user?.role === "Farmer" ? "Meetings" : "History";
          
          return {
            tabBarIcon: ({ color }) => (
              <MCIcon
                name={user?.role === "Farmer" ? "calendar-month" : "history"}
                size={24}
                color={color}
              />
            ),
            tabBarItemStyle: { paddingVertical: Platform.OS === "android" ? 4 : 0},
            tabBarLabel: routeName,
          };
        }}
      />
      <Tab.Screen
        name={"Fifth"}
        component={SettingStack}
        options={({ route }) => {          
          return {
            tabBarIcon: ({ color }) => (
              <MCIcon name="cog" size={24} color={color} />
            ),
            tabBarItemStyle: { paddingVertical: Platform.OS === "android" ? 4 : 0},
            tabBarLabel: "Settings",
          };
        }}
      />
      <Tab.Screen
        // name="Instructions"
        name={"Sixth"}
        component={Instructions}
        options={({ route }) => {
          const current = getFocusedRouteNameFromRoute(route) ?? "Instructions";
          
          return {
            tabBarLabel: "Instructions",
            tabBarItemStyle: { display: "none" },
            tabBarStyle: { display: "none" },
          };
        }}
      />
    </Tab.Navigator>
  );
}

export default MainTabs