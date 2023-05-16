import { useNavigation } from "@react-navigation/native";
import React, { memo } from "react";
import { ListItem, Text } from "react-native-ui-lib";

const SearchRow = (props) => {
  const {item} = props;
  const navigation = useNavigation<any>();

  const chatWithFarmer = (farmer) => {
    navigation.navigate("Profile", { id: farmer })
  }

  return (
    <ListItem
      activeBackgroundColor={"white"}
      activeOpacity={0.3}
      containerStyle={{ borderBottomWidth: 1 }}
      divider
			style={{ backgroundColor: "white", padding: 8, height: "auto" }}
      height={60}
      onPress={() => chatWithFarmer(item.farmer)}
      underlayColor="black"
    >
      <ListItem.Part left>
      </ListItem.Part>
      <ListItem.Part column>
        <Text h2 numberOfLines={1}>{item.business}</Text>
        <Text h3>{item.address}</Text>
      </ListItem.Part>
    </ListItem>
  )
}

export default memo(SearchRow);