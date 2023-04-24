import { collection, documentId, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";

import { Colors, LoaderScreen, TextField, View } from "react-native-ui-lib";
import FarmerList from "../../components/search/farmer-list";
import ProductList from "../../components/search/product-list";
import { auth, db } from "../../firebase";
import { global } from "../../style";

const Search = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [farmers, setFarmers] = useState(null);
  const [products, setProducts] = useState(null);

  useEffect(() => {
    try {
      if (search.length == 0) {
        onSnapshot(query(collection(db, "Users"), where("farmer", "==", true), where(documentId(), "!=", auth.currentUser.uid)), async (snapshot) => {
          setFarmers(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
        })
  
        onSnapshot(query(collection(db, "Products"), where("user", "!=", auth.currentUser.uid)), async (snapshot) => {
          setProducts(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
        });
  
        return
      }
  
      const filtered_farmers = farmers.filter(result => {
        return result.business.toLowerCase().indexOf(search.toLowerCase()) !== -1;
      });
  
      const filtered_listings = products.filter(result => {
        return result.title.toLowerCase().indexOf(search.toLowerCase()) !== -1;
      });
  
      setFarmers(filtered_farmers);
      setProducts(filtered_listings);
    } catch (error) {
      console.log(error);
    }
  }, [search]);

  useEffect(() => {
    if (farmers && products) {
      setLoading(false);
    }
  }, [farmers, products]);

  if (loading) {
    return (
      <LoaderScreen color={"#32CD32"} />
    )
  }

  return (
    <View useSafeArea flex style={global.bgWhite}>
      <View style={styles.search}>
        <TextField fieldStyle={{ backgroundColor: Colors.grey50, borderRadius: 8, margin: 8, padding: 12 }} value={search} onChangeText={(value) => setSearch(value)} placeholder="Search for farmers and produce here..." placeholderTextColor={Colors.black} leadingAccessory={<Ionicon name="search" color={Colors.black} size={20} style={{ marginRight: 8 }} />} migrate />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={Platform.OS == "web"}
      >
        <FarmerList title={"Farmers"} description={"Available Farmers"} farmers={farmers} />
        <ProductList title={"Products"} description={"Available Products"} products={products} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingVertical: 8
  },
  header: {
    paddingBottom: 12, 
    marginHorizontal: 16, 
    flexDirection: "row", 
    alignItems: "center" 
  },
  flex: {
    flex: 1
  },
  greeting: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "700",
    paddingTop: 8 
  },
  search: {
    padding: 6,
  }, 
});

export default Search