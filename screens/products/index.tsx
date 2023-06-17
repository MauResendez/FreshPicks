import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { FloatingAction } from "react-native-floating-action";
import { Colors, LoaderScreen, Text, View } from "react-native-ui-lib";
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductRow from "../../components/products/product-row";
import SubscriptionRow from "../../components/products/subscription-row";
import { auth, db } from "../../firebase";
import { global } from "../../style";

const Products = () => {
  const navigation = useNavigation<any>();
  const [products, setProducts] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const actions = [
    {
      text: "Create Product",
      icon: <MCIcon name="plus" color={Colors.white} size={24} />,
      name: "Create Product",
      position: 1,
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

  useEffect(() => {
    const subscriber = onSnapshot(query(collection(db, "Products"), where("user", "==", auth.currentUser?.uid)), async (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    // Unsubscribe from events when no longer in use
    return () => {
      subscriber();
    } 
  }, []);

  useEffect(() => {
    if (products) {
      setLoading(false);
    }
  }, [products]);

  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }

  if (products.length == 0) {
    return (
      <View useSafeArea flex style={[global.white, global.center, global.container]}>
        <Text text65 marginV-4>No products made</Text>
        <FloatingAction
          actions={actions}
          color={Colors.tertiary}
          distanceToEdge={16}
          onPressItem={
            (name) => navigation.navigate(name)
          }
          overrideWithAction
          tintColor={Colors.tertiary}
        />
      </View>
    )
  }

  return (
    <View useSafeArea flex style={global.white}>
      {products.length != 0 
        ? <FlashList 
            data={products}
            keyExtractor={(item: any) => item.id}
            estimatedItemSize={products.length != 0 ? products.length : 150}
            renderItem={renderProduct}
          />
        : <Text text65 marginV-4>No products yet</Text>
      }
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