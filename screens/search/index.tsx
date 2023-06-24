import * as Location from "expo-location";
import * as SplashScreen from 'expo-splash-screen';
import { collection, documentId, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Platform
} from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";

import { Colors, KeyboardAwareScrollView, LoaderScreen, TextField, View } from "react-native-ui-lib";
import ProductList from "../../components/search/product-list";
import SubscriptionList from "../../components/search/subscription-list";
import VendorList from "../../components/search/vendor-list";
import { auth, db } from "../../firebase";
import { global } from "../../style";

// Keep the splash screen visible while we fetch resources
// SplashScreen.preventAutoHideAsync();

const Search = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState(null);
  const [products, setProducts] = useState(null);
  const [subscriptions, setSubscriptions] = useState(null);
  const [fp, setFP] = useState(null);
  const [ff, setFF] = useState(null);
  const [fs, setFS] = useState(null);
  const [location, setLocation] = useState(null);

  const getLocation = async () => {
    let {status} = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      return;
    }

    let location = await Location.getCurrentPositionAsync();

    setLocation(location);
  }

  const shuffle = (array) => {
    let currentIndex = array.length;
    let randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

  useEffect(() => {
    getLocation();

    const subscriber = onSnapshot(query(collection(db, "Users"), where("vendor", "==", true), where(documentId(), "!=", auth.currentUser.uid)), async (snapshot) => {
      setVendors(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    })

    const subscriber2 = onSnapshot(query(collection(db, "Products"), where("user", "!=", auth.currentUser.uid)), async (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    });

    const subscriber3 = onSnapshot(query(collection(db, "Subscriptions"), where("user", "!=", auth.currentUser.uid)), async (snapshot) => {
      setSubscriptions(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    });

    // Unsubscribe from events when no longer in use
    return () => {
      subscriber();
      subscriber2();
      subscriber3();
    } 
  }, []);

  useEffect(() => {
    try {
      if (!vendors || !products || !subscriptions) {
        return;
      }

      console.log(subscriptions);

      if (search.length == 0) {
        const ff = shuffle(vendors);
        const fp = shuffle(products);
        const fs = shuffle(subscriptions);

        setFF(ff);
        setFP(fp);
        setFS(fs);
      } else {
        const fr = vendors.filter(result => {
          return (result.business.toLowerCase().indexOf(search.toLowerCase()) !== -1 || result.address.toLowerCase().indexOf(search.toLowerCase()) !== -1);
        });
    
        const pr = products.filter(result => {
          return result.title.toLowerCase().indexOf(search.toLowerCase()) !== -1;
        });

        const sr = subscriptions.filter(result => {
          return result.title.toLowerCase().indexOf(search.toLowerCase()) !== -1;
        });
  
        const ff = shuffle(fr);
        const fp = shuffle(pr);
        const fs = shuffle(sr);
    
        setFF(ff);
        setFP(fp);
        setFS(fs);
      }  
    } catch (error) {
      alert(error.message);
      console.log(error);
    }
  }, [vendors, products, subscriptions, search]);

  useEffect(() => {
    if (ff && fp && fs && location) {
      setLoading(false);
      console.log("3");
      SplashScreen.hideAsync();
    }
  }, [ff, fp, fs, location]);

  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }

  return (
    <View useSafeArea flex style={global.white}>
      <View padding-8>
        <TextField fieldStyle={{ backgroundColor: Colors.grey60, borderRadius: 8, margin: 8, padding: 12 }} value={search} onChangeText={(value) => setSearch(value)} placeholder="Vendors, produce, subscriptions, etc." placeholderTextColor={Colors.grey30} leadingAccessory={<Ionicon name="search" color={Colors.grey30} size={20} style={{ marginRight: 8 }} />} migrate />
      </View>

      <KeyboardAwareScrollView contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={Platform.OS == "web"}>
        <VendorList title={"Vendors"} description={"Available Vendors"} vendors={ff} />
        <ProductList title={"Products"} description={"Available Products"} products={fp} />
        <SubscriptionList title={"Subscriptions"} description={"Available Subscriptions"} subscriptions={fs} />
      </KeyboardAwareScrollView>
    </View>
  )
}

export default Search