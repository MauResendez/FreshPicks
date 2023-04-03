import { createDrawerNavigator } from "@react-navigation/drawer";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image } from "react-native";

import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../firebase";

import Cart from "../../screens/cart";
import AccountStack from "../stack/account-stack";

import MainTabs from "../tabs";

import { Colors } from "react-native-ui-lib";
import Ionicon from 'react-native-vector-icons/Ionicons';
import Recipes from "../../screens/recipes";
import ChatStack from "../stack/chat-stack";

const Drawer = createDrawerNavigator();

const MainDrawer = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "Users", auth.currentUser.uid), (doc) => {
      setUser(doc.data());
    });

    return unsubscribe
  }, [auth.currentUser.uid]);
  
  return (
    // <Drawer.Navigator
    //   initialRouteName="Home"
    //   useLegacyImplementation
    //   screenOptions={{
    //     headerTintColor: "#EF4723",
    //     headerRight: () => (
    //       <View style={{ flexDirection: "row" }}>
    //         <Ionicon
    //           name={"notifications"}
    //           size={24}
    //           color={"green"}
    //           style={{ marginHorizontal: 16 }}
    //           onPress={() => navigation.navigate("Notifications")}
    //         />
    //         {!user?.role && (
    //           <Ionicon
    //             name={"cart"}
    //             size={24}
    //             color={"green"}
    //             style={{ marginHorizontal: 16 }}
    //             onPress={() => navigation.navigate("Cart")}
    //           />
    //         )}
    //         {/* <Ionicon name={"settings"} size={24} color={"green"} style={{ marginHorizontal: 16 }} onPress={() => navigation.navigate("Settings")} /> */}
    //       </View>
    //     ),
    //     headerTitle: () => (
    //       <Image
    //         style={{ width: 200, height: 50 }}
    //         source={require("../../assets/logo.png")}
    //         resizeMode="contain"
    //       />
    //     ),
    //     drawerLabelStyle: {
    //       fontSize: 16,
    //     },
    //     headerTitleAlign: "center",
    //   }}
    // >
    //   <Drawer.Screen
    //     name="Home"
    //     component={user?.role ? DashboardStack : SearchStack}
    //     options={({ route }) => {
    //       const current = getFocusedRouteNameFromRoute(route) ?? "Index";

    //       return {
    //         drawerIcon: ({ color }) => (
    //           <Ionicon name="home" size={24} color={color} />
    //         ),
    //         headerShown: current != "Index" ? false : true,
    //         swipeEnabled: current != "Index" ? false : true,
    //         drawerActiveTintColor: "green",
    //       };
    //     }}
    //   />
    //   <Drawer.Screen
    //     name="Chat"
    //     component={ChatStack}
    //     options={({ route }) => {
    //       const current = getFocusedRouteNameFromRoute(route) ?? "Index";

    //       return {
    //         drawerIcon: ({ color }) => (
    //           <Ionicon name="chatbubble-ellipses" size={24} color={color} />
    //         ),
    //         headerShown: current != "Index" ? false : true,
    //         swipeEnabled: current != "Index" ? false : true,
    //         drawerActiveTintColor: "green",
    //       };
    //     }}
    //   />
    //   <Drawer.Screen
    //     name={user?.role ? "Orders" : "Map"}
    //     component={user?.role ? OrderStack : MapStack}
    //     options={({ route }) => {
    //       let routeName = user?.role ? "Orders" : "Map";
    //       const current = getFocusedRouteNameFromRoute(route) ?? "Index";

    //       return {
    //         drawerIcon: ({ color }) => (
    //           <Ionicon
    //             name={user?.role ? "cart" : "location-sharp"}
    //             size={24}
    //             color={color}
    //           />
    //         ),
    //         headerShown: current != "Index" ? false : true,
    //         swipeEnabled: current != "Index" ? false : true,
    //         drawerActiveTintColor: "green",
    //       };
    //     }}
    //   />
    //   <Drawer.Screen
    //     name={user?.role ? "Statistics" : "Feed"}
    //     component={user?.role ? Statistics : FeedStack}
    //     options={({ route }) => {
    //       let routeName = user?.role ? "Statistics" : "Feed";
    //       const current = getFocusedRouteNameFromRoute(route) ?? "Index";

    //       return {
    //         drawerIcon: ({ color }) => (
    //           <Ionicon
    //             name={user?.role ? "stats-chart-sharp" : "search"}
    //             size={24}
    //             color={color}
    //           />
    //         ),
    //         headerShown: current != "Index" ? false : true,
    //         swipeEnabled: current != "Index" ? false : true,
    //         drawerActiveTintColor: "green",
    //       };
    //     }}
    //   />
    //   {/* <Drawer.Screen
    //     name={user?.role ? "Statistics" : "Search"}
    //     component={user?.role ? Statistics : SearchStack}
    //     options={({ route }) => {
    //       let routeName = user?.role ? "Statistics" : "Search";
    //       const current = getFocusedRouteNameFromRoute(route) ?? "Index";

    //       return {
    //         drawerIcon: ({ color }) => (
    //           <Ionicon
    //             name={user?.role ? "stats-chart-sharp" : "search"}
    //             size={24}
    //             color={color}
    //           />
    //         ),
    //         headerShown: current != "Index" ? false : true,
    //         swipeEnabled: current != "Index" ? false : true,
    //         drawerActiveTintColor: "green",
    //       };
    //     }}
    //   /> */}
    //   <Drawer.Screen
    //     name="Account"
    //     component={AccountStack}
    //     options={({ route }) => {
    //       const current = getFocusedRouteNameFromRoute(route) ?? "Account";

    //       return {
    //         drawerIcon: ({ color }) => (
    //           <Ionicon name="person" size={24} color={color} />
    //         ),
    //         headerShown: current != "Account" ? false : true,
    //         swipeEnabled: current != "Account" ? false : true,
    //         drawerActiveTintColor: "green",
    //       };
    //     }}
    //   />
    //   <Drawer.Screen
    //     name="Cart"
    //     component={Cart}
    //     options={({ route }) => {
    //       const current = getFocusedRouteNameFromRoute(route) ?? "Cart";

    //       return {
    //         headerShown: current != "Cart" ? false : true,
    //         swipeEnabled: current != "Cart" ? false : true,
    //         drawerItemStyle: { display: "none" },
    //       };
    //     }}
    //   />
    //   <Drawer.Screen
    //     name="Notifications"
    //     component={AccountStack}
    //     options={({ route }) => {
    //       const current = getFocusedRouteNameFromRoute(route) ?? "Index";

    //       return {
    //         headerShown: current != "Index" ? false : true,
    //         swipeEnabled: current != "Index" ? false : true,
    //         drawerItemStyle: { display: "none" },
    //       };
    //     }}
    //   />
    // </Drawer.Navigator>

    <Drawer.Navigator
      id="MainDrawer"
      initialRouteName="Main"
      // useLegacyImplementation
      // drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={({ navigation, route }) => ({ 
        drawerStyle: { backgroundColor: "#32CD32" },
        drawerLabelStyle: {
          color: "white",
          fontSize: 16,
        },
        // headerShown: !isFocused,
        // headerStyle: { backgroundColor: "#32CD32" },
        // headerTintColor: "#EF4723",
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
        name="Main"
        component={MainTabs}
        // options={({ route }) => {
        //   const current = getFocusedRouteNameFromRoute(route) ?? "Index";

        //   return {
        //     drawerIcon: ({ color }) => (
        //       <Ionicon name="home" size={24} color={color} />
        //     ),
        //     headerShown: current != "Index" ? false : true,
        //     swipeEnabled: current != "Index" ? false : true,
        //     drawerActiveTintColor: "green",
        //   };
        // }}
        options={({ route }) => {
          // const current = getFocusedRouteNameFromRoute(route) ?? "Index";

          return {
            drawerIcon: ({ color }) => (
              <Ionicon name="home" size={24} color={"white"} />
            ),
            // headerShown: current != "Index" ? false : true,
            // swipeEnabled: current != "Index" ? false : true,
            // drawerActiveTintColor: "green",
          };
        }}
      />
      <Drawer.Screen
        name="Cart"
        component={Cart}
        // options={({ route }) => {
        //   const current = getFocusedRouteNameFromRoute(route) ?? "Cart";

        //   return {
        //     headerShown: current != "Cart" ? false : true,
        //     swipeEnabled: current != "Cart" ? false : true,
        //     drawerItemStyle: { display: "none" },
        //   };
        // }}
        options={({ route }) => {
          // const current = getFocusedRouteNameFromRoute(route) ?? "Index";

          return {
            drawerIcon: ({ color }) => (
              <Ionicon name="cart" size={24} color={"white"} />
            ),
            br: "bottom"
            // headerShown: current != "Index" ? false : true,
            // swipeEnabled: current != "Index" ? false : true,
            // drawerActiveTintColor: "green",
          };
        }}
      />
      <Drawer.Screen
        name="Chat"
        component={ChatStack}
        // options={({ route }) => {
        //   const current = getFocusedRouteNameFromRoute(route) ?? "Cart";

        //   return {
        //     headerShown: current != "Cart" ? false : true,
        //     swipeEnabled: current != "Cart" ? false : true,
        //     drawerItemStyle: { display: "none" },
        //   };
        // }}
        options={({ route }) => {
          // const current = getFocusedRouteNameFromRoute(route) ?? "Index";

          return {
            drawerIcon: ({ color }) => (
              <Ionicon name="chat" size={24} color={"white"} />
            ),
            // headerShown: current != "Index" ? false : true,
            // swipeEnabled: current != "Index" ? false : true,
            // drawerActiveTintColor: "green",
          };
        }}
      />
      <Drawer.Screen
        name="Notifications"
        component={AccountStack}
        // options={({ route }) => {
        //   const current = getFocusedRouteNameFromRoute(route) ?? "Index";

        //   return {
        //     headerShown: current != "Index" ? false : true,
        //     swipeEnabled: current != "Index" ? false : true,
        //     drawerItemStyle: { display: "none" },
        //   };
        // }}
        options={({ route }) => {
          // const current = getFocusedRouteNameFromRoute(route) ?? "Index";

          return {
            drawerIcon: ({ color }) => (
              <Ionicon name="notifications" size={24} color={"white"} />
            ),
            // headerShown: current != "Index" ? false : true,
            // swipeEnabled: current != "Index" ? false : true,
            // drawerActiveTintColor: "green",
          };
        }}
      />
      <Drawer.Screen
        name="Recipes"
        component={Recipes}
        options={() => {

          return {
            drawerIcon: ({ color }) => (
              <Ionicon name="reader" size={24} color={"white"} />
            ),

            // headerShown: current != "Index" ? false : true,
            // swipeEnabled: current != "Index" ? false : true,
            // drawerActiveTintColor: "green",
          };
        }}
      />
      <Drawer.Screen
        name="About Us"
        component={Recipes}
        options={() => {

          return {
            drawerIcon: ({ color }) => (
              <Ionicon name="information-circle" size={24} color={"white"} />
            ),

            // headerShown: current != "Index" ? false : true,
            // swipeEnabled: current != "Index" ? false : true,
            // drawerActiveTintColor: "green",
          };
        }}
      />
      <Drawer.Screen
        name="Report an Issue"
        component={AccountStack}
        // options={({ route }) => {
        //   const current = getFocusedRouteNameFromRoute(route) ?? "Index";

        //   return {
        //     headerShown: current != "Index" ? false : true,
        //     swipeEnabled: current != "Index" ? false : true,
        //     drawerItemStyle: { display: "none" },
        //   };
        // }}
        options={({ route }) => {
          // const current = getFocusedRouteNameFromRoute(route) ?? "Index";

          return {
            drawerIcon: ({ color }) => (
              <Ionicon name="bug" size={24} color={"white"} />
            ),
            // headerShown: current != "Index" ? false : true,
            // swipeEnabled: current != "Index" ? false : true,
            // drawerActiveTintColor: "green",
          };
        }}
      />
    </Drawer.Navigator>
  );
}

export default MainDrawer