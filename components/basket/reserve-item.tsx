import React from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ReserveItem = (props) => {
	const {item} = props;

	return (
		<TouchableOpacity style={styles.item}>
      {/* <Text style={styles.itemHourText}>{item.meetAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text> */}
			<Text style={styles.itemHourText}>Test</Text>
      <Text style={styles.itemTitleText}>Test</Text>
      <View style={styles.itemButtonContainer}>
        <Button color={'grey'} title={'Info'} />
      </View>
    </TouchableOpacity>
	)
}

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    flexDirection: 'row',
    alignItems: "center",
  },
  itemHourText: {
    color: 'black'
  },
  itemDurationText: {
    color: 'grey',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4
  },
  itemTitleText: {
    color: 'black',
    marginLeft: 16,
    fontWeight: 'bold',
    fontSize: 16
  },
  itemButtonContainer: {
    flex: 1,
    alignItems: 'flex-end'
  },
  emptyItem: {
    paddingLeft: 20,
    height: 52,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey'
  },
  emptyItemText: {
    color: 'lightgrey',
    fontSize: 14
  }
});

export default ReserveItem