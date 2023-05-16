import React, { memo } from 'react';
import { Colors, ListItem, Text, View } from 'react-native-ui-lib';
import { global } from '../../style';

const TransactionRow = (props) => {
	const {item} = props;

	return (
		<ListItem
			activeOpacity={0.3}
			style={{ backgroundColor: Colors.white, padding: 8, height: "auto" }}
		>
			<ListItem.Part middle column>
				<View row style={global.spaceBetween}>
					<Text h2 numberOfLines={3}>{item.party}</Text>
					<Text h2>{item.type}</Text>
				</View>
				<View row style={global.spaceBetween}>
					<Text h3>{item.category}</Text>
					<Text h3>Price: ${item.price.toFixed(2)}</Text>
				</View>
				<View row style={global.spaceBetween}>
					<Text h3>{item.notes}</Text>
					<Text h3>{item.date.toDate().toLocaleDateString()}</Text>
				</View>
			</ListItem.Part>
		</ListItem>
	)
}

export default memo(TransactionRow);