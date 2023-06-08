import { useNavigation } from '@react-navigation/native';
import { addDoc, collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useMemo, useState } from 'react';
import { Keyboard, Platform, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Button, Colors, KeyboardAwareScrollView, ListItem, LoaderScreen, Text, View } from 'react-native-ui-lib';
import { useDispatch, useSelector } from 'react-redux';
import AddressRow from '../../components/basket/address-row';
import BasketRow from '../../components/basket/basket-row';
import BusinessRow from '../../components/basket/business-row';
import DatetimeRow from '../../components/basket/datetime-row';
import { clearOrder, getOrderFarmer, getOrderUser, selectOrderItems, selectOrderTotal } from '../../features/order-slice';
import { db } from '../../firebase';
import { global } from '../../style';

const Basket = () => {
  const navigation = useNavigation<any>();
  const [chat, setChat] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const items = useSelector(selectOrderItems);
  const orderFarmer = useSelector(getOrderFarmer);
  const orderTotal = useSelector(selectOrderTotal);
  const orderUser = useSelector(getOrderUser);
  const dispatch = useDispatch();

  const clearOrderItems = (() => {
    dispatch(clearOrder());
  });

  const groupedItems = useMemo(() => {
    return items.reduce((results, item) => {
      (results[item.id] = results[item.id] || []).push(item);
      return results;
    }, {});
  }, [items]);

  const result = items.reduce(function(acc, curr) {
    // Check if there exist an object in empty array whose CategoryId matches
    let isElemExist = acc.findIndex(function(item) {
      return item.id === curr.id;
    });

    if (isElemExist === -1) {
      let obj: any = {};
      obj.id = curr.id;
      obj.count = 1;
      obj.description = curr.description;
      obj.farmer = curr.user;
      // obj.image = curr.image;
      obj.price = curr.price;
      obj.title = curr.title;
      acc.push(obj)
    } else {
      acc[isElemExist].count += 1
    }

    return acc;
  }, []);


  const createOrder = async () => {
    await addDoc(collection(db, "Orders"), {
      consumer: orderUser.id,
      farmer: orderFarmer.id,
      products: result,
      total: Number(orderTotal.toFixed(2)),
      status: "Pending",
      createdAt: new Date(),
      title: `Order for ${orderUser.name}`,
    }).then(async () => {
      handleChat();
    }).catch((e) => alert(e.message));
  }

  const handleChat = (async () => {
    // let message = `${orderUser.name} has recently created an order (ID: ${order}) of (List of items here) for $${data.total.toFixed(2)}.`;

    if (chat.length != 0) {
      clearOrderItems();
      navigation.navigate("Conversation", { id: chat[0]?.id, message: "" });
      return
    }

    await addDoc(collection(db, "Chats"), {
      consumer: orderUser.id,
      farmer: orderFarmer.id,
      messages: []
    }).then((doc) => {
      clearOrderItems();
      navigation.navigate("Conversation", { id: doc.id, message: "" });
    }).catch(e => alert(e.message));
  });

  // Get the user's chats first
  useEffect(() => {
    if (orderUser && orderFarmer) {
      onSnapshot(query(collection(db, "Chats"), where("consumer", "==", orderUser.id), where("farmer", "==", orderFarmer.id)), async (snapshot) => {
        setChat(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
      });
    } else {
      setLoading(false); 
    }
  }, [orderUser, orderFarmer]);

  useEffect(() => {
    if (chat) {
      setLoading(false); 
      return
    }
  }, [chat]);

  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }

  if (items.length == 0) {
    return (
      <View useSafeArea flex style={[global.white, global.center, global.container]}>
        <Text text65 marginV-4>Basket is empty</Text>
      </View>
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
                Basket
              </Text>
            </ListItem.Part>
          </ListItem>

          <BusinessRow item={orderFarmer} />

          <AddressRow item={orderFarmer} />

          <DatetimeRow item={orderFarmer} />
          
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

          {Object.entries(groupedItems).map(([key, items]: any) => (
            <BasketRow key={key} item={items[0]} count={items.length} />
          ))}

          <View flexG />

          <View style={styles.cart}>
            <Button 
              backgroundColor={Colors.primary}
              color={Colors.white}
              label={"Send Order Request"} 
              labelStyle={{ fontWeight: '600', padding: 8 }} 
              style={global.button} 
              onPress={createOrder}          
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

export default Basket