import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";

import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";

import { doc, onSnapshot } from "firebase/firestore";
import { Image } from "react-native";
import { auth, db } from "../../firebase";

import { Colors, LoaderScreen } from "react-native-ui-lib";
import DashboardStack from "../stack/dashboard-stack";
import FeedStack from "../stack/feed-stack";
import HistoryStack from "../stack/history-stack";
import InstructionStack from "../stack/instruction-stack";
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
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        headerTintColor: Colors.black,
        headerTitle: () => (
          <Image
            style={{ width: 200, height: 50 }}
            source={require("../../assets/logo.png")}
            resizeMode="contain"
          />
        ),
        tabBarActiveBackgroundColor: Colors.white,
        tabBarActiveTintColor: "#32CD32",
        tabBarInactiveTintColor: Colors.grey40,
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
                name={user?.role ? "view-dashboard" : "home"}
                size={24} 
                color={color} 
              />
            ),
            tabBarLabel: routeName,
            tabBarStyle: { display: current != "Index" ? "none" : "flex" },
            // headerShown: current != "Index" ? false : false,
            swipeEnabled: current != "Index" ? false : true,
          };
        }}
      />
      <Tab.Screen
        name={user?.role ? "Products" : "Feed"}
        component={user?.role ? ProductStack : FeedStack}
        options={({ route }) => {
          let routeName = user?.role ? "Products" : "Feed";
          const current = getFocusedRouteNameFromRoute(route) ?? "Index";
          
          return {
            tabBarIcon: ({ color }) => (
              <MCIcon
                name={user?.role ? "food-apple" : "timeline"}
                size={24}
                color={color}
              />
            ),
            tabBarLabel: routeName,
            tabBarStyle: { display: current != "Index" ? "none" : "flex" },
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
            tabBarLabel: routeName,
            tabBarStyle: { display: current != "Index" ? "none" : "flex" },
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
            tabBarLabel: routeName,
            tabBarStyle: { display: current != "Index" ? "none" : "flex" },
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
            tabBarLabel: "Settings",
            tabBarStyle: { display: current != "Index" ? "none" : "flex" },
            // headerShown: current != "Index" ? false : true,
            swipeEnabled: current != "Index" ? false : true,
          };
        }}
      />
      <Tab.Screen
        name="Instructions"
        component={InstructionStack}
        options={({ route }) => {
          const current = getFocusedRouteNameFromRoute(route) ?? "Index";
          
          return {
            tabBarLabel: "Instructions",
            tabBarItemStyle: { display: "none" },
            // headerShown: current != "Instructions" ? false : true,
            swipeEnabled: current != "Index" ? false : true,
          };
        }}
      />
    </Tab.Navigator>
  );
}

export default MainTabs