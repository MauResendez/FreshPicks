import { useNavigation } from "@react-navigation/native";
import { collection, documentId, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, useWindowDimensions } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { Text, TextField, View } from "react-native-ui-lib";
import Ionicon from "react-native-vector-icons/Ionicons";
import Loading from "../../components/extra/loading";
import FarmerSearchRow from "../../components/search/farmer-search-row";
import { auth, db } from "../../firebase";
import { global } from "../../style";

const Farmers = () => {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState("");
  const [farmers, setFarmers] = useState(null);
  const [rated, setRated] = useState(null);
  const [ascending, setAscending] = useState(null);
  const [descending, setDescending] = useState(null);
  const [visible, setVisible] = useState(false);
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = useState([
    { key: "first", title: "All Farmers" },
    { key: "second", title: "Highest Rated" },
    { key: "third", title: "A-Z" },
    { key: "fourth", title: "Z-A" }
  ]);
  const [loading, setLoading] = useState(true);

  const FirstRoute = () => (
    <View useSafeArea flex>
      <FlatList 
        data={farmers}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <FarmerSearchRow farmer={item.id} business={item.business} address={item.address} cover={item.cover} />
        )}
      />
    </View>
  );

  const SecondRoute = () => (
    <View useSafeArea flex>
      <FlatList 
        data={rated}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <FarmerSearchRow farmer={item.id} business={item.business} address={item.address} cover={item.cover} />
        )}
      />
    </View>
  );

  const ThirdRoute = () => (
    <View useSafeArea flex>
      <FlatList 
        data={ascending}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <FarmerSearchRow farmer={item.id} business={item.business} address={item.address} cover={item.cover} />
        )}
      />
    </View>
  );

  const FourthRoute = () => (
    <View useSafeArea flex>
      <FlatList 
        data={descending}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <FarmerSearchRow farmer={item.id} business={item.business} address={item.address} cover={item.cover} />
        )}
      />
    </View>
  );

  const renderLabel = ({ route, focused, color }) => {
    return (
      <View>
        <Text style={[focused ? styles.activeTabTextColor : styles.tabTextColor]}>
          {route.title}
        </Text>
      </View>
    )
  }

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
    fourth: FourthRoute,
  });

  const toggleDialog = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (search.length == 0 || farmers.length == 0) {
      onSnapshot(query(collection(db, "Users"), where("farmer", "==", true), where(documentId(), "!=", auth.currentUser.uid)), async (snapshot) => {
        setFarmers(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
      });

      // onSnapshot(query(collection(db, "Users"), where("farmer", "==", true), orderBy("rating", "asc")), async (snapshot) => {
      //   setRated(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
      // });

      // onSnapshot(query(collection(db, "Users"), where("farmer", "==", true), orderBy("business", "asc")), async (snapshot) => {
      //   setAscending(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
      // });

      // onSnapshot(query(collection(db, "Users"), where("farmer", "==", true), orderBy("business", "desc")), async (snapshot) => {
      //   setDescending(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
      // });
    } else {
      // onSnapshot(query(collection(db, "Users"), where("farmer", "==", true), where("business", ">=", search), where("business", "<=", search + "\uf8ff")), async (snapshot) => {
      //   setFarmers(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})).filter(doc => doc.id != auth.currentUser.uid));
      // });

      onSnapshot(query(collection(db, "Users"), where("farmer", "==", true), where(documentId(), "!=", auth.currentUser.uid)), async (snapshot) => {
        setFarmers(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
      });
    }
  }, [search]);

  useEffect(() => {
    if (farmers) {
      setLoading(false);
    }
  }, [farmers, rated, ascending, descending]);

  if (loading) {
    return (
      <Loading />
    )
  }
  
  return (
    <View useSafeArea flex style={global.bgWhite}>
      <View style={styles.search}>
        <TextField fieldStyle={{ backgroundColor: "lightgray", borderRadius: 8, margin: 8, padding: 12 }} value={search} onChangeText={(value) => setSearch(value)} placeholder="Search for farmers and produce here" leadingAccessory={<Ionicon name="search" color={"gray"} size={20} style={{ marginRight: 8 }} />} migrate />
      </View>

      <TabView
        style={global.bgWhite}
        navigationState={{ index, routes }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "black" }}
            style={{ backgroundColor: "white", height: 55 }}
            renderLabel={renderLabel}
          />
        )}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
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