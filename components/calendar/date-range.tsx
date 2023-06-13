import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native-ui-lib';
import DateRangePicker from './DateRangePicker';

const DateRange = () => {
	return (
		<View useSafeArea flex style={styles.container}>
			<DateRangePicker
				initialRange={['2018-04-01', '2018-04-10']}
				onSuccess={(s, e) => alert(s + '||' + e)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  }
});

export default DateRange