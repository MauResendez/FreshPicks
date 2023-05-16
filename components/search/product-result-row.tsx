import React from 'react';
import { Avatar, ListItem, Text } from 'react-native-ui-lib';

const ProductResultRow = (props) => {
  const {item} = props;

	return (
		<ListItem
      activeBackgroundColor={"white"}
      activeOpacity={0.3}
			style={{ backgroundColor: "white", padding: 8, height: "auto" }}
    >
      <ListItem.Part left>
        <Avatar source={{ uri: item.cover }} size={50} containerStyle={{ marginRight: 8 }}/>
      </ListItem.Part>
      <ListItem.Part column>
        <Text h2 numberOfLines={1}>{item.title}</Text>
        <Text h3>{item.description}</Text>
        <Text h3>${item.price} · {item.quantity} remaining</Text>
      </ListItem.Part>
    </ListItem>
	)
}

export default ProductResultRow