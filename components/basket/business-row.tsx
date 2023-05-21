import React, { memo } from 'react';
import { Colors, ListItem, Text } from 'react-native-ui-lib';

const BusinessRow = (props) => {
	const {item} = props;

	return (
		<ListItem
			activeOpacity={0.3}
			style={{ backgroundColor: Colors.white, padding: 8, height: "auto" }}
		>
			<ListItem.Part column>
				<Text h2 numberOfLines={3}>Farmer</Text>
				<Text h3>{item.business}</Text>
			</ListItem.Part>
		</ListItem>
	)
}

export default memo(BusinessRow);