import React from 'react'
import { Avatar, ListItem, Text } from 'react-native-ui-lib'

const FarmerSearchRow = ({ farmer, business, address, cover }) => {
	return (
		<ListItem
      activeBackgroundColor={"white"}
      activeOpacity={0.3}
			style={{ backgroundColor: "white", padding: 8, height: "auto" }}
    >
      <ListItem.Part left>
        <Avatar source={{ uri: cover }} size={50} containerStyle={{ marginRight: 8 }}/>
      </ListItem.Part>
      <ListItem.Part column>
        <Text h2 numberOfLines={1}>{business}</Text>
        <Text h3>{address}</Text>
      </ListItem.Part>
    </ListItem>
	)
}

export default FarmerSearchRow