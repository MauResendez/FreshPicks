import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";
import ConsumerCard from "./consumer-card";

const ConsumerRow = ({ title, description, consumers }) => {
  return (
    <View>
      <View style={styles.title}>
        <Text style={styles.titleText}>{title}</Text>
        <Ionicon name={"arrow-forward"} size={36} />
      </View>

      <Text style={styles.description}>{description}</Text>

      <ScrollView
        horizontal
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
        showsHorizontalScrollIndicator={false}
        style={styles.body}
      >
        {consumers?.map((consumer) => (
          <ConsumerCard
            key={consumer?.id}
            id={consumer?.id}
            image={consumer?.image}
            title={consumer?.name}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default ConsumerRow;

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