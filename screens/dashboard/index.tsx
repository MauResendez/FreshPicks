import { useNavigation } from "@react-navigation/native";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native";
import { FloatingAction } from "react-native-floating-action";
import { Button, Colors, KeyboardAwareScrollView, ListItem, LoaderScreen, Text, View } from "react-native-ui-lib";
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth, db } from "../../firebase";
import { global } from "../../style";

const Dashboard = () => {
  const navigation = useNavigation<any>();
  const [transactions, setTransactions] = useState(null);
  const [allTime, setAllTime] = useState(null);
  const [allTimeSum, setAllTimeSum] = useState(null);
  const [ytd, setYTD] = useState(null);
  const [ytdSum, setYTDSum] = useState(null);
  const [month, setMonth] = useState(null);
  const [monthSum, setMonthSum] = useState(null);
  const [loading, setLoading] = useState(true);

  const exportTransactions = useCallback(async () => {
    try {
      await fetch("https://us-central1-utrgvfreshpicks.cloudfunctions.net/exportTransactions", {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'uid': auth.currentUser.uid
        }),
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const actions = [
    {
      text: "View Cashflow",
      icon: <MCIcon name="file-document" color={Colors.white} size={24} />,
      name: "Cashflow",
      position: 1,
      color: Colors.tertiary
    },
    {
      text: "View Products",
      icon: <MCIcon name="file-document" color={Colors.white} size={24} />,
      name: "Products",
      position: 2,
      color: Colors.tertiary
    }
  ];

  useEffect(() => {
    const subscriber = onSnapshot(query(collection(db, "Transactions"), where("user", "==", auth.currentUser?.uid)), async (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  useEffect(() => {
    if (transactions) {
      if (transactions.length == 0) {
        setAllTime([]);
        setAllTimeSum(0);
        setYTD([]);
        setYTDSum(0);
        setMonth([]);
        setMonthSum(0);
        return;
      }

      // Get today's date
      const today = new Date();

      // Using reduce to find the oldest element
      const oldestElement = transactions.reduce((oldest, current) => {
        if (!oldest || current.date < oldest.date) {
          return current;
        } else {
          return oldest;
        }
      }, null);

      // Get the start of the year
      const startOfAt = new Date(oldestElement.date.toDate());
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      // Filter elements based on date being between start of year and today
      const at = transactions.filter(element => {return new Date(element.date.toDate()) >= startOfAt && new Date(element.date.toDate()) <= today});
      const atSum = at.reduce((acc, item) => item.type == "Revenue" ? acc + item.price : acc - item.price, 0);

      // Filter elements based on date being between start of year and today
      const ytd = transactions.filter(element => {return new Date(element.date.toDate()) >= startOfYear && new Date(element.date.toDate()) <= today});
      const ytdSum = ytd.reduce((acc, item) => item.type == "Revenue" ? acc + item.price : acc - item.price, 0);

      // Filter elements based on date being between start of year and today
      const month = transactions.filter(element => {return new Date(element.date.toDate()) >= startOfMonth && new Date(element.date.toDate()) <= today});
      const monthSum = month.reduce((acc, item) => item.type == "Revenue" ? acc + item.price : acc - item.price, 0);
      
      setAllTime(at);
      setAllTimeSum(atSum);
      setYTD(ytd);
      setYTDSum(ytdSum);
      setMonth(month);
      setMonthSum(monthSum);
    }
  }, [transactions]);

  useEffect(() => {
    if (transactions && ytd && month && allTime) {
      setLoading(false);
    }
  }, [transactions, ytd, month, allTime]);

  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }

  return (
    <TouchableWithoutFeedback style={global.flex} onPress={Platform.OS !== "web" && Keyboard.dismiss}>
      <View>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={Platform.OS == "web"}>
          <ListItem
            activeOpacity={0.3}
            height={60}
            key={1}
          >
            <ListItem.Part containerStyle={[{paddingHorizontal: 16}]}>
              <Text text65 marginV-4 numberOfLines={1} style={{ color: Colors.black }}>
                Your Cashflow
              </Text>
            </ListItem.Part>
          </ListItem>

          <ListItem
            activeOpacity={0.3}
            backgroundColor={Colors.white}
            style={{ padding: 8, height: "auto" }}
          >
            <ListItem.Part column>
              <Text text65 marginV-4 numberOfLines={1}>All Time</Text>
              <Text text80M grey30 marginV-4>{allTimeSum.toLocaleString('en-US', { style: 'currency', currency: 'USD'})}</Text>
            </ListItem.Part>
          </ListItem>

          <ListItem
            activeOpacity={0.3}
            backgroundColor={Colors.white}
            style={{ padding: 8, height: "auto" }} 
          >
            <ListItem.Part column>
              <Text text65 marginV-4 numberOfLines={1}>YTD</Text>
              <Text text80M grey30 marginV-4>{ytdSum.toLocaleString('en-US', { style: 'currency', currency: 'USD'})}</Text>
            </ListItem.Part>
          </ListItem>

          <ListItem
            activeOpacity={0.3}
            backgroundColor={Colors.white}
            style={{ padding: 8, height: "auto" }}
          >
            <ListItem.Part column>
              <Text text65 marginV-4 numberOfLines={1}>This Month</Text>
              <Text text80M grey30 marginV-4>{monthSum.toLocaleString('en-US', { style: 'currency', currency: 'USD'})}</Text>
            </ListItem.Part>
          </ListItem>

          <ListItem
            activeOpacity={0.3}
            height={60}
            key={2}
          >
            <ListItem.Part containerStyle={[{paddingHorizontal: 16}]}>
              <Text text65 marginV-4 numberOfLines={1} style={{ color: Colors.black }}>
                Cashflow per Product
              </Text>
            </ListItem.Part>
          </ListItem>

          <ListItem
            activeOpacity={0.3}
            backgroundColor={Colors.white}
            style={{ padding: 8, height: "auto" }}
          >
            <ListItem.Part column>
              <Text text65 marginV-4 numberOfLines={1}>Bananas</Text>
              <Text text80M grey30 marginV-4>45</Text>
            </ListItem.Part>
          </ListItem>

          <ListItem
            activeOpacity={0.3}
            backgroundColor={Colors.white}
            style={{ padding: 8, height: "auto" }}
            key={4}
          >
            <ListItem.Part column>
              <Text text65 marginV-4 numberOfLines={1}>Bananas</Text>
              <Text text80M grey30 marginV-4>45</Text>
            </ListItem.Part>
          </ListItem>

          <ListItem
            activeOpacity={0.3}
            backgroundColor={Colors.white}
            style={{ padding: 8, height: "auto" }}
            key={5}
          >
            <ListItem.Part column>
              <Text text65 marginV-4 numberOfLines={1}>Bananas</Text>
              <Text text80M grey30 marginV-4>45</Text>
            </ListItem.Part>
          </ListItem>

          <ListItem
            activeOpacity={0.3}
            backgroundColor={Colors.white}
            style={{ padding: 8, height: "auto" }}
            key={6}
          >
            <ListItem.Part column>
              <Text text65 marginV-4 numberOfLines={1}>Bananas</Text>
              <Text text80M grey30 marginV-4>45</Text>
            </ListItem.Part>
          </ListItem>

          <ListItem
            activeOpacity={0.3}
            backgroundColor={Colors.white}
            style={{ padding: 8, height: "auto" }}
            key={7}
          >
            <ListItem.Part column>
              <Text text65 marginV-4 numberOfLines={1}>Bananas</Text>
              <Text text80M grey30 marginV-4>45</Text>
            </ListItem.Part>
          </ListItem>

          <ListItem
            activeOpacity={0.3}
            backgroundColor={Colors.white}
            style={{ padding: 8, height: "auto" }}
            key={8}
          >
            <ListItem.Part column>
              <Text text65 marginV-4 numberOfLines={1}>Bananas</Text>
              <Text text80M grey30 marginV-4>45</Text>
            </ListItem.Part>
          </ListItem>

          <ListItem
            activeOpacity={0.3}
            backgroundColor={Colors.white}
            style={{ padding: 8, height: "auto" }}
            key={9}
          >
            <ListItem.Part column>
              <Text text65 marginV-4 numberOfLines={1}>Bananas</Text>
              <Text text80M grey30 marginV-4>45</Text>
            </ListItem.Part>
          </ListItem>

          <ListItem
            activeOpacity={0.3}
            backgroundColor={Colors.white}
            style={{ padding: 8, height: "auto" }}
            key={10}
          >
            <ListItem.Part column>
              <Text text65 marginV-4 numberOfLines={1}>Bananas</Text>
              <Text text80M grey30 marginV-4>45</Text>
            </ListItem.Part>
          </ListItem>
          <Button onPress={exportTransactions} />

        </KeyboardAwareScrollView>
        <FloatingAction
          actions={actions}
          color={Colors.tertiary}
          tintColor={Colors.tertiary}
          distanceToEdge={16}
          onPressItem={(name) => navigation.navigate(name)}
        />

      </View>
    </TouchableWithoutFeedback>
  );
}

export default Dashboard