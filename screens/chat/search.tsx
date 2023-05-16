import { FlashList } from "@shopify/flash-list";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { LoaderScreen, TextField, View } from "react-native-ui-lib";
import Ionicon from "react-native-vector-icons/Ionicons";
import SearchRow from "../../components/chat/search-row";
import { db } from "../../firebase";

const Orders = () => {
  const [farmers, setFarmers] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const renderItem = useCallback(({item}) => {
    return (
      <SearchRow item={item} />
    );
  }, []);
  
  useEffect(() => { 
    if (search.length == 0 || farmers.length == 0) {
      onSnapshot(query(collection(db, "Users"), where("farmer", "==", true)), async (snapshot) => {
        setFarmers(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
      });  
    } else {
      onSnapshot(query(collection(db, "Users"), where("farmer", "==", true), where("business", ">=", search), where("business", "<=", search + "\uf8ff")), async (snapshot) => {
        setFarmers(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
      });  
    }
  }, [search]);

  useEffect(() => { 
    if (farmers) {
      setLoading(false);
    }
  }, [farmers]);

  if (loading) {
    return (
      <LoaderScreen color={"#32CD32"} />
    )
  }

  // if (farmers.length == 0) {
  //   return (
  //     <SafeAreaView style={[global.container, global.bgGray]}>
  //       <Text subtitle>No farmers have been made yet</Text>
  //     </SafeAreaView>
  //   )
  // }

  return (
    <View useSafeArea flex>
      <View style={styles.search}>
        <TextField fieldStyle={{ backgroundColor: "lightgray", borderRadius: 8, margin: 8, padding: 12 }} value={search} onChangeText={(value) => setSearch(value)} placeholder="Search for Farmers" leadingAccessory={<Ionicon name="search" color={"gray"} size={20} style={{ marginRight: 8 }} />} migrate />
      </View>
      
      <FlashList 
        data={farmers}
        keyExtractor={(item: any) => item.id}
        estimatedItemSize={farmers.length != 0 ? farmers.length : 150}
        renderItem={renderItem}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  search: {
    padding: 6,
    backgroundColor: "white"
  }
});

export default Orders