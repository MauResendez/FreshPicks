import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { Button, TabController, View } from 'react-native-ui-lib';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth, db } from '../../firebase';
import { global } from '../../style';

const Transactions = () => {
  const navigation = useNavigation<any>();
  const layout = useWindowDimensions();
  const width = layout.width/4;
  const [transactions, setTransactions] = useState([]);

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
  
  useEffect(() => {
    onSnapshot(query(collection(db, "Transactions"), where("user", "==", auth.currentUser?.uid)), async (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
  }, []);
	
	return (
		<View useSafeArea flex style={global.bgWhite}>
      <TabController items={[{ label: 'All' }, { label: 'Revenue' }, { label: 'Expenses' }]}>  
        <TabController.TabBar
          indicatorInsets={0}
          indicatorStyle={{ backgroundColor: "#32CD32" }} 
          selectedLabelColor={global.activeTabTextColor.color}
          labelStyle={{ width: width, textAlign: "center", fontWeight: "500" }}
        />
        <View flex>
          <TabController.TabPage index={0}>{FirstRoute()}</TabController.TabPage>    
          <TabController.TabPage index={1} lazy>{SecondRoute()}</TabController.TabPage>    
          <TabController.TabPage index={2} lazy>{ThirdRoute()}</TabController.TabPage> 
        </View>      
      </TabController>
      <Button 
        style={global.fab} 
        round 
        animateLayout 
        animateTo={'right'} 
        onPress={() => navigation.navigate("Create Transaction")} 
        backgroundColor="#32CD32" 
        iconSource={() => <MCIcon name="plus" color="white" size={24} />} 
      />
    </View>
	)
}

export default Transactions