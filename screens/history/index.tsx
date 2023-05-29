import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Agenda, AgendaEntry, AgendaSchedule, DateData } from 'react-native-calendars';
import { LoaderScreen, TabController, Text, View } from 'react-native-ui-lib';
import ChatRow from '../../components/chat/chat-row';
import HistoryRow from '../../components/history/history-row';
import { auth, db } from '../../firebase';
import { global } from '../../style';
interface State {
  items?: AgendaSchedule;
}

const History = () => {
  const layout = useWindowDimensions();
  const width = layout.width/4;
  const [items, setItems] = useState({});
  const [chats, setChats] = useState([]);
  const [meetings, setMeetings] = useState<any>([]);
  const [today, setToday] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

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

  const renderItem = (meeting: AgendaEntry, isFirst: boolean) => {
    const fontSize = isFirst ? 16 : 14;
    const color = isFirst ? 'black' : '#43515c';

    return (
      <TouchableOpacity
        style={[styles.item, {height: meeting.height}]}
        onPress={() => navigation.navigate("Meeting", {
          id: meeting.name
        })}
      >
        <Text style={{fontSize, color}}>{meeting.name}</Text>
      </TouchableOpacity>
    );
  }

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

  // const renderMeeting = useCallback(({item}) => {
  //   return (
  //     <ProductCard
  //       key={item?.id}
  //       id={item?.id}
  //       image={item?.image}
  //       title={item?.title}
  //       subtitle={item?.description}
  //       price={item?.price}
  //       quantity={item?.quantity}
  //       farmer={item?.user}
  //     />
  //   );
  // }, []);

  const renderHistory = useCallback(({item}) => {
    return (
      <HistoryRow item={item} />
    );
  }, []);

  const renderChat = useCallback(({item}) => {
    return (
      <ChatRow item={item} />
    );
  }, []);

  const FirstRoute = () => (
    <View useSafeArea flex>
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        rowHasChanged={rowHasChanged}
        selected={today}
        showClosingKnob={true}
        // theme={{
        //   backgroundColor: '#ffffff',
        //   calendarBackground: '#ffffff',
        //   textSectionTitleColor: '#b6c1cd',
        //   selectedDayBackgroundColor: '#32CD32',
        //   selectedDayTextColor: '#ffffff',
        //   todayTextColor: '#32CD32',
        //   dayTextColor: '#FD8282',
        //   textDisabledColor: '#979797',
        // }}
      />
    </View>
  );

  const SecondRoute = () => (
    <View useSafeArea flex>
      <FlashList 
        data={meetings}
        keyExtractor={(item: any) => item.id}
        estimatedItemSize={meetings.length != 0 ? meetings.length : 150}
        renderItem={renderHistory}
      />
    </View>
  );

  const ThirdRoute = () => (
    <View useSafeArea flex>
      <FlashList 
        data={chats}
        keyExtractor={(item: any) => item.id}
        estimatedItemSize={chats.length != 0 ? chats.length : 20}
        renderItem={renderChat}
      />
    </View>
  );

  useEffect(() => {
    setToday(formatDate(new Date()));

    onSnapshot(query(collection(db, "Chats"), where("consumer", "==", auth.currentUser.uid)), async (snapshot) => {
      setChats(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    });

    onSnapshot(query(collection(db, "Meetings"), where("consumer", "==", auth.currentUser.uid)), async (snapshot) => {
      setMeetings(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    });  

    const items: AgendaSchedule = {};

    const q = query(collection(db, "Meetings"), where("consumer", "==", auth.currentUser.uid), orderBy('createdAt'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docs.map((doc) => {
        const date = formatDate(doc.data().createdAt.toDate());
        
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
      console.log(meetings);
      setLoading(false);
    }
  }, [chats, meetings, today]);
  
  if (loading) {
    return (
      <LoaderScreen color={"#32CD32"} />
    )
  }

  return (
    <View useSafeArea flex style={global.bgWhite}>
      <TabController items={[{label: 'Calendar'}, {label: 'History'}, {label: 'Chats'}]}>  
        <TabController.TabBar
          indicatorInsets={0}
          indicatorStyle={{ backgroundColor: "#32CD32" }} 
          selectedLabelColor={global.activeTabTextColor.color}
          labelStyle={{ width: width, textAlign: "center", fontWeight: "500" }}
        />  
        <View flex style={global.bgWhite}>    
          <TabController.TabPage index={0}>{FirstRoute()}</TabController.TabPage>    
          <TabController.TabPage index={1}>{SecondRoute()}</TabController.TabPage>    
          <TabController.TabPage index={2}>{ThirdRoute()}</TabController.TabPage>    
        </View>
      </TabController>
    </View>
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

export default History