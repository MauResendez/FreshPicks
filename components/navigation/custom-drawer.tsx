import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Colors, Text } from 'react-native-ui-lib';

const CustomDrawer = (props) => {
	const {state, descriptors, navigation} = props;
  let lastGroupName = '';
  let newGroup = true;

	return (
		<SafeAreaView style={{flex: 1}}>
			<DrawerContentScrollView {...props}>
				{state.routes.map((route) => {
					const {
						drawerLabel,
						activeTintColor,
					} = descriptors[route.key].options;

					return (
						<DrawerItem
							key={route.key}
							icon={route.icon}
							label={({color}) =>
								<Text h2 style={{ color: Colors.white, fontSize: 16 }}>
									{route.name}
								</Text>
							}
							focused={
								state.routes.findIndex(
									(e) => e.name === route.name
								) === state.index
							}
							activeTintColor={activeTintColor}
							inactiveTintColor='white'
							onPress={() => navigation.navigate(route.name)}
						/>
					);
				})}
			</DrawerContentScrollView>
			<Text h2 style={{ color: Colors.white, textAlign: "center" }}>
				Made by UTRGV
			</Text>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  sectionLine: {
    backgroundColor: 'gray',
    flex: 1,
    height: 1,
    marginLeft: 10,
    marginRight: 20,
  },
});

export default CustomDrawer