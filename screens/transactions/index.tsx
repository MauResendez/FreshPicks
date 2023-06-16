import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { FloatingAction } from 'react-native-floating-action';
import { Colors, LoaderScreen, View } from 'react-native-ui-lib';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import TransactionRow from '../../components/transactions/transaction-row';
import { auth, db } from '../../firebase';
import { global } from '../../style';

const Transactions = () => {
  const navigation = useNavigation<any>();
  const layout = useWindowDimensions();
  const [transactions, setTransactions] = useState(null);
  const [expenses, setExpenses] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);

  const actions = [
    {
      text: "Create Expense",
      icon: <MCIcon name="credit-card" color={Colors.white} size={24} />,
      name: "Create Expense",
      position: 1,
      color: Colors.tertiary
    },
    {
      text: "Create Revenue",
      icon: <MCIcon name="cash" color={Colors.white} size={24} />,
      name: "Create Revenue",
      position: 2,
      color: Colors.tertiary
    }
  ];

  const renderItem = useCallback(({item}) => {
    return (
      <TransactionRow item={item} />
    );
  }, []);

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
    <View useSafeArea flex style={global.white}>
      <FlashList 
        data={transactions}
        keyExtractor={(item: any) => item.id}
        estimatedItemSize={transactions.length != 0 ? transactions.length : 150}
        renderItem={renderItem}
      />
      <FloatingAction
        actions={actions}
        color={Colors.tertiary}
        tintColor={Colors.tertiary}
        distanceToEdge={16}
        onPressItem={(name) => navigation.navigate(name)}
      />
    </View>
	)
}

export default Transactions