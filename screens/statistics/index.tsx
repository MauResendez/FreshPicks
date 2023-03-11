import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native-ui-lib";
import Loading from "../../components/extra/loading";
import { auth, db } from "../../firebase";
import { global } from "../../style";

const Statistics = () => {
  const [listings, setListings] = useState(null);
  const [head, setHead] = useState(["Price", "ID", "Quantity", "Image", "Title", "Description", "Farmer"]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    onSnapshot(query(collection(db, "Listings"), where("user", "==", auth.currentUser.uid)), async (snapshot) => {
      setListings(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    });
  }, []);

  useEffect(() => {
    if (listings) {
      setData(listings.map(Object.values));
    }
  }, [listings]);

  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, [data]);

  if (loading) {
    <Loading />
  }

  return (
    <View useSafeArea flex style={global.bgGray}>
      <Text h3>Coming Soon</Text>
    </View>
  )
}

export default Statistics