import { FlashList } from '@shopify/flash-list';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { AgendaList, AgendaSchedule } from 'react-native-calendars';
import { Colors, LoaderScreen, TabController, View } from 'react-native-ui-lib';
import ChatRow from '../../components/chat/chat-row';
import AgendaItem from '../../components/schedule/agenda-item';
import { auth, db } from '../../firebase';
import { global } from '../../style';
interface State {
  items?: AgendaSchedule;
}

const Schedule = () => {
  const layout = useWindowDimensions();
  const width = layout.width/3;
  const [items, setItems] = useState<any>(null);
  const [chats, setChats] = useState([]);
  const [orders, setOrders] = useState<any>(null);
  const [confirmed, setConfirmed] = useState<any>(null);
  const [pending, setPending] = useState<any>(null);
  const [loading, setLoading] = useState(true);

	const renderOrder = useCallback(({item}: any) => {
    return <AgendaItem item={item} />;
  }, []);
  
	const renderChat = useCallback(({item}: any) => {
    return <ChatRow item={item} />
  }, []);

  const FirstRoute = () => (
    <View useSafeArea flex>
      <AgendaList
        sections={items}
        renderItem={renderOrder}
      />
    </View>
  );

  const SecondRoute = () => (
    <View useSafeArea flex>
      <FlashList 
        data={chats}
        keyExtractor={(item: any) => item.id}
        estimatedItemSize={chats.length != 0 ? chats.length : 150}
        renderItem={renderChat}
      />
    </View>
  );

  useEffect(() => {
    onSnapshot(query(collection(db, "Chats"), where("vendor", "==", auth.currentUser.uid)), async (snapshot) => {
      setChats(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    });
  }, []);

	useEffect(() => {
    const subscriber = onSnapshot(query(collection(db, "Orders"), where("vendor", "==", auth.currentUser.uid)), async (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

	useEffect(() => {
    if (orders) {
      const c = orders.filter((element) => element.status === 'Confirmed');
      const p = orders.filter((element) => element.status === 'Pending');

      setConfirmed(c);
      setPending(p);
    }
  }, [orders]);

  useEffect(() => {
    if (confirmed && pending) {
      const newArray = [];
      confirmed.forEach(doc => {
        // Create a new object and save it to a new variable
        const newObj = {
          // Add desired properties from Firestore document data
          title: doc.meetAt.toDate().toISOString().split('T')[0],
          data: [doc]
        };

        newArray.push(newObj);
      });

      setItems(newArray);
    }
  }, [confirmed, pending]);

  useEffect(() => {
    if (chats && items) {
      setLoading(false);
    }
  }, [chats, items]);
  
  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }

  return (
    <View useSafeArea flex style={global.white}>
      <TabController items={[{label: 'Schedule'}, {label: 'Inbox'}]}>  
        <TabController.TabBar
          indicatorInsets={0}
          indicatorStyle={{ backgroundColor: Colors.tertiary }} 
          selectedLabelColor={Colors.tertiary}
          labelStyle={{ width: width, textAlign: "center", fontWeight: "500" }}
        />  
        <View flex style={global.white}>    
          <TabController.TabPage index={0} lazy>{FirstRoute()}</TabController.TabPage>    
          <TabController.TabPage index={1} lazy>{SecondRoute()}</TabController.TabPage>    
        </View>
      </TabController>
    </View>    
  );
}

export default Schedule