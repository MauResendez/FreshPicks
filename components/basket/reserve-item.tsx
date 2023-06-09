import React from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';
import { global } from '../../style';

const ReserveItem = (props) => {
	const {item} = props;

	return (
		<TouchableOpacity style={global.item}>
      {/* <Text style={styles.itemHourText}>{item.meetAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text> */}
			<Text style={global.itemHourText}>Test</Text>
      <Text style={global.itemTitleText}>Test</Text>
      <View style={global.itemButtonContainer}>
        <Button color={'grey'} title={'Info'} />
      </View>
    </TouchableOpacity>
	)
}

export default ReserveItem