import { useNavigation } from "@react-navigation/native";
import { collection, documentId, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, useWindowDimensions } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { LoaderScreen, TextField, View } from "react-native-ui-lib";
import Ionicon from "react-native-vector-icons/Ionicons";
import ListingSearchRow from "../../components/search/product-search-row";
import { auth, db } from "../../firebase";
import { global } from "../../style";

const Products = () => {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState(null);
  const [fruits, setFruits] = useState(null);
  const [vegetables, setVegetables] = useState(null);
  const [dairy, setDairy] = useState(null);
  const [herbs, setHerbs] = useState(null);
  const [microgreens, setMicrogreens] = useState(null);
  const [other, setOther] = useState(null);
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = useState([
    { key: "first", title: "All" },
    { key: "second", title: "Fruits" },
    { key: "third", title: "Vegetables" },
    { key: "fourth", title: "Dairy" },
    { key: "fifth", title: "Herbs" },
    { key: "sixth", title: "Microgreens" },
    { key: "seventh", title: "Other" }
  ]);
  const [loading, setLoading] = useState(false);

  const FirstRoute = () => (
    <View useSafeArea flex>
      <FlatList 
        data={products}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ListingSearchRow farmer={item.farmer} title={item.title} description={item.description} price={item.price.toFixed(2)} quantity={item.quantity} cover={item.cover} />
        )}
      />
    </View>
  );

  const SecondRoute = () => (
    <View useSafeArea flex>
      <FlatList 
        data={fruits}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ListingSearchRow farmer={item.farmer} title={item.title} description={item.description} price={item.price.toFixed(2)} quantity={item.quantity} cover={item.cover} />
        )}
      />
    </View>
  );

  const ThirdRoute = () => (
    <View useSafeArea flex>
      <FlatList 
        data={vegetables}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ListingSearchRow farmer={item.farmer} title={item.title} description={item.description} price={item.price.toFixed(2)} quantity={item.quantity} cover={item.cover} />
        )}
      />
    </View>
  );

  const FourthRoute = () => (
    <View useSafeArea flex>
      <FlatList 
        data={dairy}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ListingSearchRow farmer={item.farmer} title={item.title} description={item.description} price={item.price.toFixed(2)} quantity={item.quantity} cover={item.cover} />
        )}
      />
    </View>
  );

  const FifthRoute = () => (
    <View useSafeArea flex>
      <FlatList 
        data={herbs}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ListingSearchRow farmer={item.farmer} title={item.title} description={item.description} price={item.price.toFixed(2)} quantity={item.quantity} cover={item.cover} />
        )}
      />
    </View>
  );

  const SixthRoute = () => (
    <View useSafeArea flex>
      <FlatList 
        data={microgreens}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ListingSearchRow farmer={item.farmer} title={item.title} description={item.description} price={item.price.toFixed(2)} quantity={item.quantity} cover={item.cover} />
        )}
      />
    </View>
  );

  const SeventhRoute = () => (
    <View useSafeArea flex>
      <FlatList 
        data={other}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ListingSearchRow farmer={item.farmer} title={item.title} description={item.description} price={item.price.toFixed(2)} quantity={item.quantity} cover={item.cover} />
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
    fifth: FifthRoute,
    sixth: SixthRoute,
    seventh: SeventhRoute,
  });

  useEffect(() => {
    if (search.length == 0 || products.length == 0) {
      onSnapshot(query(collection(db, "Listings"), where(documentId(), "!=", auth.currentUser.uid)), async (snapshot) => {
        setProducts(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
      });

      onSnapshot(query(collection(db, "Listings"), where(documentId(), "!=", auth.currentUser.uid), where("pt", "==", "Fruits")), async (snapshot) => {
        setFruits(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
      });

      onSnapshot(query(collection(db, "Listings"), where(documentId(), "!=", auth.currentUser.uid), where("pt", "==", "Vegetables")), async (snapshot) => {
        setVegetables(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
      });

      onSnapshot(query(collection(db, "Listings"), where(documentId(), "!=", auth.currentUser.uid), where("pt", "==", "Dairy")), async (snapshot) => {
        setDairy(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
      });

      onSnapshot(query(collection(db, "Listings"), where(documentId(), "!=", auth.currentUser.uid), where("pt", "==", "Herbs")), async (snapshot) => {
        setHerbs(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
      });

      onSnapshot(query(collection(db, "Listings"), where(documentId(), "!=", auth.currentUser.uid), where("pt", "==", "Microgreens")), async (snapshot) => {
        setMicrogreens(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
      });

      onSnapshot(query(collection(db, "Listings"), where(documentId(), "!=", auth.currentUser.uid), where("pt", "==", "Other")), async (snapshot) => {
        setOther(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
      });
    } else {
      onSnapshot(query(collection(db, "Listings"), where("title", ">=", search), where("title", "<=", search + "\uf8ff")), async (snapshot) => {
        setProducts(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})).filter(doc => doc.id != auth.currentUser.uid));
      });
    }
  }, [search]);

  useEffect(() => {
    if (products && fruits && vegetables && dairy && herbs && microgreens & other) {
      setLoading(false);
    }
  }, [products, fruits, vegetables, dairy, herbs, microgreens, other]);

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

      <TabView
        style={global.bgWhite}
        navigationState={{ index, routes }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "black" }}
            style={{ backgroundColor: "white", height: 50 }}
            renderLabel={renderLabel}
            scrollEnabled
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