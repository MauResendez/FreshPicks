import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { global } from "../../style";

const Loading = () => {
  return (
    <View style={global.container}>
      <ActivityIndicator size="large" color="#90EE90" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Loading;