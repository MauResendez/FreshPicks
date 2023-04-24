import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Button, LoaderScreen, Text, View } from "react-native-ui-lib";
import Ionicon from "react-native-vector-icons/Ionicons";
import ChatRow from "../../components/chat/chat-row";
import { auth, db } from "../../firebase";
import { global } from "../../style";

const Chat = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    onSnapshot(doc(db, "Users", auth.currentUser.uid), (doc) => {
      setUser(doc.data());
    });
  }, [])

  useEffect(() => {
    if (!user) {
      return;
    }

    if (user.role) {
      onSnapshot(query(collection(db, "Chats"), where("farmer", "==", auth.currentUser.uid)), async (snapshot) => {
        setChats(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
      });
    } else {
      onSnapshot(query(collection(db, "Chats"), where("consumer", "==", auth.currentUser.uid)), async (snapshot) => {
        setChats(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
      });
    }
  }, [user]);

  useEffect(() => {
    if (chats) {
      setLoading(false);
    }
  }, [chats, user]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, []);

  if (loading) {
    return (
      <LoaderScreen color={"#32CD32"} />
    )
  }

  if (chats.length == 0) {
    return (
      <View useSafeArea flex style={[global.container, global.center, global.bgGray]}>
        <Text style={global.subtitle}>Your inbox is empty</Text>
        {!user?.role && <Button style={{ width: 64, height: 64, margin: 16 }} round animateLayout animateTo={'right'} onPress={() => navigation.navigate("Search")} backgroundColor="green" size={Button.sizes.small} iconSource={() => <Ionicon name="search" color="white" size={24} />} />}
      </View>
    )
  }

  return (
    <View useSafeArea flex>
      <FlashList 
        data={chats}
        keyExtractor={(item: any) => item.id}
        estimatedItemSize={chats.length}
        renderItem={({item}) => (
          <ChatRow id={item.id} />
          // <ChatRow chat={item.id} cover={item.cover} title={item.farmer?.name} subtitle={item.messages?.length === 0 ? "No messages" : `${item.messages[0]?.user.name === auth.currentUser.displayName ? "You" : item.messages[0]?.user.name}: ${item.messages[0]?.text}`} />
        )}
      />
      {!user?.role && <Button style={{ width: 64, height: 64, margin: 16 }} round animateLayout animateTo={'right'} onPress={() => navigation.navigate("Search")} backgroundColor="green" size={Button.sizes.small} iconSource={() => <Ionicon name="search" color="white" size={24} />} />}
    </View>
  );
}

export default Chat