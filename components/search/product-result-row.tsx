import React from 'react';
import { ListItem, Text } from 'react-native-ui-lib';

const ProductResultRow = (props) => {
  const {item} = props;

	return (
		<ListItem
      activeBackgroundColor={"white"}
      activeOpacity={0.3}
			style={{ backgroundColor: "white", padding: 8, height: "auto" }}
    >
      <ListItem.Part column>
        <Text h2 numberOfLines={1}>{item.title}</Text>
        <Text h3>${item.price.toFixed(2)}/{item.amount}</Text>
      </ListItem.Part>
    </ListItem>
	)
}

export default ProductResultRow