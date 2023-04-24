import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { Button, TabController, Text, View } from 'react-native-ui-lib';
import { auth, db } from '../../firebase';
import { global } from '../../style';

const Transactions = () => {
  const navigation = useNavigation<any>();
  const parent = navigation.getParent("MainDrawer");
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "All" },
    { key: "second", title: "Revenue" },
    { key: "third", title: "Expenses" },
  ]);
  const [products, setProducts] = useState([]);

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
  
  useEffect(() => {
    onSnapshot(query(collection(db, "Products"), where("user", "==", auth.currentUser?.uid)), async (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, []);
	
	return (
		<View useSafeArea flex style={global.bgWhite}>
      {/* <TabView
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
      /> */}
      <TabController items={[{label: 'All'}, {label: 'Revenue'}, {label: 'Expenses'}]}>  
        <TabController.TabBar spreadItems indicatorStyle={global.activeTabTextColor} />  
        <View flex>    
          <TabController.TabPage index={0}>{FirstRoute()}</TabController.TabPage>    
          <TabController.TabPage index={1} lazy>{SecondRoute()}</TabController.TabPage>    
          <TabController.TabPage index={2} lazy>{ThirdRoute()}</TabController.TabPage>  
        </View>
      </TabController>
      <Button 
        style={{ width: 64, height: 64, margin: 16, display: "absolute" }} 
        round 
        animateLayout 
        animateTo={'right'} 
        onPress={() => navigation.navigate("Create Transaction")} 
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