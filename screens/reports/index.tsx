import { FlashList } from '@shopify/flash-list';
import { collection, onSnapshot, query } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { Colors, LoaderScreen, Text, View } from 'react-native-ui-lib';
import IssueRow from '../../components/issues/issue-row';
import { db } from '../../firebase';
import { global } from '../../style';

const Reports = () => {
	const [reports, setReports] = useState<any>(null);
  const [loading, setLoading] = useState(true);

	const renderItem = useCallback(({item}: any) => {
    return <IssueRow item={item} />;
  }, []);

	useEffect(() => {
    const subscriber = onSnapshot(query(collection(db, "Reports")), async (snapshot) => {
      setReports(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

	useEffect(() => {
    if (reports) {
      setLoading(false);
    }
  }, [reports]);

	if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }

  if (reports.length == 0) {
    return (
      <View useSafeArea flex style={[global.white, global.center, global.container]}>
        <Text text65 marginV-4>No issues created yet</Text>
      </View>
    )
  }

	return (
		<View useSafeArea flex style={global.white}>
      <FlashList 
        data={reports}
        keyExtractor={(item: any) => item.id}
        estimatedItemSize={reports.length != 0 ? reports.length : 150}
        renderItem={renderItem}
      />
    </View>
	)
}

export default Reports