import React, { memo } from 'react';
import { Colors, ListItem, Text } from 'react-native-ui-lib';

const ProductRow = ({ image, title, price, quantity, onPress }) => {
	return (
		<ListItem
			activeOpacity={0.3}
			style={{ backgroundColor: Colors.white, padding: 8, height: "auto", width: "100%" }}
			onPress={onPress}
		>
			<ListItem.Part column>
				<Text h2 numberOfLines={3}>{title}</Text>
				<Text h3>Price: ${price}</Text>
				<Text h3>Quantity: {quantity}</Text>
			</ListItem.Part>
		</ListItem> 
	)
}

export default memo(ProductRow);