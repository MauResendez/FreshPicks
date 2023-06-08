import React, { memo, useState } from 'react';
import { Alert } from 'react-native';
import { Colors, ExpandableSection, Image, ListItem, Stepper, Text } from 'react-native-ui-lib';
import { useDispatch, useSelector } from 'react-redux';
import { addToOrder, clearOrder, getOrderFarmer, removeFromOrder, selectOrderItemsWithId } from '../../features/order-slice';

const ProfileRow = (props) => {
  const {item, farmer, user} = props;
  const [isPressed, setIsPressed] = useState(false);
  let items = useSelector((state) => selectOrderItemsWithId(state, item.id));
  const orderFarmer = useSelector(getOrderFarmer);
  const dispatch = useDispatch();

  const clearOrderItems = (() => {
    dispatch(clearOrder());
  });

	const updateItemCount = ((value) => {
    if (orderFarmer && farmer.id !== orderFarmer.id) {
      Alert.alert("Clear Basket", "Your cart currently has items from another farmer, would you like us to clear it to fill items from this farmer?", [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: clearOrderItems},
      ]);

      return
    }

    if (value < items.length && items.length == 0) return;

		if (value > items.length) {
      console.log(item);
			dispatch(addToOrder({ product: item, farmer: farmer, user: user }));
      console.log(farmer);
      console.log(user);
		} else if (value < items.length) {
			dispatch(removeFromOrder(item));
		}

		return;
  });

  return (
    <ExpandableSection
      key={item.id}
      expanded={isPressed} 
      sectionHeader={<ListItem
        key={item.id}
        activeOpacity={0.3}
        backgroundColor={Colors.white}
        onPress={() => setIsPressed(!isPressed)}
        style={{ borderRadius: 8, marginBottom: 4, paddingHorizontal: 8, paddingVertical: 4, height: "auto" }}
      >
        {item.image && <ListItem.Part left>
          <Image source={{ uri: item.image[0] }} style={{ width: 50, height: 50, marginRight: 12, borderWidth: 1, borderColor: Colors.black }}/>
        </ListItem.Part>}
        <ListItem.Part middle column>
          <Text text65 marginV-4>{item.title}</Text>
          <Text text80M grey30 marginV-4>${item.price.toFixed(2)}</Text>
        </ListItem.Part>
      </ListItem>} 
    >
      <ListItem
        key={item.id}
        activeBackgroundColor={Colors.grey60}
        activeOpacity={0.3}
        backgroundColor={Colors.white}
        onPress={() => setIsPressed(!isPressed)}
        style={{ borderRadius: 8, paddingHorizontal: 8, height: "auto" }}
      >
        <ListItem.Part middle column>
          <Stepper value={items.length} onValueChange={(value) => updateItemCount(value)} useCustomTheme={true} />
        </ListItem.Part>
      </ListItem>
    </ExpandableSection>
  );
};

export default memo(ProfileRow);