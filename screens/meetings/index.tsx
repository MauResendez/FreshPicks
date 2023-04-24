import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { Agenda, AgendaEntry, AgendaSchedule, DateData } from 'react-native-calendars';
import { Button, TabController, Text, View } from 'react-native-ui-lib';
import Ionicon from "react-native-vector-icons/Ionicons";
import ChatRow from '../../components/chat/chat-row';
import { auth, db } from '../../firebase';
interface State {
  items?: AgendaSchedule;
}

const Meetings = () => {
  const navigation = useNavigation<any>();
  const [items, setItems] = useState({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    onSnapshot(doc(db, "Users", auth.currentUser.uid), (doc) => {
      setUser(doc.data());
    });
  }, [])

  useEffect(() => {
    if (!user) {
      return;
    }

    if (user.role) {
      onSnapshot(query(collection(db, "Chats"), where("farmer", "==", auth.currentUser.uid)), async (snapshot) => {
        setChats(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
      });
    } else {
      onSnapshot(query(collection(db, "Chats"), where("consumer", "==", auth.currentUser.uid)), async (snapshot) => {
        setChats(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
      });
    }
  }, [user]);

  useEffect(() => {
    if (chats) {
      setLoading(false);
    }
  }, [chats, user]);

  const FirstRoute = () => (
    <View useSafeArea flex>
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        selected={'2017-05-16'}
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
          // <ChatRow chat={item.id} cover={item.cover} title={item.farmer?.name} subtitle={item.messages?.length === 0 ? "No messages" : `${item.messages[0]?.user.name === auth.currentUser.displayName ? "You" : item.messages[0]?.user.name}: ${item.messages[0]?.text}`} />
        )}
      />
      {!user?.role && <Button style={{ width: 64, height: 64, margin: 16 }} round animateLayout animateTo={'right'} onPress={() => navigation.navigate("Search")} backgroundColor="green" size={Button.sizes.small} iconSource={() => <Ionicon name="search" color="white" size={24} />} />}
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, []);

  return (
    <TabController items={[{label: 'Calendar'}, {label: 'Inbox'}]}>  
      <TabController.TabBar spreadItems indicatorStyle={global.activeTabTextColor} />  
      <View flex style={global.bgWhite}>    
        <TabController.TabPage index={0}>{FirstRoute()}</TabController.TabPage>    
        <TabController.TabPage index={1} lazy>{SecondRoute()}</TabController.TabPage>    
      </View>
    </TabController>
  );
}

export default Meetings

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