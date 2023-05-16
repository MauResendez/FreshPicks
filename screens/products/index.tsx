import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import {
  useWindowDimensions
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Button, LoaderScreen, TabController, Text, View } from "react-native-ui-lib";
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductRow from "../../components/products/product-row";
import SubscriptionRow from "../../components/products/subscription-row";
import { auth, db } from "../../firebase";
import { global } from "../../style";

const Products = () => {
  const navigation = useNavigation<any>();
  const layout = useWindowDimensions();
  const width = layout.width/3;
  const [products, setProducts] = useState<any>(null);
  const [subscriptions, setSubscriptions] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const renderProduct = useCallback(({item}) => {
    return (
      <ProductRow item={item} />
    );
  }, []);

  const renderSubscription = useCallback(({item}) => {
    return (
      <SubscriptionRow item={item} />
    );
  }, []);

  const FirstRoute = () => (
    <View useSafeArea flex style={products.length == 0 && [global.center, global.container]}>
      {products.length != 0 
        ? <FlashList 
            data={products}
            keyExtractor={(item: any) => item.id}
            estimatedItemSize={products.length != 0 ? products.length : 150}
            renderItem={renderProduct}
          />
        : <Text subtitle>No products yet</Text>
      }
      <Button
        style={global.fab} 
        round 
        animateLayout 
        animateTo={'right'} 
        onPress={() => navigation.navigate("Create Product")} 
        backgroundColor="#32CD32" 
        iconSource={() => <MCIcon name="plus" color="white" size={24} />} 
      /> 
    </View>
  );

  const SecondRoute = () => (
    <View style={subscriptions.length == 0 && [global.center, global.container]}>
      {subscriptions.length != 0 
        ? <FlashList 
            data={subscriptions}
            keyExtractor={(item: any) => item.id}
            estimatedItemSize={subscriptions.length != 0 ? subscriptions.length : 150}
            renderItem={renderSubscription}
          />
        : <Text subtitle>No subscriptions yet</Text>
      }
      <Button
        style={global.fab} 
        round 
        animateLayout 
        animateTo={'right'} 
        onPress={() => navigation.navigate("Create Subscription")} 
        backgroundColor="#32CD32" 
        iconSource={() => <MCIcon name="plus" color="white" size={24} />} 
      /> 
    </View>
  );

  useEffect(() => {
    onSnapshot(query(collection(db, "Products"), where("user", "==", auth.currentUser?.uid)), async (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    onSnapshot(query(collection(db, "Subscriptions"), where("user", "==", auth.currentUser?.uid)), async (snapshot) => {
      setSubscriptions(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
  }, []);

  useEffect(() => {
    if (products && subscriptions) {
      setLoading(false);
    }
  }, [products, subscriptions]);

  if (loading) {
    return (
      <LoaderScreen />
    )
  }

  return (
    <GestureHandlerRootView style={global.flex}>
      <View useSafeArea flex style={global.bgWhite}>
        <TabController items={[{label: 'Products'}, {label: 'Subscriptions'}]}>  
          <TabController.TabBar 
            indicatorInsets={0}
            indicatorStyle={{ backgroundColor: "#32CD32" }} 
            selectedLabelColor={global.activeTabTextColor.color}
            labelStyle={{ width: width, textAlign: "center", fontWeight: "500" }}
          />  
          <View flex>    
            <TabController.TabPage index={0}>{FirstRoute()}</TabController.TabPage>    
            <TabController.TabPage index={1} lazy>{SecondRoute()}</TabController.TabPage>    
          </View>
        </TabController>
      </View>
    </GestureHandlerRootView>
    
  );
}

export default Products