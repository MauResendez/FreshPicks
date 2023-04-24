import { FlashList } from "@shopify/flash-list";
import { collection, documentId, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { LoaderScreen, TextField, View } from "react-native-ui-lib";
import Ionicon from "react-native-vector-icons/Ionicons";
import ListingSearchRow from "../../components/search/product-search-row";
import { auth, db } from "../../firebase";
import { global } from "../../style";

const Products = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (search.length == 0 || products.length == 0) {
      onSnapshot(query(collection(db, "Products"), where(documentId(), "!=", auth.currentUser.uid)), async (snapshot) => {
        setProducts(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
      });
    } else {
      onSnapshot(query(collection(db, "Products"), where("title", ">=", search), where("title", "<=", search + "\uf8ff")), async (snapshot) => {
        setProducts(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})).filter(doc => doc.id != auth.currentUser.uid));
      });
    }
  }, [search]);

  useEffect(() => {
    if (products) {
      setLoading(false);
    }
  }, [products]);

  if (loading) {
    return (
      <LoaderScreen color={"#32CD32"} />
    )
  }
  
  return (
    <View useSafeArea flex style={global.bgWhite}>
      <View style={styles.search}>
        <TextField fieldStyle={{ backgroundColor: "lightgray", borderRadius: 8, margin: 8, padding: 12 }} value={search} onChangeText={(value) => setSearch(value)} placeholder="Search for farmers and produce here" leadingAccessory={<Ionicon name="search" color={"gray"} size={20} style={{ marginRight: 8 }} />} migrate />
      </View>

      <FlashList 
        data={products}
        keyExtractor={(item: any) => item.id}
        estimatedItemSize={products.length}
        renderItem={({item}) => (
          <ListingSearchRow farmer={item.farmer} title={item.title} description={item.description} price={item.price.toFixed(2)} quantity={item.quantity} cover={item.cover} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
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
  search: {
    padding: 6,
    backgroundColor: "white"
  }, 
  body: {
    backgroundColor: "#F3F4F6"
  },
  activeTabTextColor: {
    color: "#eeaf3b"
  },
  tabTextColor: {
    color: "black"
  }
});

export default Products