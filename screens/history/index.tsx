import { collection, documentId, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { TextField, View } from "react-native-ui-lib";
import Ionicon from "react-native-vector-icons/Ionicons";
import HistoryRow from "../../components/account/history-row";
import Loading from "../../components/extra/loading";
import { auth, db } from "../../firebase";

const OrderHistory = () => {
  const [orders, setOrders] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    if (search.length == 0 || orders.length == 0) {
      onSnapshot(query(collection(db, "Orders"), where("consumer.id", "==", auth.currentUser.uid)), async (snapshot) => {
        setOrders(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
      });  
    } else {
      onSnapshot(query(collection(db, "Orders"), where("consumer.id", "==", auth.currentUser.uid), where(documentId(), ">=", search), where(documentId(), "<=", search + "\uf8ff")), async (snapshot) => {
        setOrders(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
      });  
    }
  }, [search]);

  useEffect(() => { 
    if (orders) {
      setLoading(false);
    }
  }, [orders]);

  if (loading) {
    return (
      <Loading />
    )
  }

  // if (orders.length == 0) {
  //   return (
  //     <SafeAreaView style={[global.container, global.bgGray]}>
  //       <Text style={global.subtitle}>No orders have been made yet</Text>
  //     </SafeAreaView>
  //   )
  // }

  return (
    <View useSafeArea flex>
      <View style={styles.search}>
        <TextField fieldStyle={{ backgroundColor: "lightgray", borderRadius: 8, margin: 8, padding: 12 }} value={search} onChangeText={(value) => setSearch(value)} placeholder="Search with Order ID" leadingAccessory={<Ionicon name="search" color={"gray"} size={20} style={{ marginRight: 8 }} />} migrate />
      </View>
      <FlatList 
        data={orders}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <HistoryRow id={item.id} listings={item.listings} farmer={item.farmer} consumer={item.consumer} total={item.total} status={item.status} createdAt={item.createdAt} />
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

export default OrderHistory