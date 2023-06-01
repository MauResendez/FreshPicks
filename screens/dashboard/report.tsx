import React from 'react'
import { Button, Colors, Text, View } from 'react-native-ui-lib'
import { global } from '../../style'

const Report = () => {
	return (
		<View useSafeArea flex style={global.container}>
			<Text>Report</Text>
			<View flexG />
			<Button 
				backgroundColor={Colors.primary}
				color={Colors.white}
				label={"Send CSV to Email"} 
				labelStyle={{ fontWeight: '600', padding: 8 }} 
				style={global.btn} 
			/>
		</View>
	)
}

export default Report