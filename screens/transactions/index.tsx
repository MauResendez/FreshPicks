import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import * as FileSystem from 'expo-file-system';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import * as Papa from 'papaparse';
import React, { useCallback, useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Button, LoaderScreen, TabController, View } from 'react-native-ui-lib';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import TransactionRow from '../../components/transactions/transaction-row';
import { auth, db } from '../../firebase';
import { global } from '../../style';

const Transactions = () => {
  const navigation = useNavigation<any>();
  const layout = useWindowDimensions();
  const width = layout.width/4;
  const [transactions, setTransactions] = useState(null);
  const [expenses, setExpenses] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);

  const renderItem = useCallback(({item}) => {
    return (
      <TransactionRow item={item} />
    );
  }, []);

  const FirstRoute = () => (
    <View useSafeArea flex>
      <FlashList 
        data={transactions}
        keyExtractor={(item: any) => item.id}
        estimatedItemSize={transactions.length != 0 ? transactions.length : 150}
        renderItem={renderItem}
      />
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
  );

  const SecondRoute = () => (
    <View useSafeArea flex>
      <FlashList 
        data={revenue}
        keyExtractor={(item: any) => item.id}
        estimatedItemSize={revenue.length != 0 ? revenue.length : 150}
        renderItem={renderItem}
      />
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
  );

	const ThirdRoute = () => (
    <View useSafeArea flex>
      <FlashList 
        data={expenses}
        keyExtractor={(item: any) => item.id}
        estimatedItemSize={expenses.length != 0 ? expenses.length : 150}
        renderItem={renderItem}
      />
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
  );
  
  useEffect(() => {
    onSnapshot(query(collection(db, "Transactions"), where("user", "==", auth.currentUser?.uid)), async (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
  }, []);

  useEffect(() => {
    if (transactions) {
      const e = transactions.filter((element) => element.type === 'Expense');
      const r = transactions.filter((element) => element.type === 'Revenue');

      setRevenue(r);
      setExpenses(e);
    }
  }, [transactions]);

  useEffect(() => {
    if (transactions) {
      const fetchData = async () => {
        try {
          const csvData = Papa.unparse(transactions);
  
          // Save the CSV file
          const fileUri = FileSystem.documentDirectory + 'data.csv';
          await FileSystem.writeAsStringAsync(fileUri, csvData);
  
          console.log('CSV file saved successfully.');

          FileSystem.getInfoAsync(fileUri);
        } catch (error) {
          console.error('Error exporting Firestore collection:', error);
        }
      };
  
      fetchData();
    }
    
  }, [transactions]);

  useEffect(() => {
    if (transactions && revenue && expenses) {
      setLoading(false);
    }
  }, [transactions, revenue, expenses]);

  if (loading) {
    return (
      <LoaderScreen />
    )
  }
	
	return (
    <GestureHandlerRootView style={global.flex}>
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
      </View>
    </GestureHandlerRootView>
	)
}

export default Transactions