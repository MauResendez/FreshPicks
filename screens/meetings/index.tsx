import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { AgendaList, AgendaSchedule } from 'react-native-calendars';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LoaderScreen, TabController, View } from 'react-native-ui-lib';
import ChatRow from '../../components/chat/chat-row';
import AgendaItem from '../../components/meetings/agenda-item';
import { agendaItems, getMarkedDates } from '../../components/meetings/mocked-items';
import { auth, db } from '../../firebase';
import { global } from '../../style';
interface State {
  items?: AgendaSchedule;
}

const Meetings = () => {
  const layout = useWindowDimensions();
  const width = layout.width/4;
  const [items, setItems] = useState<any>(null);
  const [chats, setChats] = useState([]);
  const [meetings, setMeetings] = useState<any>(null);
  const [today, setToday] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();
  const ITEMS: any[] = agendaItems;
  const marked = useRef(getMarkedDates());

  const FirstRoute = () => (
    <View useSafeArea flex>
      <AgendaList
        sections={items}
        renderItem={renderItem}
      />
    </View>
  );

  const SecondRoute = () => (
    <View useSafeArea flex>
      <FlashList 
        data={chats}
        keyExtractor={(item: any) => item.id}
        estimatedItemSize={chats.length != 0 ? chats.length : 150}
        renderItem={({item}) => (
          <ChatRow item={item} />
        )}
      />
    </View>
  );

  const formatDate = (dt: Date) => {
    var y = dt.getFullYear();
    var m = ('00' + (dt.getMonth() + 1)).slice(-2);
    var d = ('00' + dt.getDate()).slice(-2);
    return (y + '-' + m + '-' + d);
  }

  const renderItem = useCallback(({item}: any) => {
    return <AgendaItem item={item} />;
  }, []);

  useEffect(() => {
    setToday(formatDate(new Date()));

    onSnapshot(query(collection(db, "Chats"), where("farmer", "==", auth.currentUser.uid)), async (snapshot) => {
      setChats(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    });
  }, []);

  useEffect(() => {
    const subscriber = onSnapshot(query(collection(db, "Meetings"), where("users", "array-contains", auth.currentUser.uid)), async (snapshot) => {
      setMeetings(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    });

    console.log(new Date().toISOString().split('T')[0])

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  useEffect(() => {
    if (meetings) {
      const newArray = [];
      meetings.forEach(doc => {
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
  }, [meetings]);

  useEffect(() => {
    if (chats && items && today) {
      setLoading(false);
    }
  }, [chats, items, today]);
  
  if (loading) {
    return (
      <LoaderScreen color={"#32CD32"} />
    )
  }

  return (
    <GestureHandlerRootView style={global.flex}>
      <View useSafeArea flex style={global.bgWhite}>
        <TabController items={[{label: 'Calendar'}, {label: 'Requests'}, {label: 'Inbox'}]}>  
          <TabController.TabBar
            indicatorInsets={0}
            indicatorStyle={{ backgroundColor: "#32CD32" }} 
            selectedLabelColor={global.activeTabTextColor.color}
            labelStyle={{ width: width, textAlign: "center", fontWeight: "500" }}
          />  
          <View flex style={global.bgWhite}>    
            <TabController.TabPage index={0}>{FirstRoute()}</TabController.TabPage>    
            <TabController.TabPage index={1}>{FirstRoute()}</TabController.TabPage>    
            <TabController.TabPage index={2} lazy>{SecondRoute()}</TabController.TabPage>    
          </View>
        </TabController>
      </View>
    </GestureHandlerRootView>
    
  );
}

export default Meetings