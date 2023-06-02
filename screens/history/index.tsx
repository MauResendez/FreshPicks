// import { useNavigation } from '@react-navigation/native';
// import { FlashList } from '@shopify/flash-list';
// import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
// import React, { useCallback, useEffect, useState } from 'react';
// import { StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
// import { Agenda, AgendaEntry, AgendaSchedule, DateData } from 'react-native-calendars';
// import { LoaderScreen, TabController, Text, View } from 'react-native-ui-lib';
// import ChatRow from '../../components/chat/chat-row';
// import HistoryRow from '../../components/history/history-row';
// import { auth, db } from '../../firebase';
// import { global } from '../../style';
// interface State {
//   items?: AgendaSchedule;
// }

// const History = () => {
//   const layout = useWindowDimensions();
//   const width = layout.width/4;
//   const [items, setItems] = useState({});
//   const [chats, setChats] = useState([]);
//   const [meetings, setMeetings] = useState<any>([]);
//   const [today, setToday] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigation = useNavigation<any>();

//   const formatDate = (dt: Date) => {
//     var y = dt.getFullYear();
//     var m = ('00' + (dt.getMonth() + 1)).slice(-2);
//     var d = ('00' + dt.getDate()).slice(-2);
//     return (y + '-' + m + '-' + d);
//   }

//   const loadItems = (day: DateData) => {
//     setTimeout(() => {
//       for (let i = -15; i < 85; i++) {
//         const time = day.timestamp + i * 24 * 60 * 60 * 1000;
//         const strTime = timeToString(time);
//         if (!items[strTime]) {
//           items[strTime] = [];
//         }
//       }

//       const newItems: AgendaSchedule = {};

//       Object.keys(items).forEach((key) => {
//         newItems[key] = items[key];
//       });

//       setItems(newItems);
//     }, 1000);
//   };

//   const renderItem = (meeting: AgendaEntry, isFirst: boolean) => {
//     const fontSize = isFirst ? 16 : 14;
//     const color = isFirst ? 'black' : '#43515c';

//     return (
//       <TouchableOpacity
//         style={[styles.item, {height: meeting.height}]}
//         onPress={() => navigation.navigate("Meeting", {
//           id: meeting.name
//         })}
//       >
//         <Text style={{fontSize, color}}>{meeting.name}</Text>
//       </TouchableOpacity>
//     );
//   }

//   const renderEmptyDate = () => {
//     return (
//       <View style={styles.emptyDate}>
//         <Text>No meeting at this time</Text>
//       </View>
//     );
//   }

//   const rowHasChanged = (r1: AgendaEntry, r2: AgendaEntry) => {
//     return r1.name !== r2.name;
//   }

//   const timeToString = (time: number) => {
//     const date = new Date(time);
//     return date.toISOString().split('T')[0];
//   };

//   const renderHistory = useCallback(({item}) => {
//     return (
//       <HistoryRow item={item} />
//     );
//   }, []);

//   const renderChat = useCallback(({item}) => {
//     return (
//       <ChatRow item={item} />
//     );
//   }, []);

//   const FirstRoute = () => (
//     <View useSafeArea flex>
//       <Agenda
//         items={items}
//         loadItemsForMonth={loadItems}
//         renderItem={renderItem}
//         renderEmptyDate={renderEmptyDate}
//         rowHasChanged={rowHasChanged}
//         selected={today}
//         showClosingKnob={true}
//         // theme={{
//         //   backgroundColor: '#ffffff',
//         //   calendarBackground: '#ffffff',
//         //   textSectionTitleColor: '#b6c1cd',
//         //   selectedDayBackgroundColor: '#32CD32',
//         //   selectedDayTextColor: '#ffffff',
//         //   todayTextColor: '#32CD32',
//         //   dayTextColor: '#FD8282',
//         //   textDisabledColor: '#979797',
//         // }}
//       />
//     </View>
//   );

//   const SecondRoute = () => (
//     <View useSafeArea flex>
//       <FlashList 
//         data={meetings}
//         keyExtractor={(item: any) => item.id}
//         estimatedItemSize={meetings.length != 0 ? meetings.length : 150}
//         renderItem={renderHistory}
//       />
//     </View>
//   );

