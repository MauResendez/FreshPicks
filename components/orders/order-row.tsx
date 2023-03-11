import { useNavigation } from "@react-navigation/native";
import { addDoc, collection, doc, increment, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ListItem, Text, View } from "react-native-ui-lib";
import { auth, db } from "../../firebase";
import Loading from "../extra/loading";

const OrderRow = (order) => {
  const navigation = useNavigation<any>();
  const [status, setStatus] = useState(order.status);
  const [chats, setChats] = useState([]);
  const [chat, setChat] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [loading, setLoading] = useState(true);

  const changeStatus = async (order) => {
    if (visible2) {
      await updateDoc(doc(db, "Orders", order.id), {
        status: status
      });

      order.listings.map(async (listing) => {
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

    await updateDoc(doc(db, "Orders", order.id), {
      status: status
    });

    toggleDialog();

    // // order.listings?.map(async (product) => (
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
    
    const chat = chats.filter(chat => (chat.uid[0] == order.consumer.id || chat.uid[1] == order.consumer.id));

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
    setVisible2(false);
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
    <View>
      {/* <TouchableOpacity
        style={{
          borderBottomWidth: 1,
          borderBottomColor: "lightgray",
          flex: 1,
        }}
        onPress={() => setVisible(true)}
      >
        <ListItem>
          <Column>
            <Row>
              <ListItem.Title style={[global.liItem, global.liTitle]}>
                {order.consumer.name} ({order.createdAt})
              </ListItem.Title>
            </Row>
            <Row>
              <ListItem.Subtitle>Order ID:</ListItem.Subtitle>
              <ListItem.Subtitle>{order.id}</ListItem.Subtitle>
            </Row>
            <Row>
              <ListItem.Subtitle style={[global.liItem, global.liSubtitle]}>
                {order.consumer.address}
              </ListItem.Subtitle>
            </Row>
            <Row>
              <ListItem.Subtitle style={[global.liItem, global.liContent]}>
                Total Cost: ${order.total}
              </ListItem.Subtitle>
            </Row>
          </Column>
        </ListItem>
        {order.listings?.map((product) => {
          return (
            <ListItem>
              <Avatar source={{ uri: product.image }} />
              <ListItem.Content>
                <ListItem.Title>
                  {product.title} x {product.count}
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>
          );
        })}
      </TouchableOpacity> */}
      <ListItem
        activeBackgroundColor={"white"}
        activeOpacity={0.3}
        style={{ backgroundColor: "white", padding: 8, height: "auto" }}
        // onPress={() => setVisible(true)}
        onPress={() => navigation.navigate("Order", { id: order.id })}
      >
        <ListItem.Part left column>
          <Text h2>{order.id}</Text>
          <Text h3 numberOfLines={1}>{order.consumer.name}</Text>
        </ListItem.Part>
        <ListItem.Part right column>
          <Text h2 numberOfLines={1}>{order.createdAt}</Text>
          <Text h3>{order.price}</Text>
        </ListItem.Part>
      </ListItem>
      {/* <Dialog
        isVisible={visible}
        onBackdropPress={toggleDialog}
        overlayStyle={global.bgWhite}
      >
        <Dialog.Title title={"Order ID: " + order.id} />
        <Dialog.Actions>
          {order.status != "COMPLETED" && (
            <SelectDropdown
              data={["PENDING", "DENIED", "COMPLETED"]}
              buttonStyle={global.input}
              rowStyle={global.dropdown}
              onSelect={(selected, index) => {
                setStatus(selected);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                // text represented after item is selected
                // if data array is an array of objects then return selectedItem.property to render after item is selected
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item;
              }}
            />
          )}
        </Dialog.Actions>
        <Dialog.Actions>
          <Button
            buttonStyle={global.button}
            title="Chat with Consumer"
            onPress={handleChat}
          />
        </Dialog.Actions>
        <Dialog.Actions>
          <Dialog.Button
            title="OK"
            onPress={async () => {
              changeStatus(order);
            }}
          />
          <Dialog.Button title="Cancel" onPress={toggleDialog} />
        </Dialog.Actions>
      </Dialog>
      <Dialog
        isVisible={visible2}
        onBackdropPress={toggleDialog}
        overlayStyle={global.bgWhite}
      >
        <Dialog.Title title={"Are you sure you want to complete the order?"} />
        <Dialog.Title
          title={"You won't be able to change the status afterwards."}
        />
        <Dialog.Actions>
          <Dialog.Button
            title="OK"
            onPress={async () => {
              changeStatus(order);
            }}
          />
          <Dialog.Button
            title="Cancel"
            onPress={() => {
              toggleDialog();
              setVisible(true);
            }}
          />
        </Dialog.Actions>
      </Dialog> */}
    </View>
  );
}

export default OrderRow