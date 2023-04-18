import { useNavigation } from "@react-navigation/native";
import { collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  FlatList,
  useWindowDimensions
} from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { Button, Colors, Image, ListItem, Text, View } from "react-native-ui-lib";
import Ionicon from 'react-native-vector-icons/Ionicons';
import ProductRow from "../../components/products/product-row";
import { auth, db } from "../../firebase";
import { global } from "../../style";

const Products = () => {
  const navigation = useNavigation<any>();
  const [farmer, setFarmer] = useState<any>(null);
  const [products, setProducts] = useState<any>([]);
  const [posts, setPosts] = useState<any>([]);
  const [subscriptions, setSubscriptions] = useState<any>([]);
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "Products" },
    { key: "second", title: "Subscriptions" },
    { key: "third", title: "Posts" },
  ]);

  const FirstRoute = () => (
    <View useSafeArea flex>
      {products.length != 0 
        ? <FlatList 
            data={products}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <ProductRow image={item.image} title={item.title} price={item.price} quantity={item.quantity} onPress={() => Alert.alert(item.title, item.description, [
                {text: 'Edit', onPress: () => navigation.navigate("Edit Listing", { id: item.id })},
                {text: 'Cancel', style: 'cancel'},
                {text: 'Delete', onPress: async () => deleteListing(item)},
              ])} />
            )}
          />
        : <Text style={global.subtitle}>No products yet</Text>
      }
      <Button 
        style={{ width: 48, height: 48, display: "absolute", bottom: 16, right: 16 }} 
        round 
        animateLayout 
        animateTo={'right'}
        onPress={() => Alert.alert("Create", "What would you like to create?", [
          {text: 'Listing', onPress: () => navigation.navigate("Create Listing")},
          {text: 'Subscription', onPress: () => navigation.navigate("Create Subscription")},
          {text: 'Post', onPress: () => navigation.navigate("Create Post")},
          {text: 'Cancel', style: 'cancel'},
        ])} 
        backgroundColor="#32CD32" 
        iconSource={() => <Ionicon name="add" color="white" size={24} />} 
      />
    </View>
  );

  const SecondRoute = () => (
    <View useSafeArea flex>
      <View style={[global.center, global.container]}>
        {subscriptions.length != 0 
          ? <FlatList 
              data={subscriptions}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <ListItem
                  activeBackgroundColor={Colors.grey60}
                  activeOpacity={0.3}
                  backgroundColor={Colors.white}
                  onPress={() => Alert.alert(item.title, item.description, [
                    {text: 'Edit', onPress: () => navigation.navigate("Edit Subscription", { id: item.id })},
                    {text: 'Cancel', style: 'cancel'},
                    {text: 'Delete', onPress: async () => deleteListing(item)},
                  ])}
                  style={{ borderRadius: 8, marginBottom: 8, padding: 8 }}
                >
                  <ListItem.Part left>
                    <Image source={{ uri: item.image }} style={{ width: 50, height: 50, marginRight: 12 }}/>
                  </ListItem.Part>
                  <ListItem.Part middle column>
                    <View row style={global.spaceBetween}>
                      <Text h2>{item.title}</Text>
                      <Text h2>${item.price}/{item.st.charAt(0)}</Text>
                    </View>
                    <View row style={global.spaceBetween}>
                      <Text h3>{item.description}</Text>
                    </View>
                  </ListItem.Part>
                </ListItem>
              )}
            />
          : <Text style={global.subtitle}>No subscriptions yet</Text>
        }
      </View>
    </View>
  );

  const ThirdRoute = () => (
    <View useSafeArea flex>
      <View style={[global.center, global.container]}>
        {posts.length != 0 
          ? <FlatList 
              data={posts}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <ListItem
                  activeBackgroundColor={Colors.grey60}
                  activeOpacity={0.3}
                  backgroundColor={Colors.white}
                  onPress={() => Alert.alert(item.title, item.description, [
                    {text: 'Edit', onPress: () => navigation.navigate("Edit Post", { id: item.id })},
                    {text: 'Cancel', style: 'cancel'},
                    {text: 'Delete', onPress: async () => deleteListing(item)},
                  ])}
                  style={{ borderRadius: 8, marginBottom: 8, padding: 8 }}
                >
                  <ListItem.Part left>
                    <Image source={{ uri: item.image }} style={{ width: 50, height: 50, marginRight: 12 }}/>
                  </ListItem.Part>
                  <ListItem.Part middle column>
                    <View row style={global.spaceBetween}>
                      <Text h2>{item.title}</Text>
                    </View>
                    <View row style={global.spaceBetween}>
                      <Text h3>{item.description}</Text>
                    </View>
                  </ListItem.Part>
                </ListItem>
              )}
            />
          : <Text style={global.subtitle}>No posts yet</Text>
        }
      </View>
    </View>
  );

  const renderLabel = ({ route, focused, color }) => {
    return (
      <Text style={[focused ? global.activeTabTextColor : global.tabTextColor]}>
        {route.title}
      </Text>
    );
  };

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute
  });

  const deleteListing = async (listing) => {
    // setVisible(true);
    await deleteDoc(doc(db, "Products", listing.id));
  }

  useEffect(() => {
    onSnapshot(doc(db, "Users", auth.currentUser.uid), (doc) => {
      setFarmer(doc.data());
    });

    onSnapshot(query(collection(db, "Products"), where("user", "==", auth.currentUser?.uid)), async (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    onSnapshot(query(collection(db, "Subscriptions"), where("user", "==", auth.currentUser?.uid)), async (snapshot) => {
      setSubscriptions(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    onSnapshot(query(collection(db, "Posts"), where("user", "==", auth.currentUser?.uid)), async (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, []);

  return (
    <TabView
      style={global.bgWhite}
      navigationState={{ index, routes }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: global.activeTabTextColor.color }}
          style={{ backgroundColor: "white", height: 50 }}
          renderLabel={renderLabel}
        />
      )}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}

export default Products