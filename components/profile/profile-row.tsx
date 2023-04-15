import React, { useState } from 'react';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { Colors, Image, ListItem, Stepper, Text, View } from 'react-native-ui-lib';
import { useDispatch, useSelector } from 'react-redux';
import { addToOrder, clearOrder, getOrderFarmer, removeFromOrder, selectOrderItemsWithId } from '../../features/order-slice';
import { global } from '../../style';

const ProfileRow = (product) => {
  const [isPressed, setIsPressed] = useState(false);
  let items = useSelector((state) => selectOrderItemsWithId(state, product.id));
  const orderFarmer = useSelector(getOrderFarmer);
  const dispatch = useDispatch();

  const clearOrderItems = (() => {
    dispatch(clearOrder());
  });

	const updateItemCount = ((value) => {
    if (orderFarmer && product.farmer.id !== orderFarmer.id) {
      Alert.alert("Clear Cart", "Your cart currently has items from another farmer, would you like us to clear it to fill items from this farmer?", [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: clearOrderItems},
      ]);

      return
    }

    if (value < items.length && items.length == 0) return;

		if (value > items.length) {
			dispatch(addToOrder({ product: product, farmer: product.farmer, user: product.user }));
		}
		else if (value < items.length) {
			dispatch(removeFromOrder(product));
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
    <ListItem
      activeBackgroundColor={Colors.grey60}
      activeOpacity={0.3}
      backgroundColor={Colors.white}
      onPress={() => setIsPressed(!isPressed)}
      style={{ borderRadius: 8, marginBottom: 8, padding: 8, height: "auto" }}
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
          <Text h3>Expiring in {product.expiration.toDate().toLocaleDateString()}</Text>
        </View>
        {isPressed && product.quantity > 0 && (
          // <View style={global.buttons}>
          // 	{/* <Button style={{ width: 50, height: 50, margin: 16 }} round onPress={removeItemFromOrder} backgroundColor={Colors.red10} iconSource={() => <Ionicon name="remove" color="white" size={24} />} /> */}
          // 	<Text h3>{items.length}</Text>
          // 	{/* <Button style={{ width: 50, height: 50, margin: 16 }} round onPress={addItemToOrder} backgroundColor={Colors.green30} iconSource={() => <Ionicon name="add" color="white" size={24} />} /> */}
          // </View>
          <Stepper value={items.length} onValueChange={(value) => updateItemCount(value)} style={{ paddingVertical: 32 }} />
        )}
      </ListItem.Part>
    </ListItem>
  );
};

export default ProfileRow;