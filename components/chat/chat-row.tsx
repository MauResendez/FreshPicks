import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Avatar, ListItem, Text } from "react-native-ui-lib";

const ChatRow = ({ chat, cover, title, subtitle }) => {
  const navigation = useNavigation<any>();

  const conversation = (farmer) => {
    navigation.navigate("Conversation", { id: chat })
  }

  return (
    <ListItem
      activeBackgroundColor={"white"}
      activeOpacity={0.3}
			style={{ backgroundColor: "white", padding: 8, height: "auto" }}
      onPress={() => conversation(chat)}
    >
      <ListItem.Part left>
        <Avatar source={{ uri: cover }} size={50} containerStyle={{ marginRight: 8 }}/>
      </ListItem.Part>
      <ListItem.Part column>
        <Text h2 numberOfLines={1}>{title}</Text>
        <Text h3>{subtitle}</Text>
      </ListItem.Part>
    </ListItem>
  )
}

export default ChatRow