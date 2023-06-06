import { FlashList } from '@shopify/flash-list';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { AgendaList, AgendaSchedule } from 'react-native-calendars';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LoaderScreen, TabController, View } from 'react-native-ui-lib';
import ChatRow from '../../components/chat/chat-row';
import AgendaItem from '../../components/orders/agenda-item';
import RequestRow from '../../components/orders/request-row';
import { auth, db } from '../../firebase';
import { global } from '../../style';
interface State {
  items?: AgendaSchedule;
}

const Schedule = () => {
  const layout = useWindowDimensions();
  const width = layout.width/4;
  const [items, setItems] = useState<any>(null);
  const [chats, setChats] = useState([]);
  const [orders, setOrders] = useState<any>(null);
  const [confirmed, setConfirmed] = useState<any>(null);
  const [pending, setPending] = useState<any>(null);
  const [loading, setLoading] = useState(true);

	const renderOrder = useCallback(({item}: any) => {
    return <AgendaItem item={item} />;
  }, []);

	const renderRequest = useCallback(({item}: any) => {
    return <RequestRow item={item} />;
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
        data={pending}
        keyExtractor={(item: any) => item.id}
        estimatedItemSize={pending.length != 0 ? pending.length : 150}
        renderItem={renderRequest}
      />
    </View>
  );

  const ThirdRoute = () => (
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
    onSnapshot(query(collection(db, "Chats"), where("farmer", "==", auth.currentUser.uid)), async (snapshot) => {
      setChats(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    });
  }, []);

	useEffect(() => {
    const subscriber = onSnapshot(query(collection(db, "Orders"), where("farmer", "==", auth.currentUser.uid)), async (snapshot) => {
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
      <LoaderScreen color={"#32CD32"} />
    )
  }

  return (
    <GestureHandlerRootView style={global.flex}>
      <View useSafeArea flex style={global.bgWhite}>
        <TabController items={[{label: 'Schedule'}, {label: 'Requests'}, {label: 'Inbox'}]}>  
          <TabController.TabBar
            indicatorInsets={0}
            indicatorStyle={{ backgroundColor: "#32CD32" }} 
            selectedLabelColor={global.activeTabTextColor.color}
            labelStyle={{ width: width, textAlign: "center", fontWeight: "500" }}
          />  
          <View flex style={global.bgWhite}>    
            <TabController.TabPage index={0} lazy>{FirstRoute()}</TabController.TabPage>    
            <TabController.TabPage index={1} lazy>{SecondRoute()}</TabController.TabPage>    
            <TabController.TabPage index={2} lazy>{ThirdRoute()}</TabController.TabPage>    
          </View>
        </TabController>
      </View>
    </GestureHandlerRootView>
    
  );
}

export default Schedule