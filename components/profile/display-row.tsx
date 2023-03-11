import { useNavigation } from "@react-navigation/native";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, Image, ImageBackground, StyleSheet } from "react-native";
import { Button, ListItem, Text, View } from "react-native-ui-lib";
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
      // Toast.show("You have reached the maximum remaining left for this product", {
      //   duration: Toast.durations.SHORT,
      //   backgroundColor: "blue",
      //   position: Platform.OS == "web" ? 650 : 700
      // });
    }
  });

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

  const clearOrderItems = (() => {
    dispatch(clearOrder());
  });

  const deleteListing = async (product) => {
    await deleteDoc(doc(db, "Listings", product.id));
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
    <ListItem
      activeBackgroundColor={"white"}
      activeOpacity={0.3}
      style={{ backgroundColor: "white", padding: 8, height: "auto" }}
      onPress={() => setIsPressed(!isPressed)}
    >
      <ListItem.Part left>
        {/* <Avatar source={{ uri: product.image }} size={50} containerStyle={{ marginRight: 8 }}/> */}
        <View>
          {product.quantity > 0 
          ? <Image source={{ uri: product.image }} style={styles.image} />
          : <ImageBackground source={{ uri: product.image }} style={styles.image} imageStyle={{ opacity: 0.2 }}>
              <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontWeight: "bold", textAlign: "center" }}>Out of stock</Text>
              </View>
            </ImageBackground>
          }
        </View>
      </ListItem.Part>
      <ListItem.Part column>
        <Text h2 numberOfLines={1}>{product.title}</Text>
        <Text h3>{product.description}</Text>
        <Text h3>{product.price.toFixed(2)}</Text>
      </ListItem.Part>
      {!user?.role && isPressed && product.quantity > 0 && (
        <View style={global.buttons}>
          <Button style={styles.left} color="darkred" size="small" icon={<Ionicon name="remove" color={"white"} size={20} />} onPress={removeItemFromOrder} />
          <Text>{items.length}</Text>
          <Button style={styles.right} color="green" size="small" icon={<Ionicon name="add" color={"white"} size={20} />} onPress={addItemToOrder} />
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
            onPress={() => Alert.alert("Delete Chat", "Would you like to delete this listing?", [
              {text: 'Cancel', style: 'cancel'},
              {text: 'OK', onPress: async () => deleteListing(product)},
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