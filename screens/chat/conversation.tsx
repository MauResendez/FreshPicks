import { useNavigation, useRoute } from "@react-navigation/native";
import { deleteDoc, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Alert, Platform, StyleSheet } from "react-native";
import { Bubble, GiftedChat, IMessage, Send } from "react-native-gifted-chat";
import { QuickReplies, QuickRepliesProps } from "react-native-gifted-chat/lib/QuickReplies";
import { Colors, LoaderScreen, View } from "react-native-ui-lib";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicon from "react-native-vector-icons/Ionicons";
import Loading from "../../components/extra/loading";
import { auth, db } from "../../firebase";

const renderBubble = props => {
  const margin = Platform.OS != "web" ? 8 : 4;
  return (
    <Bubble {...props} 
      wrapperStyle={{
        right: {
          backgroundColor: "#32CD32",
        },
        left: {
          backgroundColor: Colors.white,
        }
      }}
      textStyle={{
        right: {
          marginLeft: margin,
          color: Colors.white,
        },
        left: {
          marginRight: margin,
          color: Colors.black,
        }
      }}
    />
  )
}

const renderLoading = () => {
  return (
    <Loading />
  )
}

const renderQuickReplies = (props: QuickRepliesProps<IMessage>) => {
  return (
    <QuickReplies
      color="#6A4035"
      quickReplyStyle={styles.quickReply}
      {...props}
    />
  );
};

const renderSend = props => {
  return (
    <Send {...props}>
      <View>
        <Ionicon name="send" size={24} style={{
          marginBottom: 10,
          marginRight: 10
        }}/>
      </View>
    </Send>
  )
}

const Conversation = ({ route }) => {
  const {
    params: {
      id,
      message
    }
  } = useRoute<any>();

  const navigation = useNavigation<any>();
  const [messages, setMessages] = useState(null);
  const [chat, setChat] = useState(null);
  const [consumer, setConsumer] = useState(null);
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const chatsRef = doc(db, "Chats", route.params.id);

  const deleteChat = async (id) => {
    await deleteDoc(doc(db, "Chats", id));
    navigation.navigate("Index");
  }

  const onSend = useCallback(async (m = []) => {
    try {
      await setDoc(chatsRef, {
        messages: GiftedChat.append(messages, m)
      }, {merge: true});

      await fetch("https://us-central1-cfsifreshpicks.cloudfunctions.net/sendMessage", {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'message': m[0].text,
          'sender': auth.currentUser.uid == chat.consumer ? consumer.name : farmer.business,
          'tokens': auth.currentUser.uid == chat.consumer ? farmer.token : consumer.token,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  }, [route.params.id, messages]);

  const sendOrderMessage = async (reply) => {
    setDoc(chatsRef, {
      messages: GiftedChat.append(messages, [reply])
    }, {merge: true});
  }
  
  const scrollToBottomComponent = () => {
    return(
      <FontAwesome name="angle-double-down" size={24} color="#333" />
    );
  }

  useEffect(() => {
    onSnapshot(doc(db, "Chats", route.params.id), (doc) => {
      setChat(doc.data());
    });
  }, []);

  useEffect(() => {
    onSnapshot(chatsRef, async (snapshot) => {
      setMessages(snapshot.data().messages.map(message => ({
        ...message,
        createdAt: message.createdAt.toDate(),
      })));
    });
  }, [route.params.id]);

  useEffect(() => {
    if (chat) {
      // onSnapshot(doc(db, "Users", chat.consumer), (doc) => {
      //   setConsumer({...doc.data(), id: chat.consumer});
      // });
  
      // onSnapshot(doc(db, "Users", chat.farmer), (doc) => {
      //   setFarmer({...doc.data(), id: chat.farmer});
      // });

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

  useLayoutEffect(() => {
    if (chat && consumer && farmer) {
      navigation.setOptions({
        headerTitle: chat.consumer == auth.currentUser.uid ? consumer.name : farmer.name,
        headerRight: () => (
          <View row>
            <Ionicon 
              name={"ellipsis-vertical"} 
              size={24} 
              color={"green"} 
              style={{ marginHorizontal: 16 }} 
              onPress={() => Alert.alert("Delete Chat", "Would you like to delete this chat?", [
                {text: 'Cancel', style: 'cancel'},
                {text: 'OK', onPress: () => deleteChat(id)},
              ])} 
            />
          </View>
        ),
      });
    }
  }, [chat, consumer, farmer]);

  if (loading) {
    return (
      <LoaderScreen color={"#32CD32"} />
    )
  }

  return (
    <View useSafeArea flex>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: auth.currentUser.uid,
          name: chat.consumer == auth.currentUser.uid ? consumer.name : farmer.name,
          avatar: chat.consumer == auth.currentUser.uid ? consumer.logo : farmer.logo,
        }}
        // multiline={false}
        renderBubble={renderBubble}
        renderQuickReplies={renderQuickReplies}
        renderSend={renderSend}
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
        // renderInputToolbar={renderInputToolbar}
        wrapInSafeArea={false}
        bottomOffset={0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  quickReply: {
    backgroundColor: "#FFF9D2",
    borderWidth: 1,
  },
})

export default Conversation