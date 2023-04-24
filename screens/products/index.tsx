import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  useWindowDimensions
} from "react-native";
import { Button, Colors, Image, ListItem, TabController, Text, View } from "react-native-ui-lib";
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductRow from "../../components/products/product-row";
import { auth, db } from "../../firebase";
import { global } from "../../style";

const Products = () => {
  const navigation = useNavigation<any>();
  const [products, setProducts] = useState<any>([]);
  const [posts, setPosts] = useState<any>([]);
  const [subscriptions, setSubscriptions] = useState<any>([]);
  const layout = useWindowDimensions();

  const FirstRoute = () => (
    <View useSafeArea flex style={products.length == 0 && [global.center, global.container]}>
      {products.length != 0 
        ? <FlashList 
            data={products}
            keyExtractor={(item: any) => item.id}
            estimatedItemSize={products.length}
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
    </View>
  );

  const SecondRoute = () => (
    <View useSafeArea flex style={subscriptions.length == 0 && [global.center, global.container]}>
      {subscriptions.length != 0 
        ? <FlashList 
            data={subscriptions}
            keyExtractor={(item: any) => item.id}
            estimatedItemSize={subscriptions.length}
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
  );

  const ThirdRoute = () => (
    <View useSafeArea flex style={posts.length == 0 && [global.center, global.container]}>
      {posts.length != 0 
        ? <FlashList 
            data={posts}
            keyExtractor={(item: any) => item.id}
            estimatedItemSize={posts.length}
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
  );

  const deleteListing = async (listing) => {
    // setVisible(true);
    await deleteDoc(doc(db, "Products", listing.id));
  }

  useEffect(() => {
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

  return (
    <View useSafeArea flex style={global.bgWhite}>
      <TabController items={[{label: 'First'}, {label: 'Second'}, {label: 'Third'}]}>  
        <TabController.TabBar spreadItems enableShadows />  
        <View flex>    
          <TabController.TabPage index={0}>{FirstRoute()}</TabController.TabPage>    
          <TabController.TabPage index={1} lazy>{SecondRoute()}</TabController.TabPage>    
          <TabController.TabPage index={2} lazy>{ThirdRoute()}</TabController.TabPage>  
        </View>
      </TabController>
      <Button 
        style={global.fab} 
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
        iconSource={() => <MCIcon name="plus" color="white" size={24} />} 
      />
    </View>
  );
}

export default Products