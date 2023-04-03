import { useNavigation } from "@react-navigation/native";
import { collection, documentId, onSnapshot, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { FlatList, StyleSheet, useWindowDimensions } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { Avatar, Icon, ListItem, Text, TextField, View } from "react-native-ui-lib";
import Loading from "../../components/extra/loading";
import OrderRow from "../../components/orders/order-row";
import { auth, db } from "../../firebase";
import { global } from "../../style";

const Orders = () => {
  const navigation = useNavigation<any>();
  const [orders, setOrders] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState(null);
  const [cancelled, setCancelled] = useState(null);
  const [denied, setDenied] = useState(null);
  const [accepted, setAccepted] = useState(null);
  const [loading, setLoading] = useState(true);
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "All Orders" },
    { key: "second", title: "Pending" },
    { key: "third", title: "Confirmed" },
    { key: "fourth", title: "Cancelled" }
  ]);

  const FirstRoute = () => (
    <View useSafeArea flex>
      <FlatList 
        data={pending}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ListItem
            activeBackgroundColor={"white"}
            activeOpacity={0.3}
            style={{ backgroundColor: "white", padding: 8, height: "auto" }}
          >
            <ListItem.Part left>
              <Avatar source={{ uri: item.cover }} size={50} containerStyle={{ marginRight: 8 }}/>
            </ListItem.Part>
            <ListItem.Part column>
              <Text h2 numberOfLines={1}>{item.business}</Text>
              <Text h3>{item.address}</Text>
            </ListItem.Part>
          </ListItem>
        )}
      />
    </View>
  );

  const SecondRoute = () => (
    <View useSafeArea flex>
      <FlatList 
        data={accepted}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ListItem
            activeBackgroundColor={"white"}
            activeOpacity={0.3}
            style={{ backgroundColor: "white", padding: 8, height: "auto" }}
          >
            <ListItem.Part left>
              <Avatar source={{ uri: item.cover }} size={50} containerStyle={{ marginRight: 8 }}/>
            </ListItem.Part>
            <ListItem.Part column>
              <Text h2 numberOfLines={1}>{item.business}</Text>
              <Text h3>{item.address}</Text>
            </ListItem.Part>
          </ListItem>
        )}
      />
    </View>
  );

  const ThirdRoute = () => (
    <View useSafeArea flex>
      <FlatList 
        data={cancelled}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ListItem
            activeBackgroundColor={"white"}
            activeOpacity={0.3}
            style={{ backgroundColor: "white", padding: 8, height: "auto" }}
          >
            <ListItem.Part left>
              <Avatar source={{ uri: item.cover }} size={50} containerStyle={{ marginRight: 8 }}/>
            </ListItem.Part>
            <ListItem.Part column>
              <Text h2 numberOfLines={1}>{item.business}</Text>
              <Text h3>{item.address}</Text>
            </ListItem.Part>
          </ListItem>
        )}
      />
    </View>
  );

  const FourthRoute = () => (
    <View useSafeArea flex>
      <FlatList 
        data={denied}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ListItem
            activeBackgroundColor={"white"}
            activeOpacity={0.3}
            style={{ backgroundColor: "white", padding: 8, height: "auto" }}
          >
            <ListItem.Part left>
              <Avatar source={{ uri: item.cover }} size={50} containerStyle={{ marginRight: 8 }}/>
            </ListItem.Part>
            <ListItem.Part column>
              <Text h2 numberOfLines={1}>{item.business}</Text>
              <Text h3>{item.address}</Text>
            </ListItem.Part>
          </ListItem>
        )}
      />
    </View>
  )

  const renderLabel = ({ route, focused, color }) => {
    return (
      <View>
        <Text
          style={[focused ? styles.activeTabTextColor : styles.tabTextColor]}
        >
          {route.title}
        </Text>
      </View>
    );
  };

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
    fourth: FourthRoute,
  });

  useEffect(() => { 
    if (search.length == 0 || orders.length == 0) {
      onSnapshot(query(collection(db, "Orders"), where("farmer", "==", auth.currentUser.uid), orderBy("createdAt", "desc")), async (snapshot) => {
        setOrders(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
      });  
    } else {
      onSnapshot(query(collection(db, "Orders"), where("farmer", "==", auth.currentUser.uid), where(documentId(), ">=", search), where(documentId(), "<=", search + "\uf8ff")), async (snapshot) => {
        setOrders(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
      });  
    }
  }, [search]);

  useEffect(() => { 
    if (orders) {
      console.log(orders);
      setLoading(false);
    }
  }, [orders]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, []);

  if (loading) {
    return (
      <Loading />
    )
  }

  if (orders.length == 0) {
    return (
      <View useSafeArea flex style={[global.container, global.center, global.bgGray]}>
        <Text style={global.subtitle}>No orders have been made yet</Text>
      </View>
    )
  }

  return (
    <View useSafeArea flex>
      <View style={styles.search}>
        <TextField fieldStyle={{ backgroundColor: "lightgray", borderRadius: 8, margin: 8, padding: 12 }} value={search} onChangeText={(value) => setSearch(value)} placeholder="Search with Order ID" leadingAccessory={<Icon name="search" color={"gray"} size={20} style={{ marginRight: 8 }} />} migrate />
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
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OrderRow
            id={item.id}
            listings={item.listings}
            consumer={item.consumer}
            farmer={item.farmer}
            total={item.total}
            status={item.status}
            createdAt={item.createdAt}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  search: {
    padding: 6,
    backgroundColor: "white",
  },
  activeTabTextColor: {
    color: "#eeaf3b",
  },
  tabTextColor: {
    color: "black",
  },
});

export default Orders