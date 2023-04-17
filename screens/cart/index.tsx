import { useNavigation } from '@react-navigation/native';
import { addDoc, collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useMemo, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { LoaderScreen, Text, View } from 'react-native-ui-lib';
import { useDispatch, useSelector } from 'react-redux';
import CartRow from '../../components/cart/cart-row';
import { clearOrder, getOrderFarmer, getOrderUser, selectOrderItems, selectOrderTotal } from '../../features/order-slice';
import { db } from '../../firebase';
import { global } from '../../style';

const Cart = () => {
  const navigation = useNavigation<any>();
  const [active, setActive] = useState(0);
  const [completedStep, setCompletedStep] = useState(undefined);
  const [chat, setChat] = useState<any>(null);
  const [chats, setChats] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [visible, setVisible] = useState(false);
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
      obj.farmer = curr.farmer;
      obj.image = curr.image;
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
    })
      .then(async (doc) => {
        // Toast.show("Order has been confirmed!", {
        //   duration: Toast.durations.SHORT,
        //   backgroundColor: "green",
        //   position: Platform.OS == "web" ? 650 : 700,
        // });

        // console.log("Setting order...");

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

  const toggleDialog = () => {
    setVisible(false);
  }

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
      console.log("Getting data...");

      getDoc(doc(db, "Meetings", order)).then((docSnapshot) => {
        const data = docSnapshot.data();
        setData(data);
      });
    }
  }, [order]);

  useEffect(() => {
    if (data) {
      console.log("Handling chat...");
      handleChat();
    }
  }, [data]);

  useEffect(() => {
    if (isPressed) {
      console.log(isPressed);
    }
  }, [isPressed]);

  if (loading) {
    return (
      <LoaderScreen color={"#32CD32"} />
    )
  }

  if (items.length == 0) {
    return (
      <View useSafeArea flex style={[global.container, global.center, global.bgGray]}>
        <Text subtitle>Cart is empty</Text>
      </View>
    )
  }

  return (
    <View useSafeArea flex style={global.bgWhite}>
      <TouchableWithoutFeedback style={global.flex} onPress={Platform.OS !== "web" && Keyboard.dismiss}>
        <KeyboardAvoidingView style={global.flex} behavior={Platform.OS == "ios" ? "padding" : "height"}>
          <ScrollView style={global.container} contentContainerStyle={[global.flex]} showsVerticalScrollIndicator={Platform.OS == "web"}>
            <View style={global.field}>
              <Text title>Checkout</Text>
            </View>

            <View style={global.field}>
              <Text subtitle>Farmer</Text>
              <Text h3>{(items[0]?.farmer.business)}</Text>
            </View>

            <View style={global.field}>
              <Text subtitle>Address</Text>
              <Text h3>{items[0]?.farmer.address}</Text>
            </View>
            
            <Text subtitle>Your Items</Text>

            {Object.entries(groupedItems).map(([key, items]: any) => (
              <CartRow
                key={key}
                id={items[0]?.id}
                title={items[0]?.title}
                description={items[0]?.description}
                price={items[0]?.price}
                image={items[0]?.image}
                quantity={items[0]?.quantity}
                count={items.length}
                farmer={items[0]?.farmer}
              />
            ))}

            <View flexG />

            <View style={global.field}>
              <TouchableOpacity style={[global.btn, global.bgOrange]} onPress={createOrder}>
                <Text style={[global.btnText, global.white]}>Send Meeting Request</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default Cart