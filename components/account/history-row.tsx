import { useNavigation } from "@react-navigation/native";
import { addDoc, collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Colors, ListItem, Text } from "react-native-ui-lib";
import { auth, db } from "../../firebase";
import { global } from "../../style";
import Loading from "../extra/loading";

const HistoryRow = (order) => {
  const navigation = useNavigation<any>();
  const [chats, setChats] = useState([]);
  const [chat, setChat] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleChat = async () => {
    // Check user if they have current farmer id saved in chatted
    // If there isn't, create a chat and 
    // Find a chat that has both ids in the chat
    
    const chat = chats.filter(chat => (chat.uid[0] == order.farmer.id || chat.uid[1] == order.farmer.id));

    if (chat.length != 0) {
      setChat(chat);
      navigation.navigate("Conversation", {id: chat[0]?.id});
      toggleDialog();
      return
    }

    await addDoc(collection(db, "Chats"), {
      users: [order.consumer, order.farmer],
      uid: [order.consumer.id, order.farmer.id],
      messages: []
    })
    .then((doc) => {
      navigation.navigate("Conversation", {id: doc?.id});
      toggleDialog();
    })
    .catch(e => alert(e.message));
  }

  const toggleDialog = () => {
    setVisible(false);
  }

  useEffect(() => {
    onSnapshot(query(collection(db, "Chats"), where("uid", "array-contains", auth.currentUser.uid)), async (snapshot) => {
      setChats(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    });
  }, []);

  useEffect(() => {
    if (order && chats) {
      setLoading(false);
    }
  }, [order, chats]);

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <TouchableOpacity onPress={() => navigation.navigate("Order")}>
      {/* <ListItem>
        <Column>
          <Row>
            <ListItem.Title style={[global.liItem, global.liTitle]}>{order.farmer.business} ({order.createdAt})</ListItem.Title>
          </Row> */}
          {/* <Row>
            <ListItem.Subtitle>Order ID:</ListItem.Subtitle>
            <ListItem.Subtitle>{order.id}</ListItem.Subtitle>
          </Row> */}
          {/* <Row>
            <ListItem.Subtitle style={[global.liItem, global.liSubtitle]}>{order.farmer?.address}</ListItem.Subtitle>
          </Row>
          <Row>
            <ListItem.Subtitle style={[global.liItem, global.liContent]}>Total Cost: ${order.total}</ListItem.Subtitle>
          </Row>
        </Column>
      </ListItem> */}

      {order.listings?.map((product) => {
        return (
          // <ListItem>
          //   <Avatar source={{ uri: product.image }} />
          //   <ListItem.Content>
          //     <ListItem.Title>{product.title} x {product.count}</ListItem.Title>
          //   </ListItem.Content>
          // </ListItem>
          <ListItem
            activeBackgroundColor={Colors.grey60}
            activeOpacity={0.3}
            height={75}
            style={global.spaceBetween}
          >
            
            <ListItem.Part middle column containerStyle={{padding: 15}}>
              <Text h2 numberOfLines={1}>Order ID: {order.id}</Text>
              <Text h3 numberOfLines={1}>{order.farmer.business}</Text>
            </ListItem.Part>
            <ListItem.Part right containerStyle={{padding: 15}}>
              <Text h2 numberOfLines={1}>{order.farmer?.address}</Text>
              <Text h3 numberOfLines={1}>Total Cost: ${order.total}</Text>
            </ListItem.Part>
          </ListItem>
        );
      })}
    </TouchableOpacity>
  )
}

export default HistoryRow