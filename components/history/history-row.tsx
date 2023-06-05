import { useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import React, { memo, useEffect, useState } from "react";
import { Colors, ListItem, Text, View } from "react-native-ui-lib";
import { db } from "../../firebase";
import { global } from "../../style";

const HistoryRow = (props) => {
  const {item} = props;
  const navigation = useNavigation<any>();
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);

	const onPress = () => {
		navigation.navigate("Order", { id: item.id })
	}

  useEffect(() => {
    if (item) {
      getDoc(doc(db, "Users", item.farmer)).then((docSnapshot) => {
        const data = docSnapshot.data();
    
        setFarmer({...data, id: item.farmer});
      });
    }
  }, [item]);

  useEffect(() => {
    if (farmer) {
      setLoading(false);
    }
  }, [farmer]);

  if (loading) {
    return null
  }

  return (
    <ListItem
      activeBackgroundColor={Colors.grey60}
      activeOpacity={0.3}
      backgroundColor={Colors.white}
      onPress={onPress}
      style={{ padding: 8, height: "auto" }}
    >
      <ListItem.Part middle column>
        <View row style={global.spaceBetween}>
          <Text h2>{farmer.business}</Text>
          <Text h2>Cost: ${item.total.toFixed(2)}</Text>
        </View>
        <View row style={global.spaceBetween}>
          <Text h3>{farmer?.address}</Text>
          <Text h3>{item.status}</Text>
        </View>
      </ListItem.Part>
    </ListItem>
  )
}

export default memo(HistoryRow);