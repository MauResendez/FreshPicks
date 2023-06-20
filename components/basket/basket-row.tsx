import React, { memo, useState } from "react";
import { Colors, ExpandableSection, Image, ListItem, Text, View } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";
import { selectOrderItemsWithId } from "../../features/order-slice";

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
        {item.images && <ListItem.Part left>
          <Image source={{ uri: item.images[0] }} style={{ width: 50, height: 50, marginRight: 8 }} />
        </ListItem.Part>}
        <ListItem.Part middle column>
          <View row spread>
            <Text text65 marginV-4 numberOfLines={1}>{item.title}</Text>
            <Text text65 marginV-4>${item.price.toFixed(2)}</Text>
          </View>
          <View row spread>
            <Text text80M grey30 marginV-4>{item.description}</Text>
            <Text text80M grey30 marginV-4>x {count}</Text>
          </View>
        </ListItem.Part>
      </ListItem>} 
    >
    </ExpandableSection>
  );
};

export default memo(BasketRow);