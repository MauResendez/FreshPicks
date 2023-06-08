import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Keyboard, Platform, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Button, Colors, KeyboardAwareScrollView, ListItem, LoaderScreen, Text, View } from 'react-native-ui-lib';
import AddressRow from '../../components/basket/address-row';
import BasketRow from '../../components/basket/basket-row';
import BusinessRow from '../../components/basket/business-row';
import { db } from '../../firebase';
import { global } from '../../style';

const Order = ({ route }) => {
	const [order, setOrder] = useState(null);
	const [consumer, setConsumer] = useState(null);
	const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);

	useEffect(() => {
    getDoc(doc(db, "Orders", route.params.id)).then((docSnapshot) => {
      const data = docSnapshot.data();
      setOrder({...data, id: route.params.id});
    });
  }, []);

	useEffect(() => {
		if (order) {
      console.log("Order:", order);
			getDoc(doc(db, "Users", order.consumer)).then((docSnapshot) => {
				const data = docSnapshot.data();
				setConsumer({...data, id: order.consumer});
			});
		
			getDoc(doc(db, "Users", order.farmer)).then((docSnapshot) => {
				const data = docSnapshot.data();
				setFarmer({...data, id: order.farmer});
			});
		}
  }, [order]);

	useEffect(() => {
		if (consumer && farmer) {
      console.log("Consumer:", consumer.id);
      console.log("Farmer:", farmer.id);
      console.log("Products:", order.products);
			setLoading(false);
		}
  }, [consumer, farmer]);

  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }

  return (
    <View useSafeArea flex>
      <TouchableWithoutFeedback style={global.flex} onPress={Platform.OS !== "web" && Keyboard.dismiss}>
        <KeyboardAwareScrollView contentContainerStyle={global.flex} showsVerticalScrollIndicator={Platform.OS == "web"}>
          <ListItem
            activeOpacity={0.3}
            height={60}
          >
            <ListItem.Part containerStyle={[{paddingHorizontal: 16}]}>
              <Text text65 marginV-4 numberOfLines={1} style={{ color: Colors.black }}>
                Order
              </Text>
            </ListItem.Part>
          </ListItem>

          <BusinessRow item={farmer} />

          <AddressRow item={farmer} />
          
          <ListItem
            activeOpacity={0.3}
            height={60}
          >
            <ListItem.Part containerStyle={[{paddingHorizontal: 16}]}>
              <Text text65 marginV-4 numberOfLines={1} style={{ color: Colors.black }}>
                Your items
              </Text>
            </ListItem.Part>
          </ListItem>

          {order.products.map((item: any) => (
            <BasketRow item={item} count={item.count} />
          ))}

          <View flexG />

          <View style={styles.cart}>
            <Button 
              backgroundColor={Colors.primary}
              color={Colors.white}
              label={"Send Meeting Request"} 
              labelStyle={{ fontWeight: '600', padding: 8 }} 
              style={global.button} 
              // onPress={createOrder}          
            />
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  cart: {
    padding: 16,
  }
});

export default Order