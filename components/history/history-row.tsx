import { useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import React, { memo, useEffect, useState } from "react";
import { Colors, ListItem, LoaderScreen, Text, View } from "react-native-ui-lib";
import { db } from "../../firebase";

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
    return (
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />
    )
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
        <View row spread>
          <Text text65 marginV-4>{farmer.business}</Text>
          <Text text65 marginV-4>Cost: ${item.total.toFixed(2)}</Text>
        </View>
        <View row spread>
          <Text text80M grey30 marginV-4>{farmer?.address}</Text>
          <Text text80M grey30 marginV-4>{item.status}</Text>
        </View>
      </ListItem.Part>
    </ListItem>
  )
}

export default memo(HistoryRow);