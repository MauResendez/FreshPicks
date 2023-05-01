import React, { useEffect, useState } from "react";

import Conversation from "../../screens/chat/conversation";
import Profile from "../../screens/profile";
import Search from "../../screens/search";
import Farmers from "../../screens/search/farmers";
import Products from "../../screens/search/products";

import { useNavigation, useRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { doc, onSnapshot } from "firebase/firestore";
import { Image, View } from "react-native-ui-lib";
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth, db } from "../../firebase";
import Basket from "../../screens/basket";

const Stack = createNativeStackNavigator();

const SearchStack = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  // const parent = navigation.getParent("MainDrawer");
  // const route = useRoute();

  // useLayoutEffect(() => {
  //   const current = getFocusedRouteNameFromRoute(route) ?? "Index";

  //   parent.setOptions({
  //     headerShown: current == "Index" ? true : false
  //   });
  // }, [route]);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState<string>("Index");

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "Users", auth.currentUser.uid), (doc) => {
      setUser(doc.data());
      setLoading(false);
    });

    return unsubscribe
  }, [auth.currentUser.uid]);

  return (
    <Stack.Navigator 
      initialRouteName="Index" 
      screenOptions={{ 
        headerRight: () => (
          <View row>
            {!user?.role && (
              <MCIcon
                name={"cart"}
                size={24}
                color={"#ff4500"}
                style={{ marginHorizontal: -4, marginBottom: -8 }}
                onPress={() => navigation.navigate("Basket")}
              />
            )}
          </View>
        ),
        headerTitle: () => (
          <Image
            style={{ width: 200, height: 50 }}
            source={require("../../assets/logo.png")}
            resizeMode="contain"
          />
        ), 
      }}
    >
      <Stack.Screen name="Index" component={Search} />
      <Stack.Screen name="Farmers" component={Farmers} />
      <Stack.Screen name="Products" component={Products} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Conversation" component={Conversation} />
      <Stack.Screen name="Basket" component={Basket} />
    </Stack.Navigator>
  )
}

export default SearchStack