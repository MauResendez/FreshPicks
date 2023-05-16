import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { AgendaEntry, AgendaList, AgendaSchedule, DateData } from 'react-native-calendars';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LoaderScreen, TabController, Text, View } from 'react-native-ui-lib';
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
  const [items, setItems] = useState({});
  const [chats, setChats] = useState([]);
  const [meetings, setMeetings] = useState<any>([]);
  const [today, setToday] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();
  const ITEMS: any[] = agendaItems;
  const marked = useRef(getMarkedDates());

  const FirstRoute = () => (
    <View useSafeArea flex>
      {/* <WeekCalendar firstDay={1} markedDates={marked.current}/> */}
      <AgendaList
        sections={ITEMS}
        // loadItemsForMonth={loadItems}
        renderItem={renderItem}
        // renderEmptyDate={renderEmptyDate}
        // rowHasChanged={rowHasChanged}
        // selected={today}
        // showClosingKnob={true}
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
          <ChatRow id={item.id} />
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

  const loadItems = (day: DateData) => {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);
        if (!items[strTime]) {
          items[strTime] = [];
        }
      }

      const newItems: AgendaSchedule = {};

      Object.keys(items).forEach((key) => {
        newItems[key] = items[key];
      });

      setItems(newItems);
    }, 1000);
  };

  // const renderItem = () => {
  //   // const fontSize = isFirst ? 16 : 14;
  //   // const color = isFirst ? 'black' : '#43515c';

  //   return (
  //     <TouchableOpacity
  //       style={[styles.item, {height: 16}]}
  //       onPress={() => navigation.navigate("Meeting", {
  //         id: "Test"
  //       })}
  //     >
  //       <Text>Test</Text>
  //     </TouchableOpacity>
  //   );
  // }

  const renderItem = useCallback(({item}: any) => {
    return <AgendaItem item={item} />;
  }, []);

  const renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>No meeting at this time</Text>
      </View>
    );
  }

  const rowHasChanged = (r1: AgendaEntry, r2: AgendaEntry) => {
    return r1.name !== r2.name;
  }

  const timeToString = (time: number) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    setToday(formatDate(new Date()));

    onSnapshot(query(collection(db, "Chats"), where("farmer", "==", auth.currentUser.uid)), async (snapshot) => {
      setChats(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    });

    const items: AgendaSchedule = {};

    const q = query(collection(db, "Meetings"), where("farmer", "==", auth.currentUser.uid), orderBy('createdAt'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docs.map((doc) => {
        console.log(doc.data());

        const date = formatDate(doc.data().createdAt.toDate());

        console.log(date);
        
        if (!items[date]) {
          items[date] = [];
        }

        items[date].push({
          name: doc.id,
          height: 100,
          day: "外食",
        });
      });

      setItems(items);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (chats && meetings && today) {
      setLoading(false);
    }
  }, [chats, meetings, today]);
  
  if (loading) {
    return <LoaderScreen />
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

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 8,
    padding: 8,
    marginVertical: 8,
    marginRight: 8,
    height: 100
  },
  emptyDate: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 8,
    padding: 8,
    marginVertical: 8,
    marginRight: 8,
    height: 100
  }
});

export default Meetings