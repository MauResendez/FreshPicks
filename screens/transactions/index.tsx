import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { Button, Colors, LoaderScreen, View } from 'react-native-ui-lib';
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
        backgroundColor={Colors.tertiary}
        iconSource={() => <MCIcon name="plus" color={Colors.white} size={24} />} 
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
        backgroundColor={Colors.primary} 
        iconSource={() => <MCIcon name="plus" color={Colors.white} size={24} />} 
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
        backgroundColor={Colors.primary} 
        iconSource={() => <MCIcon name="plus" color={Colors.white} size={24} />} 
      />
    </View>
  );

  useEffect(() => {
    const subscriber = onSnapshot(query(collection(db, "Transactions"), where("user", "==", auth.currentUser?.uid)), async (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  useEffect(() => {
    if (transactions) {
      const e = transactions.filter((element) => element.type === 'Expense');
      const r = transactions.filter((element) => element.type === 'Revenue');

      setRevenue(r);
      setExpenses(e);
    }
  }, [transactions]);

  // useEffect(() => {
  //   if (transactions) {
  //     const fetchData = async () => {
  //       try {
  //         const csvData = Papa.unparse(transactions);
  
  //         // Save the CSV file
  //         const fileUri = FileSystem.documentDirectory + 'data.csv';
  //         await FileSystem.writeAsStringAsync(fileUri, csvData);
  
  //         console.log('CSV file saved successfully.');

  //         FileSystem.getInfoAsync(fileUri);
  //       } catch (error) {
  //         console.error('Error exporting Firestore collection:', error);
  //       }
  //     };
  
  //     fetchData();
  //   }
    
  // }, [transactions]);

  useEffect(() => {
    if (transactions && revenue && expenses) {
      setLoading(false);
    }
  }, [transactions, revenue, expenses]);

  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }
	
	return (
    <View useSafeArea flex style={global.bgWhite}>
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
        backgroundColor={Colors.primary} 
        iconSource={() => <MCIcon name="plus" color={Colors.white} size={24} />} 
      />
    </View>
	)
}

export default Transactions