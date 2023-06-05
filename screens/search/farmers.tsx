import { FlashList } from "@shopify/flash-list";
import { collection, documentId, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Colors, LoaderScreen, TextField, View } from "react-native-ui-lib";
import Ionicon from "react-native-vector-icons/Ionicons";
import FarmerResultRow from "../../components/search/farmer-result-row";
import { auth, db } from "../../firebase";
import { global } from "../../style";

const Farmers = () => {
  const [search, setSearch] = useState("");
  const [farmers, setFarmers] = useState(null);
  const [ff, setFF] = useState(null);
  const [loading, setLoading] = useState(true);

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
    const subscriber = onSnapshot(query(collection(db, "Users"), where("farmer", "==", true), where(documentId(), "!=", auth.currentUser.uid)), async (snapshot) => {
      setFarmers(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    })

    // Unsubscribe from events when no longer in use
    return () => {
      subscriber();
    } 
  }, []);

  useEffect(() => {
    try {
      if (!farmers) {
        return;
      }

      if (search.length == 0) {
        const ff = shuffle(farmers);

        setFF(ff);
      } else {
        const fr = farmers.filter(result => {
          return (result.business.toLowerCase().indexOf(search.toLowerCase()) !== -1 || result.address.toLowerCase().indexOf(search.toLowerCase()) !== -1);
        });
  
        const ff = shuffle(fr);
    
        setFF(ff);
      }  
    } catch (error) {
      console.log(error);
    }
  }, [farmers, search]);

  useEffect(() => {
    if (ff) {
      setLoading(false);
    }
  }, [ff]);

  if (loading) {
    return (
      <LoaderScreen color={"#32CD32"} />
    )
  }
  
  return (
    <View useSafeArea flex style={global.bgWhite}>
      <View style={styles.search}>
        <TextField fieldStyle={{ backgroundColor: Colors.grey60, borderRadius: 8, margin: 8, padding: 12 }} value={search} onChangeText={(value) => setSearch(value)} placeholder="Search for farmers here" placeholderTextColor={Colors.grey30} leadingAccessory={<Ionicon name="search" color={"gray"} size={20} style={{ marginRight: 8 }} />} migrate />
      </View>

      <FlashList 
        data={ff}
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