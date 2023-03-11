import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ListItem, Text } from 'react-native-ui-lib';

const MapRow = ({ farmer, cover, business, name, address }) => {
	const navigation = useNavigation<any>();

	const navigateToFarmer = (farmer) => {
    navigation.navigate("Profile", { id: farmer })
  }

	return (
		<ListItem
			activeBackgroundColor={"white"}
			activeOpacity={0.3}
			style={{ backgroundColor: "white", padding: 8, height: "auto" }}
			onPress={() => navigateToFarmer(farmer)}
		>
			<ListItem.Part column>
				<Text h2 numberOfLines={3}>{business}</Text>
				<Text h3>{address}</Text>
				<Text h3>{name}</Text>
			</ListItem.Part>
		</ListItem> 
	)
}

export default MapRow