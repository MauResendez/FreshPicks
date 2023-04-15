import { useNavigation } from "@react-navigation/native";
import { addDoc, collection, doc, increment, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ListItem, LoaderScreen, Text, View } from "react-native-ui-lib";
import { auth, db } from "../../firebase";

const MeetingRow = ({ id, listings, consumer, farmer, total, status, createdAt }) => {
  const navigation = useNavigation<any>();
  const [chats, setChats] = useState([]);
  const [chat, setChat] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [loading, setLoading] = useState(true);

  const changeStatus = async (order) => {
    if (visible2) {
      await updateDoc(doc(db, "Meetings", id), {
        status: status
      });

      listings.map(async (listing) => {
        await updateDoc(doc(db, "Listings", listing.id), {
          quantity: increment(-listing.count)
        });
      });

      toggleDialog();
      return
    }

    if (status == "COMPLETED") {
      toggleDialog();
      setVisible2(true);
      return
    }

    await updateDoc(doc(db, "Meetings", id), {
      status: status
    });

    toggleDialog();

    // // listings?.map(async (product) => (
    // //   await updateDoc(doc(db, "Listings", product.id), {
    // //     quantity: product.quantity - product.count
    // //   })
    // // ));

    // toggleDialog();
  }

  const handleChat = async () => {
    // Check user if they have current farmer id saved in chatted
    // If there isn"t, create a chat and 
    // Find a chat that has both ids in the chat
    
    const chat = chats.filter(chat => (chat.uid[0] == consumer || chat.uid[1] == consumer));

    if (chat.length != 0) {
      setChat(chat);
      navigation.navigate("Conversation", {id: chat[0]?.id});
      toggleDialog();
      return
    }

    await addDoc(collection(db, "Chats"), {
      users: [consumer, farmer],
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
    setVisible2(false);
  }

  useEffect(() => {
    onSnapshot(query(collection(db, "Chats"), where("uid", "array-contains", auth.currentUser.uid)), async (snapshot) => {
      setChats(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    });
  }, []);

  useEffect(() => {
    if (chats) {
      setLoading(false);
    }
  }, [chats]);

  if (loading) {
    return (
      <LoaderScreen color={"#32CD32"} />
    )
  }

  return (
    <View>
      <ListItem
        activeBackgroundColor={"white"}
        activeOpacity={0.3}
        style={{ backgroundColor: "white", padding: 8, height: "auto" }}
        onPress={() => navigation.navigate("Order", { id: id })}
      >
        <ListItem.Part left column>
          <Text h2>{id}</Text>
          <Text h3 numberOfLines={1}>{consumer}</Text>
        </ListItem.Part>
        <ListItem.Part right column>
          {/* <Text h2 numberOfLines={1}>{createdAt}</Text> */}
          <Text h3>{total}</Text>
        </ListItem.Part>
      </ListItem>
    </View>
  );
}

export default MeetingRow