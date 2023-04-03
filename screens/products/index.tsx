import { useNavigation } from "@react-navigation/native";
import { collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView
} from "react-native";
import { Button, Colors, Image, ListItem, Text, View } from "react-native-ui-lib";
import Ionicon from 'react-native-vector-icons/Ionicons';
import { auth, db } from "../../firebase";
import { global } from "../../style";

const Products = () => {
  const navigation = useNavigation<any>();
  const [farmer, setFarmer] = useState<any>(null);
  const [listings, setListings] = useState<any>([]);
  const [posts, setPosts] = useState<any>([]);
  const [subscriptions, setSubscriptions] = useState<any>([]);

  const deleteListing = async (listing) => {
    // setVisible(true);
    await deleteDoc(doc(db, "Listings", listing.id));
  }

  useEffect(() => {
    onSnapshot(doc(db, "Users", auth.currentUser.uid), (doc) => {
      setFarmer(doc.data());
    });

    onSnapshot(query(collection(db, "Listings"), where("user", "==", auth.currentUser?.uid)), async (snapshot) => {
      setListings(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    onSnapshot(query(collection(db, "Subscriptions"), where("user", "==", auth.currentUser?.uid)), async (snapshot) => {
      setSubscriptions(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    onSnapshot(query(collection(db, "Posts"), where("user", "==", auth.currentUser?.uid)), async (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
  }, []);

  useEffect(() => {
    if (listings.length > 0) {
      console.log(listings);
    }

    console.log(auth.currentUser.uid);

    console.log("Listings: " + listings);

  }, [listings]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, []);

  return (
    <View useSafeArea flex>
      <ScrollView contentContainerStyle={[global.container, global.spaceBetween]}>
        <View>
          <Text subtitle>Listings</Text>

          <FlatList 
            data={listings}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <ListItem
                activeBackgroundColor={Colors.grey60}
                activeOpacity={0.3}
                backgroundColor={Colors.white}
                onPress={() => Alert.alert(item.title, item.description, [
                  {text: 'Edit', onPress: () => navigation.navigate("Edit Listing", { id: item.id })},
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
                    <Text h2>${item.price}</Text>
                  </View>
                  <View row style={global.spaceBetween}>
                    <Text h3>{item.quantity} remaining</Text>
                    <Text h3>Expiring in {item.expiration.toDate().toLocaleDateString()}</Text>
                  </View>
                </ListItem.Part>
              </ListItem>
            )}
          />
        </View>

        <View>
          <Text subtitle>Subscriptions</Text>

          <FlatList 
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
        </View>

        <View>
          <Text subtitle>Posts</Text>

          <FlatList 
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
        </View>
      </ScrollView>
      <Button 
        style={{ width: 64, height: 64, margin: 16 }} 
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
        iconSource={() => <Ionicon name="create" color="white" size={24} />} 
      />
    </View>
  );
}

export default Products