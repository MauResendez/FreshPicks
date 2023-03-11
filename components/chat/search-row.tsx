import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Avatar, ListItem, Text } from "react-native-ui-lib";

const SearchRow = ({ farmer, cover, business, name, address }) => {
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
      onPress={() => chatWithFarmer(farmer)}
      underlayColor="black"
    >
      <ListItem.Part left>
        <Avatar source={{ uri: cover }} size={50} containerStyle={{ marginRight: 8 }}/>
      </ListItem.Part>
      <ListItem.Part column>
        <Text h2 numberOfLines={1}>{business}</Text>
        <Text h3>{address}</Text>
      </ListItem.Part>
    </ListItem>
  )
}

export default SearchRow