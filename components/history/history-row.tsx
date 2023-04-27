import { useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import React, { memo, useEffect, useState } from "react";
import { Colors, ListItem, LoaderScreen, Text, View } from "react-native-ui-lib";
import { db } from "../../firebase";
import { global } from "../../style";

const HistoryRow = (meeting) => {
  const navigation = useNavigation<any>();
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (meeting) {
      getDoc(doc(db, "Users", meeting.farmer)).then((docSnapshot) => {
        const data = docSnapshot.data();
    
        setFarmer({...data, id: meeting.farmer});
      });
    }
  }, [meeting]);

  useEffect(() => {
    if (farmer) {
      setLoading(false);
    }
  }, [farmer]);

  if (loading) {
    return (
      <LoaderScreen color={"#32CD32"} />
    )
  }

  return (
    <ListItem
      activeBackgroundColor={Colors.grey60}
      activeOpacity={0.3}
      backgroundColor={Colors.white}
      onPress={() => navigation.navigate("Meeting")}
      style={{ borderRadius: 8, marginBottom: 8, padding: 8, height: "auto" }}
    >
      <ListItem.Part middle column>
        <View row style={global.spaceBetween}>
          <Text h2>{farmer.business}</Text>
          {/* <Text h2>{meeting.createdAt}</Text> */}
        </View>
        <View row style={global.spaceBetween}>
          <Text h3>{farmer?.address}</Text>
          <Text h3>Total Cost: ${meeting.total}</Text>
        </View>
      </ListItem.Part>
    </ListItem>
  )
}

export default memo(HistoryRow);