//   const ThirdRoute = () => (
//     <View useSafeArea flex>
//       <FlashList 
//         data={chats}
//         keyExtractor={(item: any) => item.id}
//         estimatedItemSize={chats.length != 0 ? chats.length : 20}
//         renderItem={renderChat}
//       />
//     </View>
//   );

//   useEffect(() => {
//     setToday(formatDate(new Date()));

//     onSnapshot(query(collection(db, "Chats"), where("consumer", "==", auth.currentUser.uid)), async (snapshot) => {
//       setChats(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
//     });

//     onSnapshot(query(collection(db, "Meetings"), where("consumer", "==", auth.currentUser.uid)), async (snapshot) => {
//       setMeetings(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
//     });  

//     const items: AgendaSchedule = {};

//     const q = query(collection(db, "Meetings"), where("consumer", "==", auth.currentUser.uid), orderBy('createdAt'));

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       snapshot.docs.map((doc) => {
//         const date = formatDate(doc.data().createdAt.toDate());
        
//         if (!items[date]) {
//           items[date] = [];
//         }

//         items[date].push({
//           name: doc.id,
//           height: 100,
//           day: "外食",
//         });
//       });

//       setItems(items);
//     });

//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     if (chats && meetings && today) {
//       console.log(meetings);
//       setLoading(false);
//     }
//   }, [chats, meetings, today]);
  
//   if (loading) {
//     return (
//       <LoaderScreen color={"#32CD32"} />
//     )
//   }

//   return (
//     <View useSafeArea flex style={global.bgWhite}>
//       <TabController items={[{label: 'Calendar'}, {label: 'History'}, {label: 'Chats'}]}>  
//         <TabController.TabBar
//           indicatorInsets={0}
//           indicatorStyle={{ backgroundColor: "#32CD32" }} 
//           selectedLabelColor={global.activeTabTextColor.color}
//           labelStyle={{ width: width, textAlign: "center", fontWeight: "500" }}
//         />  
//         <View flex style={global.bgWhite}>    
//           <TabController.TabPage index={0}>{FirstRoute()}</TabController.TabPage>    
//           <TabController.TabPage index={1}>{SecondRoute()}</TabController.TabPage>    
//           <TabController.TabPage index={2}>{ThirdRoute()}</TabController.TabPage>    
//         </View>
//       </TabController>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   item: {
//     backgroundColor: 'white',
//     flex: 1,
//     borderRadius: 8,
//     padding: 8,
//     marginVertical: 8,
//     marginRight: 8,
//     height: 100
//   },
//   emptyDate: {
//     backgroundColor: 'white',
//     flex: 1,
//     borderRadius: 8,
//     padding: 8,
//     marginVertical: 8,
//     marginRight: 8,
//     height: 100
//   }
// });

// export default History

import { FlashList } from '@shopify/flash-list';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { AgendaList, AgendaSchedule } from 'react-native-calendars';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LoaderScreen, TabController, View } from 'react-native-ui-lib';
import ChatRow from '../../components/chat/chat-row';
import AgendaItem from '../../components/meetings/agenda-item';
import RequestRow from '../../components/meetings/request-row';
import { auth, db } from '../../firebase';
import { global } from '../../style';
interface State {
  items?: AgendaSchedule;
}

const Orders = () => {
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

  // useEffect(() => {
  //   const subscriber = onSnapshot(query(collection(db, "Orders"), where("consumer", "==", auth.currentUser.uid), where("status", "==", "Confirmed")), async (snapshot) => {
  //     setMeetings(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
  //   });

  //   console.log(new Date().toISOString().split('T')[0])

  //   // Unsubscribe from events when no longer in use
  //   return () => subscriber();
  // }, []);

	useEffect(() => {
    const subscriber = onSnapshot(query(collection(db, "Orders"), where("consumer", "==", auth.currentUser.uid)), async (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    });

    console.log(new Date().toISOString().split('T')[0])

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
        <TabController items={[{label: 'Orders'}, {label: 'Requests'}, {label: 'Inbox'}]}>  
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

export default Orders