import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import {
  useWindowDimensions
} from "react-native";
import { FloatingAction } from "react-native-floating-action";
import { Colors, LoaderScreen, TabController, Text, View } from "react-native-ui-lib";
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

  const actions = [
    {
      text: "Create Product",
      icon: <MCIcon name="credit-card" color={Colors.white} size={24} />,
      name: "Create Product",
      position: 1,
      color: Colors.tertiary
    },
    {
      text: "Create Subscription",
      icon: <MCIcon name="cash" color={Colors.white} size={24} />,
      name: "Create Subscription",
      position: 2,
      color: Colors.tertiary
    }
  ];

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
        : <Text text65 marginV-4>No products yet</Text>
      }
    </View>
  );

  const SecondRoute = () => (
    <View useSafeArea flex style={subscriptions.length == 0 && [global.center, global.container]}>
      {subscriptions.length != 0 
        ? <FlashList 
            data={subscriptions}
            keyExtractor={(item: any) => item.id}
            estimatedItemSize={subscriptions.length != 0 ? subscriptions.length : 150}
            renderItem={renderSubscription}
          />
        : <Text text65 marginV-4>No subscriptions yet</Text>
      }
    </View>
  );

  useEffect(() => {
    const subscriber = onSnapshot(query(collection(db, "Products"), where("user", "==", auth.currentUser?.uid)), async (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    const subscriber2 = onSnapshot(query(collection(db, "Subscriptions"), where("user", "==", auth.currentUser?.uid)), async (snapshot) => {
      setSubscriptions(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    // Unsubscribe from events when no longer in use
    return () => {
      subscriber();
      subscriber2();
    } 
  }, []);

  useEffect(() => {
    if (products && subscriptions) {
      setLoading(false);
    }
  }, [products, subscriptions]);

  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }

  return (
    <View useSafeArea flex style={global.white}>
      <TabController items={[{label: 'Products'}, {label: 'Subscriptions'}]}>  
        <TabController.TabBar 
          indicatorInsets={0}
          indicatorStyle={{ backgroundColor: Colors.tertiary }} 
          selectedLabelColor={Colors.tertiary}
          labelStyle={{ width: width, textAlign: "center", fontWeight: "500" }}
        />  
        <View flex>    
          <TabController.TabPage index={0} lazy>{FirstRoute()}</TabController.TabPage>    
          <TabController.TabPage index={1} lazy>{SecondRoute()}</TabController.TabPage>    
        </View>
      </TabController>
      <FloatingAction
        actions={actions}
        color={Colors.tertiary}
        tintColor={Colors.tertiary}
        distanceToEdge={16}
        onPressItem={(name) => navigation.navigate(name)}
      />
    </View>    
  );
}

export default Products