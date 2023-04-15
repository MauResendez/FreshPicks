import { FlatList } from "react-native";

import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { LoaderScreen, TextField, View } from "react-native-ui-lib";
import Ionicon from "react-native-vector-icons/Ionicons";
import SearchRow from "../../components/chat/search-row";
import { db } from "../../firebase";

const Orders = () => {
  const [farmers, setFarmers] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  
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
  //       <Text style={global.subtitle}>No farmers have been made yet</Text>
  //     </SafeAreaView>
  //   )
  // }

  return (
    <View useSafeArea flex>
      <View style={styles.search}>
        <TextField fieldStyle={{ backgroundColor: "lightgray", borderRadius: 8, margin: 8, padding: 12 }} value={search} onChangeText={(value) => setSearch(value)} placeholder="Search for Farmers" leadingAccessory={<Ionicon name="search" color={"gray"} size={20} style={{ marginRight: 8 }} />} migrate />
      </View>
      
      <FlatList 
        data={farmers}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <SearchRow farmer={item.id} cover={item.cover} business={item.business} name={item.name} address={item.address} />
        )}
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