import React, { memo } from 'react';
import { Colors, ListItem, Text } from 'react-native-ui-lib';

const SubscriptionRow = ({ image, title, price, onPress }) => {
	return (
		<ListItem
			activeOpacity={0.3}
			style={{ backgroundColor: Colors.white, padding: 8, height: "auto", width: "100%" }}
			onPress={onPress}
		>
			<ListItem.Part column>
				<Text h2 numberOfLines={3}>{title}</Text>
				<Text h3>Price: ${price}</Text>
			</ListItem.Part>
		</ListItem> 
	)
}

export default memo(SubscriptionRow);