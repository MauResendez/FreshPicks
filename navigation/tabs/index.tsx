import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";

import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";

import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../firebase";

import { Colors } from "react-native-ui-lib";
import Cart from "../../screens/cart";
import OrderHistory from "../../screens/history";
import Instructions from "../../screens/instructions";
import Transactions from "../../screens/transactions";
import AccountStack from "../stack/account-stack";
import DashboardStack from "../stack/dashboard-stack";
import FeedStack from "../stack/feed-stack";
import MapStack from "../stack/map-stack";
import OrderStack from "../stack/order-stack";
import ProductStack from "../stack/product-stack";
import SearchStack from "../stack/search-stack";

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const navigation = useNavigation<any>();
  const parent = navigation.getParent("MainDrawer");
  const [user, setUser] = useState<any>(null);
  const [currentRoute, setCurrentRoute] = useState<any>(null);

  // useEffect(() => {
  //   parent.setOptions({
  //     headerShown: false
  //   })
  // }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "Users", auth.currentUser.uid), (doc) => {
      setUser(doc.data());
    });

    return unsubscribe
  }, [auth.currentUser.uid]);

  useEffect(() => {
    if (currentRoute == "Index") {
      parent.setOptions({
        headerShown: true
      });
    } else {
      parent.setOptions({
        headerShown: false
      });
    }
  }, [currentRoute]);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        // headerLeft: () => (
        //   <View style={{ flexDirection: "row" }}>
        //     <MCIcon
        //       name={"notifications"}
        //       size={24}
        //       color={"green"}
        //       style={{ marginHorizontal: 16 }}
        //       onPress={() => navigation.navigate("Notifications")}
        //     />
        //   </View>
        // ),
        // headerRight: () => (
        //   <View style={{ flexDirection: "row" }}>
        //     {!user?.role && (
        //       <MCIcon
        //         name={"cart"}
        //         size={24}
        //         color={"green"}
        //         style={{ marginHorizontal: 12 }}
        //         onPress={() => navigation.navigate("Cart")}
        //       />
        //     )}
        //   </View>
        // ),
        // headerTitle: () => (
        //   <Image
        //     style={{ width: 160, height: 40 }}
        //     source={require("../../assets/logo.png")}
        //     resizeMode="contain"
        //   />
        // ),
        // headerTitleAlign: "center",
        tabBarActiveBackgroundColor: Colors.white,
        tabBarActiveTintColor: Colors.black,
        // tabBarInactiveBackgroundColor: "#32CD32",
        tabBarInactiveTintColor: Colors.grey40,
        // tabBarStyle: {
        //   backgroundColor: '#32CD32'
        // }
      }}
    >
      <Tab.Screen
        name="Home"
        component={user?.role ? DashboardStack : SearchStack}
        options={({ route }) => {
          const current = getFocusedRouteNameFromRoute(route) ?? "Index";

          setCurrentRoute(current);

          return {
            tabBarIcon: ({ color }) => (
              <MCIcon name="home" size={24} color={color} />
            ),
            tabBarLabel: "Home",
            tabBarStyle: { display: current != "Index" ? "none" : "flex" },
            // headerShown: current != "Index" ? false : false,
            swipeEnabled: current != "Index" ? false : true,
          };
        }}
      />
      {/* <Tab.Screen
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
            // headerShown: current != "Index" ? false : true,
            swipeEnabled: current != "Index" ? false : true,
          };
        }}
      /> */}
      <Tab.Screen
        name={user?.role ? "Products" : "Feed"}
        component={user?.role ? ProductStack : FeedStack}
        options={({ route }) => {
          let routeName = user?.role ? "Products" : "Feed";
          const current = getFocusedRouteNameFromRoute(route) ?? "Index";

          setCurrentRoute(current);

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
            {/* <Tab.Screen
        name={user?.role ? "Inventory" : "Feed"}
        component={user?.role ? Inventory : FeedStack}
        options={({ route }) => {
          let routeName = user?.role ? "Inventory" : "Feed";
          const current = getFocusedRouteNameFromRoute(route) ?? "Index";

          return {
            tabBarIcon: ({ color }) => (
              <MCIcon
                name={user?.role ? "clipboard" : "analytics"}
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
      /> */}
      <Tab.Screen
        name={user?.role ? "Transactions" : "Map"}
        component={user?.role ? Transactions : MapStack}
        options={({ route }) => {
          let routeName = user?.role ? "Transactions" : "Map";
          const current = getFocusedRouteNameFromRoute(route) ?? "Index";

          setCurrentRoute(current);

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
        name={user?.role ? "Orders" : "History"}
        component={user?.role ? OrderStack : OrderHistory}
        options={({ route }) => {
          let routeName = user?.role ? "Orders" : "History";
          const current = getFocusedRouteNameFromRoute(route) ?? "Index";

          setCurrentRoute(current);

          return {
            tabBarIcon: ({ color }) => (
              <MCIcon
                name={user?.role ? "basket" : "history"}
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
        name="Account"
        component={AccountStack}
        options={({ route }) => {
          const current = getFocusedRouteNameFromRoute(route) ?? "Index";

          setCurrentRoute(current);

          return {
            tabBarIcon: ({ color }) => (
              <MCIcon name="account" size={24} color={color} />
            ),
            tabBarLabel: "Account",
            tabBarStyle: { display: current != "Index" ? "none" : "flex" },
            // headerShown: current != "Index" ? false : true,
            swipeEnabled: current != "Index" ? false : true,
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
            // headerShown: current != "Cart" ? false : true,
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
              <MCIcon name="account" size={24} color={color} />
            ),
            tabBarLabel: "Index",
            tabBarItemStyle: { display: "none" },
            // headerShown: current != "Index" ? false : true,
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
            // headerShown: current != "Instructions" ? false : true,
            swipeEnabled: current != "Instructions" ? false : true,
          };
        }}
      />
    </Tab.Navigator>
  );
}

export default MainTabs