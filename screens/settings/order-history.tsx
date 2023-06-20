import { FlashList } from '@shopify/flash-list';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { Colors, LoaderScreen, View } from 'react-native-ui-lib';
import HistoryRow from '../../components/orders/history-row';
import { auth, db } from '../../firebase';
import { global } from '../../style';

const OrderHistory = () => {
	const [orders, setOrders] = useState<any>(null);
  const [loading, setLoading] = useState(true);

	const renderHistory = useCallback(({item}: any) => {
    return <HistoryRow item={item} />;
  }, []);

	useEffect(() => {
    const subscriber = onSnapshot(query(collection(db, "Orders"), where("consumer", "==", auth.currentUser.uid)), async (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

	useEffect(() => {
    if (orders) {
      setLoading(false);
    }
  }, [orders]);

	if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }

	return (
		<View useSafeArea flex style={global.white}>
      <FlashList 
        data={orders}
        keyExtractor={(item: any) => item.id}
        estimatedItemSize={orders.length != 0 ? orders.length : 150}
        renderItem={renderHistory}
      />
    </View>
	)
}

export default OrderHistory