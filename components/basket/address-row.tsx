import React, { memo } from 'react';
import { Colors, ListItem, Text } from 'react-native-ui-lib';

const AddressRow = (props) => {
	const {item} = props;

	return (
		<ListItem
			activeOpacity={0.3}
			style={{ backgroundColor: Colors.white, padding: 8, height: "auto" }}
		>
			<ListItem.Part column>
				<Text h2 numberOfLines={3}>Address (Meeting Location)</Text>
				<Text h3>{item.address}</Text>
			</ListItem.Part>
		</ListItem>
	)
}

export default memo(AddressRow);