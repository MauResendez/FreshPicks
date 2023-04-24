import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "react-native-ui-lib";
import Ionicon from "react-native-vector-icons/Ionicons";
import ProductCard from "./product-card";

const ProductList = ({ title, description, products }) => {
  const navigation = useNavigation<any>();
  const handlePress = (user) => {
    navigation.navigate("Profile", {
      id: user
    });
  };

  return (
    <View>
      <View style={styles.title}>
        <Text style={styles.titleText}>{title}</Text>
        <Ionicon name={"arrow-forward"} size={36} onPress={() => navigation.navigate("Products")}/>
      </View>

      <Text style={styles.description}>{description}</Text>

      <FlashList 
        data={products}
        keyExtractor={(item: any) => item.id}
        horizontal
        contentContainerStyle={{ padding: 15 }}
        showsHorizontalScrollIndicator={false}
        estimatedItemSize={products.length}
        renderItem={({item}) => (
          <ProductCard
            key={item?.id}
            id={item?.id}
            image={item?.image}
            title={item?.title}
            subtitle={item?.description}
            price={item?.price}
            quantity={item?.quantity}
            farmer={item?.user}
          />
        )}
      />
    </View>
  );
};

export default ProductList;

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