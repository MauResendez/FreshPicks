import React, { memo, useState } from "react";
import { Colors, ExpandableSection, ListItem, Text, View } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";
import { selectOrderItemsWithId } from "../../features/order-slice";
import { global } from "../../style";

const BasketRow = (props) => {
  const {item, count} = props;
  const [isPressed, setIsPressed] = useState(true);
  const items = useSelector((state) => selectOrderItemsWithId(state, item.id));
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
            <Text h2 numberOfLines={3}>{item.title}</Text>
            <Text h2>${item.price.toFixed(2)}</Text>
          </View>
          <View row style={global.spaceBetween}>
            <Text h3>{item.description}</Text>
            <Text h3>x {count}</Text>
          </View>
        </ListItem.Part>
      </ListItem>} 
    >
    </ExpandableSection>
  );
};

export default memo(BasketRow);