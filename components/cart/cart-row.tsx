import React, { useState } from "react";
import { Avatar, ListItem, Text } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";
import { selectOrderItemsWithId } from "../../features/order-slice";

const CartRow = (product) => {
  const [isPressed, setIsPressed] = useState(true);
  const items = useSelector((state) => selectOrderItemsWithId(state, product.id));
  const dispatch = useDispatch();

  // const addItemToOrder = (() => {
  //   dispatch(addToOrder({ product: product, farmer: product.farmer }));
  // });

  // const removeItemFromOrder = (() => {
  //   if (items.length == 0) return;

  //   dispatch(removeFromOrder(product));
  // });

  return (

    <ListItem
      activeBackgroundColor={"white"}
      activeOpacity={0.3}
      style={{ backgroundColor: "white", padding: 8, height: "auto" }}
      onPress={() => setIsPressed(!isPressed)}
    >
      <ListItem.Part left>
        <Avatar source={{ uri: product.image }} size={50} containerStyle={{ marginRight: 8 }}/>
      </ListItem.Part>
      <ListItem.Part column>
        <Text h2 numberOfLines={1}>{product.title}</Text>
        <Text h3>{product.description}</Text>
        <Text h3>{product.price.toFixed(2)}</Text>
      </ListItem.Part>
    </ListItem>

  );
};

    {/* {isPressed && product.quantity > 0 && (
      <View style={global.buttons}>
        <FAB style={styles.left} color="darkred" size="small" icon={<Icon name="remove" color={"white"} size={20} />} onPress={removeItemFromOrder} />
        <Text>{items.length}</Text>
        <FAB style={styles.right} color="green" size="small" icon={<Icon name="add" color={"white"} size={20} />} onPress={addItemToOrder} />
      </View>
    )} */}


export default CartRow;