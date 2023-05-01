import React, { useState } from "react";
import { Colors, ExpandableSection, ListItem, Text, View } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";
import { selectOrderItemsWithId } from "../../features/order-slice";
import { global } from "../../style";

const BasketRow = (product) => {
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
    <ExpandableSection 
      expanded={isPressed} 
      sectionHeader={<ListItem
        activeOpacity={0.3}
        style={{ backgroundColor: Colors.white, padding: 8, height: "auto" }}
        onPress={() => {
          setIsPressed(!isPressed)}
        }
      >
        <ListItem.Part middle column>
          <View row style={global.spaceBetween}>
            <Text h2 numberOfLines={3}>{product.title}</Text>
            <Text h2>${product.price.toFixed(2)}</Text>
          </View>
          <View row style={global.spaceBetween}>
            <Text h3>{product.description}</Text>
            <Text h3>x {product.count}</Text>
          </View>
        </ListItem.Part>
      </ListItem>} 
    >
      {/* <Text>jdslfkjfkl</Text> */}
    </ExpandableSection>
  );
};

    {/* {isPressed && product.quantity > 0 && (
      <View style={global.buttons}>
        <FAB style={styles.left} color="darkred" size="small" icon={<Icon name="remove" color={"white"} size={20} />} onPress={removeItemFromOrder} />
        <Text>{items.length}</Text>
        <FAB style={styles.right} color="green" size="small" icon={<Icon name="add" color={"white"} size={20} />} onPress={addItemToOrder} />
      </View>
    )} */}


export default BasketRow;