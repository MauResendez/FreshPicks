import { FlashList } from '@shopify/flash-list';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Agenda, AgendaEntry, AgendaSchedule, DateData } from 'react-native-calendars';
import { TabController, Text, View } from 'react-native-ui-lib';
import ChatRow from '../../components/chat/chat-row';
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
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onSnapshot(query(collection(db, "Meetings"), where("farmer", "==", auth.currentUser.uid)), async (snapshot) => {
      setMeetings(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    });

    onSnapshot(query(collection(db, "Chats"), where("farmer", "==", auth.currentUser.uid)), async (snapshot) => {
      setChats(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    });
  }, []);

  useEffect(() => {
    if (chats && meetings) {
      setLoading(false);
    }
  }, [chats, meetings]);

  const FirstRoute = () => (
    <View useSafeArea flex>
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        rowHasChanged={rowHasChanged}
        showClosingKnob={true}
      />
    </View>
  );

  const SecondRoute = () => (
    <View useSafeArea flex>
      <FlashList 
        data={chats}
        keyExtractor={(item: any) => item.id}
        estimatedItemSize={chats.length}
        renderItem={({item}) => (
          <ChatRow id={item.id} />
        )}
      />
    </View>
  );

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

  return (
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
  );
}

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

export default Meetings