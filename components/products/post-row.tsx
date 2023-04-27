import React, { memo } from 'react';
import { Colors, ListItem, Text } from 'react-native-ui-lib';

const PostRow = ({ image, title, description, onPress }) => {
	return (
		<ListItem
			activeOpacity={0.3}
			style={{ backgroundColor: Colors.white, padding: 8, height: "auto", width: "100%" }}
			onPress={onPress}
		>
			<ListItem.Part column>
				<Text h2 numberOfLines={3}>{title}</Text>
				<Text h3>{description}</Text>
			</ListItem.Part>
		</ListItem> 
	)
}

export default memo(PostRow);