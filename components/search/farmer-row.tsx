import { useNavigation } from "@react-navigation/native";
import React from "react";
import { FlatList, Platform, StyleSheet } from "react-native";
import { Text, View } from "react-native-ui-lib";
import Ionicon from "react-native-vector-icons/Ionicons";
import FarmerCard from "./farmer-card";

const FarmerRow = ({ title, description, farmers }) => {
  const navigation = useNavigation<any>();

  return (
    <View>
      <View style={styles.title}>
        <Text style={styles.titleText}>{title}</Text>
        <Ionicon name={"arrow-forward"} size={36} onPress={() => navigation.navigate("Farmers")}/>
      </View>

      <Text style={styles.description}>{description}</Text>

      <FlatList 
        data={farmers}
        keyExtractor={item => item.id}
        horizontal
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
        showsHorizontalScrollIndicator={Platform.OS == "web"}
        style={styles.body}
        renderItem={({item}) => (
          <FarmerCard
            key={item?.id}
            id={item?.id}
            image={item?.cover}
            title={item.business ? item.business : item.name}
            subtitle={item.address}
            rating={item?.rating}
          />
        )}
      />
    </View>
  );
};

export default FarmerRow;

const styles = StyleSheet.create({
  title: {
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  titleText: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "700"
  },
  description: {
    paddingLeft: 16,
    paddingRight: 16,
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 16
  },
  body: {
    paddingTop: 16
  }
});