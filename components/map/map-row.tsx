import { useNavigation } from '@react-navigation/native';
import React, { memo } from 'react';
import { Colors, ListItem, Text } from 'react-native-ui-lib';

const MapRow = (props) => {
	const {item} = props;
	const navigation = useNavigation<any>();

	const onPress = () => {
    navigation.navigate("Profile", { id: item.id })
  }

	return (
		<ListItem
			activeOpacity={0.3}
			style={{ backgroundColor: Colors.white, padding: 8, height: "auto" }}
			onPress={onPress}
		>
			<ListItem.Part column>
				<Text h2 numberOfLines={3}>{item.business}</Text>
				<Text h3>{item.address}</Text>
				<Text h3>{item.name}</Text>
			</ListItem.Part>
		</ListItem> 
	)
}

export default memo(MapRow);