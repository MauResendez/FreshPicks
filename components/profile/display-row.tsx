import { useNavigation } from "@react-navigation/native";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import { Button, Colors, Image, ListItem, Text, View } from "react-native-ui-lib";
import Ionicon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { addToOrder, clearOrder, getOrderFarmer, getOrderUser, removeFromOrder, selectOrderItemsWithId } from "../../features/order-slice";
import { auth, db } from "../../firebase";
import { global } from "../../style";

const DisplayRow = (product) => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState(null);
  const [isPressed, setIsPressed] = useState(false);
  let items = useSelector((state) => selectOrderItemsWithId(state, product.id));
  const orderFarmer = useSelector(getOrderFarmer);
  const orderUser = useSelector(getOrderUser);
  const dispatch = useDispatch();

  const addItemToOrder = (() => {
    if (orderFarmer && product.farmer.id !== orderFarmer.id) {
      Alert.alert("Clear Cart", "Your cart currently has items from another farmer, would you like us to clear it to fill items from this farmer?", [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: clearOrderItems},
      ]);

      return
    }

    if (product.quantity > items.length) {
      dispatch(addToOrder({ product: product, farmer: product.farmer, user: product.user }));
    } else {
      showToast("error", "Error", "You have reached the maximum remaining left for this product");
    }
  });

  const clearOrderItems = (() => {
    dispatch(clearOrder());
  });

  const deleteListing = async (product) => {
    await deleteDoc(doc(db, "Products", product.id));
  }

  const removeItemFromOrder = (() => {
    if (orderFarmer && product.farmer.id !== orderFarmer.id) {
      Alert.alert("Clear Cart", "Your cart currently has items from another farmer, would you like us to clear it to fill items from this farmer?", [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: clearOrderItems},
      ]);

      return
    }

    if (items.length == 0) return;

    dispatch(removeFromOrder(product));
  });

  const showToast = (type, title, message) => {
    Toast.show({
      type: type,
      text1: title,
      text2: message
    });
  }

  useEffect(() => {
    getDoc(doc(db, "Users", auth.currentUser.uid)).then((docSnapshot) => {
      const data = docSnapshot.data();
      setUser({...data, id: auth.currentUser.uid});
    });
  }, []);

  useEffect(() => {
    if (items.length > product.quantity) {
      let diff = items.length - product.quantity;
      for (let i = 0; i < diff; i++) {
        removeItemFromOrder();
      }
    }
  }, [product.quantity]);

  return (
    <View>
      {/* <ListItem
        activeBackgroundColor={"white"}
        activeOpacity={0.3}
        style={{ backgroundColor: "white", padding: 8, height: "auto" }}
        onPress={() => setIsPressed(!isPressed)}
      >
        <ListItem.Part left>
          {product.quantity > 0 
            ? <Avatar source={{ uri: product.image }} size={75} containerStyle={{ marginRight: 8 }}/>
            : <Avatar source={{ uri: product.image }} size={75} imageStyle={{ opacity: 0.2 }}>
                <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center" }}>
                  <Text style={{ fontWeight: "bold", textAlign: "center" }}>Out of stock</Text>
                </View>
              </Avatar>
          }
        </ListItem.Part>
        <ListItem.Part column>
          <Text h2 numberOfLines={1}>{product.title}</Text>
          <Text h3>{product.description}</Text>
          <Text h3>${product.price.toFixed(2)}</Text>
        </ListItem.Part>
      </ListItem> */}
      <ListItem
        activeBackgroundColor={Colors.grey60}
        activeOpacity={0.3}
        backgroundColor={Colors.white}
        onPress={() => Alert.alert(product.title, product.description, [
          {text: 'Edit', onPress: () => navigation.navigate("Edit Listing", { id: product.id })},
          {text: 'Cancel', style: 'cancel'},
          {text: 'Delete', onPress: async () => deleteListing(product)},
        ])}
        style={{ borderRadius: 8, marginBottom: 8, padding: 8 }}
      >
        <ListItem.Part left>
          <Image source={{ uri: product.image }} style={{ width: 50, height: 50, marginRight: 12 }}/>
        </ListItem.Part>
        <ListItem.Part middle column>
          <View row style={global.spaceBetween}>
            <Text h2>{product.title}</Text>
            <Text h2>${product.price.toFixed(2)}</Text>
          </View>
          <View row style={global.spaceBetween}>
            <Text h3>{product.quantity} remaining</Text>
            {/* <Text h3>Expiring in {product.expiration.toDate().toLocaleDateString()}</Text> */}
          </View>
        </ListItem.Part>
      </ListItem>
      <ListItem
        activeBackgroundColor={"white"}
        activeOpacity={0.3}
        style={{ backgroundColor: "white", height: "auto" }}
        onPress={() => setIsPressed(!isPressed)}
      >
        <ListItem.Part column>
          {!user?.role && isPressed && product.quantity > 0 && (
            <View style={global.buttons}>
              <Button style={{ width: 50, height: 50, margin: 16 }} round onPress={removeItemFromOrder} backgroundColor={Colors.red10} iconSource={() => <Ionicon name="remove" color="white" size={24} />} />
              <Text>{items.length}</Text>
              <Button style={{ width: 50, height: 50, margin: 16 }} round onPress={addItemToOrder} backgroundColor={Colors.green30} iconSource={() => <Ionicon name="add" color="white" size={24} />} />
            </View>
          )}
          {user?.role && isPressed && (
            <View style={global.buttons}>
              <Button style={styles.left} color="blue" size={Button.sizes.large} iconSource={() => <Ionicon name="pencil" color={"white"} size={20} />} onPress={() => navigation.navigate("Edit Listing", { id: product.id })}/>
              <Button 
                style={styles.right} 
                color="darkred" 
                size={Button.sizes.large} 
                iconSource={() => <Ionicon name="trash" color={"white"} size={20} />} 
                onPress={() => Alert.alert("Delete Chat", "Would you like to delete this listing?", [
                  {text: 'Cancel', style: 'cancel'},
                  {text: 'OK', onPress: async () => deleteListing(product)},
                ])} 
              />          
            </View>
          )}
        </ListItem.Part>
      </ListItem>
    </View>
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