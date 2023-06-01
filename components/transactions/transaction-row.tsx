import { useNavigation } from '@react-navigation/native';
import { deleteDoc, doc } from 'firebase/firestore';
import React, { memo } from 'react';
import { Alert } from 'react-native';
import { Colors, ListItem, Text, View } from 'react-native-ui-lib';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { db } from '../../firebase';
import { global } from '../../style';

const TransactionRow = (props) => {
	const {item} = props;
	const navigation = useNavigation<any>();

	const deleteItem = async (item, collection) => {
    await deleteDoc(doc(db, collection, item.id));
  }

	const onPress = () => {
		Alert.alert(item.party, item.category, [
			{text: 'Edit', onPress: () => navigation.navigate("Edit Transaction", { id: item.id })},
			{text: 'Cancel', style: 'cancel'},
			{text: 'Delete', onPress: async () => deleteItem(item, "Transactions")},
		])
	}

	return (
		<ListItem
			activeOpacity={0.3}
			style={{ backgroundColor: Colors.white, padding: 8, height: "auto" }}
			onPress={onPress}
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
			</ListItem.Part>
		</ListItem>
	)
}

export default memo(TransactionRow);