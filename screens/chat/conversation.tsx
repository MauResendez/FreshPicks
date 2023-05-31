import { useNavigation, useRoute } from "@react-navigation/native";
import { deleteDoc, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Alert, Platform, StyleSheet } from "react-native";
import { Bubble, GiftedChat, IMessage, Send } from "react-native-gifted-chat";
import { QuickReplies, QuickRepliesProps } from "react-native-gifted-chat/lib/QuickReplies";
import { Colors, LoaderScreen, Text, View } from "react-native-ui-lib";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicon from "react-native-vector-icons/Ionicons";
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
    <LoaderScreen color={"#32CD32"} />
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
    navigation.goBack();
  }

  const quickReplies = [
    {
      text: 'Send location',
      value: {
        location: {
          latitude: 37.78825,
          longitude: -122.4324,
        }
      }
    },
    {
      text: 'Send message',
      value: 'Hello!',
    },
  ];

  const renderQuickReplies = (props) => {
    return <QuickReplies quickReplies={quickReplies} color={Colors.blue20} {...props} />;
  };

  const handleQuickReply = (value) => {
    if (value.location) {
      // Send location to messaging system
    } else {
      // Send message to messaging system
    }
  }

  const renderQuickReplySend = () => {
    return (
      <Send>
        <Text>Send</Text>
      </Send>
    );
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

  useLayoutEffect(() => {
    if (chat && consumer && farmer) {
      navigation.setOptions({
        headerTitle: chat?.consumer == auth.currentUser.uid ? consumer.name : farmer.name,
        headerRight: () => (
          <View row>
            <Ionicon 
              name={"ellipsis-vertical"} 
              size={24} 
              color={"black"} 
              style={{ marginHorizontal: 8 }} 
              onPress={() => Alert.alert("Delete Chat", "Would you like to delete this chat?", [
                {text: 'Cancel', style: 'cancel'},
                {text: 'OK', onPress: () => deleteChat(id)},
              ])} 
            />
          </View>
        ),
      });

      setLoading(false);
    }
  }, [chat, consumer, farmer]);

  if (loading) {
    return (
      <LoaderScreen color={"#32CD32"} />
    )
  }

  const onQuickReply = replies => {
    const createdAt = new Date()
    if (replies.length === 1) {
      onSend([
        {
          createdAt,
          _id: Math.round(Math.random() * 1000000),
          text: replies[0].title,
          user: auth.currentUser.uid,
        },
      ])
    } else if (replies.length > 1) {
      onSend([
        {
          createdAt,
          _id: Math.round(Math.random() * 1000000),
          text: replies.map(reply => reply.title).join(', '),
          user: auth.currentUser.uid,
        },
      ])
    } else {
      console.warn('replies param is not set correctly')
    }
  }

  return (
    <View useSafeArea flex>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: auth.currentUser.uid,
          name: chat?.consumer == auth.currentUser.uid ? consumer.name : farmer.name,
        }}
        // multiline={false}
        alwaysShowSend={true}
        onQuickReply={onQuickReply}
        renderBubble={renderBubble}
        renderSend={renderSend}
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
        // isTyping={true}
        // renderInputToolbar={renderInputToolbar}
        showUserAvatar={false}
        bottomOffset={Platform.OS == "android" ? 0 : 80}
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