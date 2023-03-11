import React from 'react'
import { Avatar, ListItem, Text } from 'react-native-ui-lib'

const ListingSearchRow = ({ farmer, title, description, price, quantity, cover }) => {
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
        <Text h2 numberOfLines={1}>{title}</Text>
        <Text h3>{description}</Text>
        <Text h3>${price} · {quantity} remaining</Text>
      </ListItem.Part>
    </ListItem>
	)
}

export default ListingSearchRow