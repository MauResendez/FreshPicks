import React from 'react'
import { Colors, ListItem, Text } from 'react-native-ui-lib'

const BusinessRow = ({business}) => {
	return (
		<ListItem
			activeOpacity={0.3}
			style={{ backgroundColor: Colors.white, padding: 8, height: "auto" }}
		>
			<ListItem.Part column>
				<Text h2 numberOfLines={3}>Farmer</Text>
				<Text h3>{business}</Text>
			</ListItem.Part>
		</ListItem>
	)
}

export default BusinessRow