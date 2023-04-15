import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect, useState } from 'react';
import { Alert, StyleSheet, useWindowDimensions } from 'react-native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { ActionSheet, Button, Text, View } from 'react-native-ui-lib';
import { global } from '../../style';

const Transactions = () => {
  const navigation = useNavigation<any>();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "All" },
    { key: "second", title: "Revenue" },
    { key: "third", title: "Expenses" },
  ]);

  const FirstRoute = () => (
    <View useSafeArea flex>

    </View>
  );

  const SecondRoute = () => (
    <View useSafeArea flex>
    </View>
  );

	const ThirdRoute = () => (
    <View useSafeArea flex>

    </View>
  );

  const renderLabel = ({ route, focused, color }) => {
    return (
      <Text style={[focused ? styles.activeTabTextColor : styles.tabTextColor]}>
        {route.title}
      </Text>
    );
  };

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
		third: ThirdRoute
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, []);
	
	return (
		<View useSafeArea flex style={global.bgWhite}>
      <TabView
        style={global.bgWhite}
        navigationState={{ index, routes }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: global.activeTabTextColor.color }}
            style={{ backgroundColor: "white", height: 50 }}
            renderLabel={renderLabel}
          />
        )}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
      <ActionSheet 
        title={'What transaction would you like to save?'}
        message={'Message goes here'} 
        visible={true}
        containerStyle={{ height: 256 }}
        dialogStyle={{ borderRadius: 8 }}
        cancelButtonIndex={3} 
        destructiveButtonIndex={0} 
        options={[{label: 'Expense'},  {label: 'Revenue'},  {label: 'Cancel', onPress: () => console.log('cancel')}]}
      />
      <Button 
        style={{ width: 64, height: 64, margin: 16, display: "absolute" }} 
        round 
        animateLayout 
        animateTo={'right'} 
        onPress={() => Alert.alert("Create", "What would you like to create?", [
          {text: 'Listing', onPress: () => navigation.navigate("Create Listing")},
          {text: 'Subscription', onPress: () => navigation.navigate("Create Subscription")},
          {text: 'Post', onPress: () => navigation.navigate("Create Post")},
          {text: 'Cancel', style: 'cancel'},
        ])} 
        backgroundColor="#32CD32" 
        // iconSource={() => <Ionicon name="create" color="white" size={24} />} 
      />
    </View>
	)
}

const styles = StyleSheet.create({
  activeTabTextColor: {
    color: "#32CD32"
  },
  tabTextColor: {
    color: "black"
  }
});

export default Transactions