import { useNavigation } from '@react-navigation/native';
import React, { memo, useCallback } from 'react';
import { Button } from 'react-native';
import { Colors, ListItem, Text, View } from 'react-native-ui-lib';

const DateTimeRow = (props) => {
	const {item} = props;
	const navigation = useNavigation<any>();

	const buttonPressed = useCallback(() => {
    console.log(item.id)
    navigation.navigate("Reserve");
  }, []);

	return (
		<ListItem
			activeOpacity={0.3}
			style={{ backgroundColor: Colors.white, padding: 8, height: "auto" }}
		>
			<ListItem.Part row spread>
        <View>
					<Text text65 marginV-4 numberOfLines={3}>Date</Text>
					<Text text80M marginV-4>{item.address}</Text>
        </View>
        <View>
					<Button color={'grey'} title={'Info'} onPress={buttonPressed} />
        </View>
      </ListItem.Part>
		</ListItem>
	)
}

export default memo(DateTimeRow);