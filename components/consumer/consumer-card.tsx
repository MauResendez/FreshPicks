import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Image, Text, View } from "react-native-ui-lib";

const ConsumerCard = ({
  id,
  image,
  title
}) => {
  const navigation = useNavigation<any>();

  const handlePress = () => {
    navigation.navigate("Profile", {
      id
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.content}>
        <View row>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ConsumerCard;

const styles = StyleSheet.create({
  card: {
    width: 250,
    height: "auto",
    marginRight: 16,
    backgroundColor: "white", 
  },
  image: {
    width: "100%",
    height: 150, 
    borderRadius: 2 
  },
  content: {
    paddingHorizontal: 12,
    paddingBottom: 16
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  title: {
    paddingTop: 8, 
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "700"
  },
  subtitle: {
    color: "#059669"
  },
  description: {
    flexDirection: "row",
    alignItems: "center"
  },
  rating: {
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 24
  },
  ratingContent: {
    color: "#059669"
  }
});