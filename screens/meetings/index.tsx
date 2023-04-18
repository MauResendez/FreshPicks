import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Agenda, AgendaEntry, AgendaSchedule, DateData } from 'react-native-calendars';

interface State {
  items?: AgendaSchedule;
}

const Meetings = () => {
  const navigation = useNavigation<any>();
  const [items, setItems] = useState({});

  const loadItems = (day: DateData) => {
    const items = {};

    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);

        if (!items[strTime]) {
          items[strTime] = [];
          
          const numItems = Math.floor(Math.random() * 3 + 1);
          for (let j = 0; j < numItems; j++) {
            items[strTime].push({
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
      
      // this.setState({
      //   items: newItems
      // });

      setItems(newItems);
    }, 1000);
  }

  const renderItem = (reservation: AgendaEntry, isFirst: boolean) => {
    const fontSize = isFirst ? 16 : 14;
    const color = isFirst ? 'black' : '#43515c';

    return (
      <TouchableOpacity
        style={[styles.item, {height: reservation.height}]}
        onPress={() => Alert.alert(reservation.name)}
      >
        <Text style={{fontSize, color}}>{reservation.name}</Text>
      </TouchableOpacity>
    );
  }

  const renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, []);

  return (
    <Agenda
      items={items}
      loadItemsForMonth={loadItems}
      selected={'2017-05-16'}
      renderItem={renderItem}
      renderEmptyDate={renderEmptyDate}
      rowHasChanged={rowHasChanged}
      showClosingKnob={true}
    />
  );
}

export default Meetings

// export default class Meetings extends Component<State> {
//   state: State = {
//     items: undefined
//   };

//   // reservationsKeyExtractor = (item, index) => {
//   //   return `${item?.reservation?.day}${index}`;
//   // };
  

//   render() {
//     return (
//       <Agenda
//         items={this.state.items}
//         loadItemsForMonth={this.loadItems}
//         selected={'2017-05-16'}
//         renderItem={this.renderItem}
//         renderEmptyDate={this.renderEmptyDate}
//         rowHasChanged={this.rowHasChanged}
//         showClosingKnob={true}
//         // markingType={'period'}
//         // markedDates={{
//         //    '2017-05-08': {textColor: '#43515c'},
//         //    '2017-05-09': {textColor: '#43515c'},
//         //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
//         //    '2017-05-21': {startingDay: true, color: 'blue'},
//         //    '2017-05-22': {endingDay: true, color: 'gray'},
//         //    '2017-05-24': {startingDay: true, color: 'gray'},
//         //    '2017-05-25': {color: 'gray'},
//         //    '2017-05-26': {endingDay: true, color: 'gray'}}}
//         // monthFormat={'yyyy'}
//         // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
//         //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
//         // hideExtraDays={false}
//         // showOnlySelectedDayItems
//         // reservationsKeyExtractor={this.reservationsKeyExtractor}
//       />
//     );
//   }

//   loadItems = (day: DateData) => {
//     const items = this.state.items || {};

//     setTimeout(() => {
//       for (let i = -15; i < 85; i++) {
//         const time = day.timestamp + i * 24 * 60 * 60 * 1000;
//         const strTime = this.timeToString(time);

//         if (!items[strTime]) {
//           items[strTime] = [];
          
//           const numItems = Math.floor(Math.random() * 3 + 1);
//           for (let j = 0; j < numItems; j++) {
//             items[strTime].push({
//               name: 'Item for ' + strTime + ' #' + j,
//               height: Math.max(50, Math.floor(Math.random() * 150)),
//               day: strTime
//             });
//           }
//         }
//       }
      
//       const newItems: AgendaSchedule = {};
//       Object.keys(items).forEach(key => {
//         newItems[key] = items[key];
//       });
//       this.setState({
//         items: newItems
//       });
//     }, 1000);
//   }

//   renderItem = (reservation: AgendaEntry, isFirst: boolean) => {
//     const fontSize = isFirst ? 16 : 14;
//     const color = isFirst ? 'black' : '#43515c';

//     return (
//       <TouchableOpacity
//         style={[styles.item, {height: reservation.height}]}
//         onPress={() => Alert.alert(reservation.name)}
//       >
//         <Text style={{fontSize, color}}>{reservation.name}</Text>
//       </TouchableOpacity>
//     );
//   }

//   renderEmptyDate = () => {
//     return (
//       <View style={styles.emptyDate}>
//         <Text>This is empty date!</Text>
//       </View>
//     );
//   }

//   rowHasChanged = (r1: AgendaEntry, r2: AgendaEntry) => {
//     return r1.name !== r2.name;
//   }

//   timeToString(time: number) {
//     const date = new Date(time);
//     return date.toISOString().split('T')[0];
//   }
// }

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  }
});