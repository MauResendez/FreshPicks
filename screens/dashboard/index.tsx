import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import { Colors, KeyboardAwareScrollView, LoaderScreen, View } from "react-native-ui-lib";
import Cashflow from "../../components/dashboard/cashflow";
import Products from "../../components/dashboard/products";
import Subscriptions from "../../components/dashboard/subscriptions";
import { auth, db } from "../../firebase";
import { global } from "../../style";

const Dashboard = () => {
  const [transactions, setTransactions] = useState(null);
  const [products, setProducts] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedRange, setRange] = useState({});
  const [allTime, setAllTime] = useState(null);
  const [allTimeSum, setAllTimeSum] = useState(null);
  const [ytd, setYTD] = useState(null);
  const [ytdSum, setYTDSum] = useState(null);
  const [month, setMonth] = useState(null);
  const [monthSum, setMonthSum] = useState(null);
  const [cpp, setCPP] = useState(null);
  const [cps, setCPS] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriber = onSnapshot(query(collection(db, "Transactions"), where("user", "==", auth.currentUser?.uid)), async (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    const subscriber2 = onSnapshot(query(collection(db, "Products"), where("user", "==", auth.currentUser?.uid)), async (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    const subscriber3 = onSnapshot(query(collection(db, "Subscriptions"), where("user", "==", auth.currentUser?.uid)), async (snapshot) => {
      setSubscriptions(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    // Unsubscribe from events when no longer in use
    return () => {
      subscriber();
      subscriber2();
      subscriber3();
    }
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
    if (products) {
      const cpp = [];
      
      products.map((product) => {
        const pt = transactions.filter(element => {return element.product == product.id});

        const sum = pt.reduce((acc, item) => item.type == "Revenue" ? acc + item.price : acc - item.price, 0);

        console.log(sum);

        cpp.push({...product, sum: sum});
      });
      
      const c = cpp.sort((a, b) => b.sum - a.sum)

      setCPP(c);
    }
  }, [products]);

  useEffect(() => {
    if (subscriptions) {
      const cps = [];
      
      subscriptions.map((subscription) => {
        const pt = transactions.filter(element => {return element.product == subscription.id});

        const sum = pt.reduce((acc, item) => item.type == "Revenue" ? acc + item.price : acc - item.price, 0);

        console.log(sum);

        cps.push({...subscription, sum: sum});
      });
      
      const c = cps.sort((a, b) => b.sum - a.sum)

      setCPS(c);
    }
  }, [setSubscriptions]);

  useEffect(() => {
    if (transactions && ytd && month && allTime && cpp && cps) {
      setLoading(false);
    }
  }, [transactions, ytd, month, allTime, products, cpp, cps]);

  if (loading) {
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }

  return (
    <View useSafeArea flex backgroundColor={Colors.white}>
      <KeyboardAwareScrollView contentContainerStyle={global.flexGrow} showsVerticalScrollIndicator={Platform.OS == "web"}>
        <Cashflow allTimeSum={allTimeSum} ytdSum={ytdSum} monthSum={monthSum} />
        <Products cpp={cpp} />
        <Subscriptions cps={cps} />
      </KeyboardAwareScrollView>
    </View>
  );
}

export default Dashboard