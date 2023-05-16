import React, { memo, useState } from 'react';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { Colors, ExpandableSection, Image, ListItem, Stepper, Text } from 'react-native-ui-lib';
import { useDispatch, useSelector } from 'react-redux';
import { addToOrder, clearOrder, getOrderFarmer, removeFromOrder, selectOrderItemsWithId } from '../../features/order-slice';

const ProfileRow = (props) => {
  const {item} = props;
  const [isPressed, setIsPressed] = useState(false);
  let items = useSelector((state) => selectOrderItemsWithId(state, item.id));
  const orderFarmer = useSelector(getOrderFarmer);
  const dispatch = useDispatch();

  const clearOrderItems = (() => {
    dispatch(clearOrder());
  });

	const updateItemCount = ((value) => {
    if (orderFarmer && item.farmer.id !== orderFarmer.id) {
      Alert.alert("Clear Basket", "Your cart currently has items from another farmer, would you like us to clear it to fill items from this farmer?", [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: clearOrderItems},
      ]);

      return
    }

    if (value < items.length && items.length == 0) return;

		if (value > items.length) {
			dispatch(addToOrder({ product: item, farmer: item.farmer, user: item.user }));
		}
		else if (value < items.length) {
			dispatch(removeFromOrder(item));
		}

		console.log(value)

		return;
  });

  const showToast = (type, title, message) => {
    Toast.show({
      type: type,
      text1: title,
      text2: message
    });
  }

  return (
    <ExpandableSection 
      expanded={isPressed} 
      sectionHeader={<ListItem
        activeOpacity={0.3}
        backgroundColor={Colors.white}
        onPress={() => setIsPressed(!isPressed)}
        // style={{ borderRadius: 8, marginBottom: 8, padding: 8, height: "auto" }}
        style={{ borderRadius: 8, marginBottom: 4, paddingHorizontal: 8, paddingVertical: 4, height: "auto" }}
      >
        {item.image && <ListItem.Part left>
          <Image source={{ uri: item.image }} style={{ width: 50, height: 50, marginRight: 12 }}/>
        </ListItem.Part>}
        <ListItem.Part middle column>
          <Text h2>{item.title}</Text>
          <Text h3>${item.price.toFixed(2)}</Text>
          <Text h3>{item.quantity} Remaining</Text>
        </ListItem.Part>
      </ListItem>} 
    >
      <ListItem
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