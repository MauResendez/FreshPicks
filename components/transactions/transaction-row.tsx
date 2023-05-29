import React, { memo } from 'react';
import { Colors, ListItem, Text, View } from 'react-native-ui-lib';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { global } from '../../style';

const TransactionRow = (props) => {
	const {item} = props;

	return (
		<ListItem
			activeOpacity={0.3}
			style={{ backgroundColor: Colors.white, padding: 8, height: "auto" }}
		>
			<ListItem.Part left>
				{item.type == "Expense" 
					? <MCIcon name={"arrow-left-bold-circle-outline"} size={36} color={Colors.red30} style={{marginRight: 12}} />
					: <MCIcon name={"arrow-right-bold-circle-outline"} size={36} color={"#32CD32"} style={{marginRight: 12}} />
				}
			</ListItem.Part>
			<ListItem.Part middle column>
				
				<View row style={global.spaceBetween}>
					<Text h2 numberOfLines={3}>{item.party}</Text>
					<Text h2>${item.price.toFixed(2)}</Text>
				</View>
				<View row style={global.spaceBetween}>
					<Text h3>{item.category}</Text>
					<Text h3>{item.date.toDate().toLocaleDateString()}</Text>
				</View>
				{/* <View row style={global.spaceBetween}>
					<Text h2>{item.type}</Text>

					<Text h3>{item.notes}</Text>
				</View> */}
			</ListItem.Part>
		</ListItem>
	)
}

export default memo(TransactionRow);