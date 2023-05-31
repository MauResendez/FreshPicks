import { useNavigation } from '@react-navigation/native';
import { addDoc, collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useMemo, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Button, Colors, ListItem, LoaderScreen, Text, View } from 'react-native-ui-lib';
import { useDispatch, useSelector } from 'react-redux';
import AddressRow from '../../components/basket/address-row';
import BasketRow from '../../components/basket/basket-row';
import BusinessRow from '../../components/basket/business-row';
import { clearOrder, getOrderFarmer, getOrderUser, selectOrderItems, selectOrderTotal } from '../../features/order-slice';
import { db } from '../../firebase';
import { global } from '../../style';

const Basket = () => {
  const navigation = useNavigation<any>();
  const [chat, setChat] = useState<any>(null);
  const [chats, setChats] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [farmer, setFarmer] = useState<any>(null);
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
      obj.quantity = curr.quantity;
      acc.push(obj)
    } else {
      acc[isElemExist].count += 1
    }

    return acc;
  }, []);


  const createOrder = async () => {
    await addDoc(collection(db, "Meetings"), {
      consumer: orderUser.id,
      farmer: orderFarmer.id,
      products: result,
      total: Number(orderTotal.toFixed(2)),
      status: "PENDING",
      createdAt: new Date(),
      meetAt: null
    })
      .then(async (doc) => {
        // Toast.show("Order has been confirmed!", {
        //   duration: Toast.durations.SHORT,
        //   backgroundColor: "green",
        //   position: Platform.OS == "web" ? 650 : 700,
        // });

        setOrder(doc.id);
      })
      .catch((e) => alert(e.message));
  }

  const handleChat = (async () => {
    let message = `${orderUser.name} has recently created an order (ID: ${order}) of (List of items here) for $${data.total.toFixed(2)}.`;

    if (chat.length != 0) {
      clearOrderItems();
      navigation.navigate("Conversation", { id: chat[0]?.id, message: message });
      return
    }

    await addDoc(collection(db, "Chats"), {
      consumer: orderUser.id,
      farmer: orderFarmer.id,
      messages: []
    })
    .then((doc) => {
      clearOrderItems();
      navigation.navigate("Conversation", { id: doc.id, message: message });
    })
    .catch(e => alert(e.message));
  });

  // Get the user"s chats first
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

  // Once order has been set, use the id to get the order"s data
  useEffect(() => {
    if (order) {
      getDoc(doc(db, "Meetings", order)).then((docSnapshot) => {
        const data = docSnapshot.data();
        setData(data);
      });
    }
  }, [order]);

  useEffect(() => {
    if (data) {
      handleChat();
    }
  }, [data]);

  if (loading) {
    return (
      <LoaderScreen color={"#32CD32"} />
    )
  }

  if (items.length == 0) {
    return (
      <View useSafeArea flex style={[global.bgGray, global.center, global.container]}>
        <Text subtitle>Basket is empty</Text>
      </View>
    )
  }

  return (
    <View useSafeArea flex>
      <TouchableWithoutFeedback style={global.flex} onPress={Platform.OS !== "web" && Keyboard.dismiss}>
        <KeyboardAvoidingView style={global.flex} behavior={Platform.OS == "ios" ? "padding" : "height"}>
          <ScrollView contentContainerStyle={global.flex} showsVerticalScrollIndicator={Platform.OS == "web"}>
            <ListItem
              activeOpacity={0.3}
              height={60}
            >
              <ListItem.Part containerStyle={[{paddingHorizontal: 15}]}>
                <Text h2 numberOfLines={1} style={{ color: "black" }}>
                  Basket
                </Text>
              </ListItem.Part>
            </ListItem>

            <BusinessRow item={orderFarmer} />

            <AddressRow item={orderFarmer} />
            
            <ListItem
              activeOpacity={0.3}
              height={60}
            >
              <ListItem.Part containerStyle={[{paddingHorizontal: 15}]}>
                <Text h2 numberOfLines={1} style={{ color: "black" }}>
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
                backgroundColor={Colors.secondary}
                color={Colors.white}
                label={"Send Meeting Request"} 
                labelStyle={{ fontWeight: '600', padding: 8 }} 
                style={global.btnTest} 
                onPress={createOrder}          
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    height: 200,
    width: "100%",
  },
  image: {
    ...Platform.select({
      web: {
        padding: 16,
        width: "100%",
        height: 250,
      },
      ios: {
        padding: 16,
        width: "100%",
        height: 200,
      },
      android: {
        padding: 16,
        width: "100%",
        height: 200,
      },
    }),
  },
  back: {
    position: "absolute",
    left: 10,
    top: 56,
    padding: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 50,
  },
  header: {
    backgroundColor: "white",
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
  content: {
    marginVertical: 4,
    flexDirection: "row",
  },
  ratingContainer: {
    marginLeft: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    color: "#059669",
    flex: 1,
    textAlign: "right",
  },
  address: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    textAlign: "left",
    marginTop: 4,
    marginBottom: 4,
  },
  description: {
    paddingBottom: 16,
    marginTop: 8,
    color: "black",
  },
  products: {
  },
  productsTitle: {
    paddingHorizontal: 16,
    paddingTop: 32,
    marginBottom: 12,
    fontSize: 20,
    lineHeight: 32,
    fontWeight: "700",
  },
  basket: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  text: {
    fontSize: 20,
    lineHeight: 20,
    fontWeight: "bold",
    letterSpacing: 1,
    color: "white",
  },
  cart: {
    padding: 16,
  },
  checkout: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "green",
  },
  checkoutText: {
    color: "white",
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  disabled: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "lightgray",
  },
});

export default Basket