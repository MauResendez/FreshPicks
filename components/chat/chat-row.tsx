import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import React, { memo, useEffect, useState } from "react";
import { ListItem, Text } from "react-native-ui-lib";
import { auth, db } from "../../firebase";

const ChatRow = (props) => {
  const {item} = props;
  const navigation = useNavigation<any>();
  const [chat, setChat] = useState(null);
  const [consumer, setConsumer] = useState(null);
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);

  const conversation = () => {
    navigation.navigate("Conversation", { id: item.id })
  }

  useEffect(() => {
    onSnapshot(doc(db, "Chats", item.id), (doc) => {
      setChat(doc.data());
    });
  }, []);

  useEffect(() => {
    if (chat) {
      getDoc(doc(db, "Users", chat.consumer)).then((docSnapshot) => {
        const data = docSnapshot.data();
    
        setConsumer({...data, id: chat.consumer});
      });
  
      getDoc(doc(db, "Users", chat.farmer)).then((docSnapshot) => {
        const data = docSnapshot.data();
    
        setFarmer({...data, id: chat.farmer});
      });
    }
  }, [chat]);

  useEffect(() => {
    if (consumer && farmer) {
      setLoading(false);
    }
  }, [consumer, farmer]);

  if (loading) {
    return (
      <ListItem
        activeBackgroundColor={"white"}
        activeOpacity={0.3}
        style={{ backgroundColor: "white", padding: 8, height: "auto" }}
        onPress={conversation}
      >
        <ListItem.Part column>
          <Text h2 numberOfLines={1}>Loading...</Text>
        </ListItem.Part>
      </ListItem>
    )
  }

  return (
    <ListItem
      activeBackgroundColor={"white"}
      activeOpacity={0.3}
			style={{ backgroundColor: "white", padding: 8, height: "auto" }}
      onPress={conversation}
    >
      <ListItem.Part column>
        <Text h2 numberOfLines={1}>{farmer.business}</Text>
        <Text h3>{chat.messages?.length === 0 ? "No messages" : `${chat.messages[0]?.user.name === auth.currentUser.displayName ? "You" : chat.messages[0]?.user.name}: ${chat.messages[0]?.text}`}</Text>
      </ListItem.Part>
    </ListItem>
  )
}

export default memo(ChatRow);