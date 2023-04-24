import { createDrawerNavigator } from "@react-navigation/drawer";
import React, { useEffect, useState } from "react";
import { Image } from "react-native";

import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../firebase";

import Cart from "../../screens/cart";


import { Colors, LoaderScreen } from "react-native-ui-lib";
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import DashboardStack from "../stack/dashboard-stack";
import FeedStack from "../stack/feed-stack";
import HistoryStack from "../stack/history-stack";
import MapStack from "../stack/map-stack";
import MeetingStack from "../stack/meeting-stack";
import ProductStack from "../stack/product-stack";
import SearchStack from "../stack/search-stack";
import SettingStack from "../stack/setting-stack";
import TransactionStack from "../stack/transaction-stack";

const Drawer = createDrawerNavigator();

const MainDrawer = () => {
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
    <Drawer.Navigator
      initialRouteName={user?.role ? "Dashboard" : "Home"}
      // useLegacyImplementation
      // drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={({ navigation, route }) => ({ 
        drawerLabelStyle: {
          color: Colors.white,
          fontSize: 16,
        },
        
        drawerStyle: {
          backgroundColor: "#32CD32",
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
        name={user?.role ? "Dashboard" : "Home"}
        component={user?.role ? DashboardStack : SearchStack}
        options={({ route }) => {
          let routeName = user?.role ? "Dashboard" : "Home";
          // const current = getFocusedRouteNameFromRoute(route) ?? "Index";

          return {
            drawerIcon: ({ color }) => (
              <MCIcon 
                name={user?.role ? "view-dashboard" : "home"}
                size={24} 
                color={Colors.white} 
              />
            ),
            drawerLabel: routeName
          };
        }}
      />
      <Drawer.Screen
        name={user?.role ? "Products" : "Feed"}
        component={user?.role ? ProductStack : FeedStack}
        options={({ route }) => {
          let routeName = user?.role ? "Products" : "Feed";
          // const current = getFocusedRouteNameFromRoute(route) ?? "Index";

          return {
            drawerIcon: ({ color }) => (
              <MCIcon
                name={user?.role ? "food-apple" : "timeline"}
                size={24}
                color={Colors.white}
              />
            ),
            drawerLabel: routeName
          };
        }}
      />
      <Drawer.Screen
        name={user?.role ? "Transactions" : "Map"}
        component={user?.role ? TransactionStack : MapStack}
        options={({ route }) => {
          let routeName = user?.role ? "Transactions" : "Map";
          // const current = getFocusedRouteNameFromRoute(route) ?? "Index";

          return {
            drawerIcon: ({ color }) => (
              <MCIcon 
                name={user?.role ? "swap-horizontal-circle-outline" : "map-marker"}
                size={24} 
                color={Colors.white} 
              />
            ),
            drawerLabel: routeName
          };
        }}
      />
      <Drawer.Screen
        name={user?.role ? "Meetings" : "History"}
        component={user?.role ? MeetingStack : HistoryStack}
        options={({ route }) => {
          let routeName = user?.role ? "Meetings" : "History";
          // const current = getFocusedRouteNameFromRoute(route) ?? "Index";

          return {
            drawerIcon: ({ color }) => (
              <MCIcon 
                name={user?.role ? "clock-time-four-outline" : "history"}
                size={24} 
                color={Colors.white} 
              />
            ),
            drawerLabel: routeName
          };
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingStack}
        options={({ route }) => {
          // const current = getFocusedRouteNameFromRoute(route) ?? "Index";

          return {
            drawerIcon: ({ color }) => (
              <MCIcon 
                name={user?.role ? "view-dashboard" : "home"}
                size={24} 
                color={Colors.white} 
              />
            ),
            drawerLabel: "Settings"
          };
        }}
      />
      <Drawer.Screen
        name="Cart"
        component={Cart}
        options={({ route }) => {
          return {
            drawerIcon: ({ color }) => (
              <MCIcon name="cart" size={24} color={Colors.white} />
            ),
          };
        }}
      />
    </Drawer.Navigator>
  );
}

export default MainDrawer