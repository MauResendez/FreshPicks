// import { collection, onSnapshot, query, where } from 'firebase/firestore';
// import React, { useCallback, useEffect, useState } from 'react';
// import { Agenda, AgendaList, AgendaSchedule, CalendarProvider, ExpandableCalendar } from 'react-native-calendars';
// import { LoaderScreen, View } from 'react-native-ui-lib';
// import AgendaItem from '../../components/basket/agenda-item';
// import { auth, db } from '../../firebase';

// interface State {
//   items?: AgendaSchedule;
// }

// const Reserve = () => {
//   const [items, setItems] = useState<any>(null);
//   const [orders, setOrders] = useState<any>(null);
//   const [confirmed, setConfirmed] = useState<any>(null);
//   const [pending, setPending] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

// 	const renderOrder = useCallback(({item}: any) => {
//     return <AgendaItem item={item} />;
//   }, []);

// 	useEffect(() => {
//     const subscriber = onSnapshot(query(collection(db, "Orders"), where("customer", "!=", auth.currentUser.uid)), async (snapshot) => {
//       setOrders(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
//     });

//     // Unsubscribe from events when no longer in use
//     return () => {
//       subscriber();
//     } 
//   }, []);

// 	useEffect(() => {
//     if (orders) {
//       const c = orders.filter((element) => element.status === 'Confirmed');
//       const p = orders.filter((element) => element.status === 'Pending');

//       setConfirmed(c);
//       setPending(p);
//     }
//   }, [orders]);

//   useEffect(() => {
//     if (confirmed && pending) {
//       const newArray = [];
//       confirmed.forEach(doc => {
//         // Create a new object and save it to a new variable
//         const newObj = {
//           // Add desired properties from Firestore document data
//           title: doc.meetAt.toDate().toISOString().split('T')[0],
//           data: [doc]
//         };

//         newArray.push(newObj);
//       });

//       setItems(newArray);
//     }
//   }, [confirmed, pending]);

//   useEffect(() => {
//     if (items) {
//       setLoading(false);
//     }
//   }, [items]);
  
//   if (loading) {
//     return (
//       <LoaderScreen color={Colors.primary} />
//     )
//   }

//   return (
//     <View useSafeArea flex>
//       {/* <AgendaList
//         sections={items}
//         renderItem={renderOrder}
//       /> */}
//       <CalendarProvider
//         date={items[0]?.title}      
//         // onDateChanged={onDateChanged}
//         // onMonthChange={onMonthChange}
//         showTodayButton
//         // disabledOpacity={0.6}
//         // todayBottomMargin={16}
//       >
//         <ExpandableCalendar
//           // horizontal={false}
//           // hideArrows
//           // disablePan
//           // hideKnob
//           // initialPosition={ExpandableCalendar.positions.OPEN}
//           // calendarStyle={styles.calendar}
//           // headerStyle={styles.header} // for horizontal only
//           // disableWeekScroll
//           // disableAllTouchEventsForDisabledDays
//           firstDay={1}
//           // animateScroll
//           // closeOnDayPress={false}
//         />
//         <AgendaList
//           sections={items}
//           renderItem={renderOrder}
//         />
//         <Agenda />
//       </CalendarProvider>
//     </View>
//   );
// }

// export default Reserve

import moment from 'moment';
import React, { useCallback, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { Agenda, AgendaEntry, AgendaSchedule, DateData } from 'react-native-calendars';
import ReserveItem from '../../components/basket/reserve-item';
import { global } from '../../style';

interface State {
  items?: AgendaSchedule;
}

const Reserve = () => {
  const [items, setItems] = useState<any>({});

  const renderReserve = useCallback(({item}: any) => {
    return <ReserveItem item={item} />;
  }, []);

  const generateTimeSlots = () => {
    // Get vendor's schedule here

    // Check day of the week

    // Setup start and ending hour

    // 
    const startHour = 9;
    const endHour = 17;
    const timeSlots = [];
  
    for (let hour = startHour; hour <= endHour; ++hour) {
      const time = moment().hour(hour).startOf('hour').format();
      console.log(time);
      timeSlots.push({
        time,
        title: `Reserve at ${moment(time).format('hh:mm A')}`,
      });
    }
  
    return timeSlots;
  };

  const loadItems = (day: DateData) => {
    const dates = items || {};

    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);

        if (!dates[strTime]) {
          dates[strTime] = [];
          
          const numItems = Math.floor(Math.random() * 3 + 1);
          for (let j = 0; j < numItems; j++) {
            dates[strTime].push({
              name: 'Item for ' + strTime + ' #' + j,
              height: Math.max(50, Math.floor(Math.random() * 150)),
              day: strTime
            });
          }
        }
      }
      
      const newItems: AgendaSchedule = {};
      Object.keys(items).forEach(key => {
        newItems[key] = items[key];
      });

      setItems(newItems);
    }, 1000);
  }

  const loadItems2 = (day: DateData) => {
    console.log(day);
    const timeSlots = generateTimeSlots();

    setItems({
      [day.dateString]: timeSlots,
    });
  };

  const renderItem = (reservation: AgendaEntry, isFirst: boolean) => {
    const fontSize = 16;
    const color = 'black';

    return (
      <TouchableOpacity
        style={[global.reserve, {height: 75}]}
        onPress={() => Alert.alert(reservation.name)}
      >
        <Text style={{fontSize, color}}>{reservation.name}</Text>
      </TouchableOpacity>
    );
  }

  const renderEmptyDate = () => {
    return (
      <View style={global.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  }

  const rowHasChanged = (r1: AgendaEntry, r2: AgendaEntry) => {
    return r1.name !== r2.name;
  }

  const timeToString = (time: number) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  const renderTest = (item) => {
    const fontSize = 16;
    const color = 'black';

    return (
      <TouchableOpacity
        style={[global.reserve, {height: 75}]}
        onPress={() => Alert.alert(item.title)}
      >
        <Text style={{fontSize, color}}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Agenda
      date={new Date()}
      items={items}
      loadItemsForMonth={loadItems}
      renderItem={renderItem}
      // contentContainerStyle={{ marginBottom: 16 }}
    />
  );
}

export default Reserve