import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  useWindowDimensions
} from "react-native";
import { Button, TabController, Text, View } from "react-native-ui-lib";
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import PostRow from "../../components/products/post-row";
import ProductRow from "../../components/products/product-row";
import SubscriptionRow from "../../components/products/subscription-row";
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
                {text: 'Delete', onPress: async () => deleteItem(item, "Products")},
              ])} />
            )}
          />
        : <Text subtitle>No products yet</Text>
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
              <SubscriptionRow image={item.image} title={item.title} price={item.price} onPress={() => Alert.alert(item.title, item.description, [
                {text: 'Edit', onPress: () => navigation.navigate("Edit Subscription", { id: item.id })},
                {text: 'Cancel', style: 'cancel'},
                {text: 'Delete', onPress: async () => deleteItem(item, "Subscriptions")},
              ])} />
            )}
          />
        : <Text subtitle>No subscriptions yet</Text>
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
              <PostRow image={item.image} title={item.title} description={item.description} onPress={() => Alert.alert(item.title, item.description, [
                {text: 'Edit', onPress: () => navigation.navigate("Edit Post", { id: item.id })},
                {text: 'Cancel', style: 'cancel'},
                {text: 'Delete', onPress: async () => deleteItem(item, "Posts")},
              ])} />
            )}
          />
        : <Text subtitle>No posts yet</Text>
      }
    </View>
  );

  const deleteItem = async (item, collection) => {
    await deleteDoc(doc(db, collection, item.id));
  }

  // const test = useCallback(deleteItem(), [])

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
      <TabController items={[{label: 'Products'}, {label: 'Subscriptions'}, {label: 'Posts'}]}>  
        <TabController.TabBar enableShadows />  
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
          {text: 'Product', onPress: () => navigation.navigate("Create Listing")},
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