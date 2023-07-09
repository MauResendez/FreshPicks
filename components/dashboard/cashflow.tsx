import React, { Fragment } from 'react';
import { Colors, ListItem, Text } from 'react-native-ui-lib';

const Cashflow = (props) => {
	const { allTimeSum, ytdSum, monthSum } = props;

	return (
		<Fragment>
			<ListItem
				activeOpacity={0.3}
				backgroundColor={Colors.grey60}
				height={60}
			>
				<ListItem.Part containerStyle={{ paddingHorizontal: 16 }}>
					<Text text65 marginV-4 numberOfLines={1} style={{ color: Colors.black }}>
						Your Cashflow
					</Text>
				</ListItem.Part>
			</ListItem>

			<ListItem
				activeOpacity={0.3}
				backgroundColor={Colors.white}
				style={{ padding: 8, height: "auto" }}
			>
				<ListItem.Part column>
					<Text text65 marginV-4 numberOfLines={1}>All Time</Text>
					<Text text80M grey30 marginV-4>{allTimeSum.toLocaleString('en-US', { style: 'currency', currency: 'USD'})}</Text>
				</ListItem.Part>
			</ListItem>

			<ListItem
				activeOpacity={0.3}
				backgroundColor={Colors.white}
				style={{ padding: 8, height: "auto" }} 
			>
				<ListItem.Part column>
					<Text text65 marginV-4 numberOfLines={1}>YTD</Text>
					<Text text80M grey30 marginV-4>{ytdSum.toLocaleString('en-US', { style: 'currency', currency: 'USD'})}</Text>
				</ListItem.Part>
			</ListItem>

			<ListItem
				activeOpacity={0.3}
				backgroundColor={Colors.white}
				style={{ padding: 8, height: "auto" }}
			>
				<ListItem.Part column>
					<Text text65 marginV-4 numberOfLines={1}>This Month</Text>
					<Text text80M grey30 marginV-4>{monthSum.toLocaleString('en-US', { style: 'currency', currency: 'USD'})}</Text>
				</ListItem.Part>
			</ListItem>
		</Fragment>
	)
}

export default Cashflow