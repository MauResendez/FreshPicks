import { useNavigation } from "@react-navigation/native";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { Avatar, Button, ListItem, Text, View } from "react-native-ui-lib";
import Ionicon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { addToOrder, removeFromOrder, selectOrderItemsWithId } from "../../features/order-slice";
import { auth, db } from "../../firebase";
import { global } from "../../style";

const DisplayRow = (product) => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState(null);
  const [isPressed, setIsPressed] = useState(false);
  const items = useSelector((state) => selectOrderItemsWithId(state, product.id));
  const dispatch = useDispatch();

  const addItemToOrder = (() => {
    dispatch(addToOrder(product));
  });

  const removeItemFromOrder = (() => {
    if (items.length == 0) return;

    dispatch(removeFromOrder(product));
  });

  const deleteListing = async (product) => {
    await deleteDoc(doc(db, "Products", product.id));
  }

  useEffect(() => {
    getDoc(doc(db, "Users", auth.currentUser.uid)).then((docSnapshot) => {
      const data = docSnapshot.data();
      setUser({...data, id: auth.currentUser.uid});
    });
  }, []);

  return (
    <ListItem
      activeBackgroundColor={"white"}
      activeOpacity={0.3}
      style={{ backgroundColor: "white", padding: 8, height: "auto" }}
      onPress={() => setIsPressed(!isPressed)}
    >
      <ListItem.Part left>
        <Avatar source={{ uri: product.image }} size={50} containerStyle={{ marginRight: 8 }} />
      </ListItem.Part>
      <ListItem.Part column>
        <Text h2 numberOfLines={1}>{product.title}</Text>
        <Text h3>{product.description}</Text>
        <Text h3>{product.price.toFixed(2)}</Text>
      </ListItem.Part>
      {!user?.role && isPressed && (
        <View style={global.buttons}>
          <Button style={styles.left} color="darkred" size="small" icon={<Ionicon name="minus" color={"white"} size={20} />} onPress={removeItemFromOrder} />
          <Text>{items.length}</Text>
          <Button style={styles.right} color="green" size="small" icon={<Ionicon name="plus" color={"white"} size={20} />} onPress={addItemToOrder} />
        </View>
      )}
      {user?.role && isPressed && (
        <View style={global.buttons}>
          <Button style={styles.left} color="blue" size="small" icon={<Ionicon name="pencil" color={"white"} size={20} />} onPress={() => navigation.navigate("Edit Listing", { id: product.id })}/>
          <Button 
            style={styles.right} 
            color="darkred" 
            size="small" 
            icon={<Ionicon name="trash" color={"white"} size={20} />} 
            onPress={() => Alert.alert("Delete Chat", "Would you like to delete this post?", [
              {text: 'Cancel', style: 'cancel'},
              {text: 'OK', onPress: async () => await deleteListing(product)},
            ])} 
          />
        </View>
      )}
    </ListItem>
  );
};

const styles = StyleSheet.create({
  productRow: {
    backgroundColor: "white", 
    padding: 16
  },
  row: {
    flexDirection: "row"
  },
  content: {
    paddingRight: 8, 
    flex: 1
  },
  title: {
    color: "black",
    marginBottom: 8,
    fontSize: 16
  },
  description: {
    color: "#9CA3AF",
    fontSize: 14
  },
  price: {
    marginTop: 8,
    color: "#9CA3AF"
  },
  image: {
    padding: 16,
    backgroundColor: "#D1D5DB",
    width: 80, 
    height: 80,
    borderWidth: 1,
    borderColor: "#f3f3f4"
  },
  quantity: {
    marginHorizontal: 12
  },
  buttons: {
    paddingTop: 16, 
    flexDirection: "row", 
    alignItems: "center" ,
    justifyContent: "flex-start"
  },
  left: {
    marginRight: 12
  },
  right: {
    marginLeft: 12
  }
});

export default DisplayRow;