import { NavigationContainer } from "@react-navigation/native";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Colors, LoaderScreen } from "react-native-ui-lib";
import { auth, db } from "../../firebase";
import AdminTabs from "../tabs/admin-tabs";
import ConsumerTabs from "../tabs/consumer-tabs";
import FarmerTabs from "../tabs/farmer-tabs";

const MainStack = () => {  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   // Check if the user is logging in for the first time
  //   const isFirstLogin = auth.currentUser.metadata.creationTime === auth.currentUser.metadata.lastSignInTime;

  //   if (isFirstLogin) {
  //     // User is logging in for the first time
  //     console.log('First login');
  //     navigation.navigate("Sixth");
  //   } else {
  //     // User has logged in before
  //     console.log('Returning user');
  //   }
  // }, []);

  useEffect(() => {
    const subscriber = onSnapshot(doc(db, "Users", auth.currentUser.uid), (doc) => {
      setUser(doc.data());
      setLoading(false);
      console.log("2");
    });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    );
  }
  
  return (
    <NavigationContainer>
      {/* {Platform.OS !== "web" ? <MainTabs /> : <MainDrawer />} */}
      {(user.admin && user.role === "Admin") && <AdminTabs />}
      {user.role === "Consumer" && <ConsumerTabs />}
      {user.role === "Farmer" && <FarmerTabs />}
    </NavigationContainer>
  )
}

export default MainStack