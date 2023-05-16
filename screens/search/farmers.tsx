import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { collection, documentId, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { LoaderScreen, TextField, View } from "react-native-ui-lib";
import Ionicon from "react-native-vector-icons/Ionicons";
import FarmerResultRow from "../../components/search/farmer-result-row";
import { auth, db } from "../../firebase";
import { global } from "../../style";

const Farmers = () => {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState("");
  const [farmers, setFarmers] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (search.length == 0 || farmers.length == 0) {
      onSnapshot(query(collection(db, "Users"), where("farmer", "==", true), where(documentId(), "!=", auth.currentUser.uid)), async (snapshot) => {
        setFarmers(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
      });
    } else {
      onSnapshot(query(collection(db, "Users"), where("farmer", "==", true), where(documentId(), "!=", auth.currentUser.uid)), async (snapshot) => {
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
  
  return (
    <View useSafeArea flex style={global.bgWhite}>
      <View style={styles.search}>
        <TextField fieldStyle={{ backgroundColor: "lightgray", borderRadius: 8, margin: 8, padding: 12 }} value={search} onChangeText={(value) => setSearch(value)} placeholder="Search for farmers and produce here" leadingAccessory={<Ionicon name="search" color={"gray"} size={20} style={{ marginRight: 8 }} />} migrate />
      </View>

      <FlashList 
        data={farmers}
        keyExtractor={(item: any) => item.id}
        estimatedItemSize={farmers.length != 0 ? farmers.length : 150}
        renderItem={({item}) => (
          <FarmerResultRow item={item} />
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
    backgroundColor: "white",
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

export default Farmers