import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback } from "react";
import { Text, View } from "react-native-ui-lib";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import ProductCard from "./product-card";

const ProductList = ({ title, description, products }) => {
  const navigation = useNavigation<any>();

  const renderItem = useCallback(({item}) => {
    return (
      <ProductCard item={item} />
    );
  }, []);

  return (
    <View>
      <View row spread marginH-16 marginT-16 centerV>
        <View>
          <Text text65 marginV-4>{title}</Text>      
          <Text text90L marginV-4>{description}</Text>
        </View>

        <MCIcon name={"arrow-right"} size={32} onPress={() => navigation.navigate("Products")}/>
      </View>


      <FlashList 
        data={products}
        keyExtractor={(item: any) => item.id}
        horizontal
        contentContainerStyle={{ padding: 16 }}
        showsHorizontalScrollIndicator={false}
        estimatedItemSize={products.length != 0 ? products.length : 150}
        renderItem={renderItem}
      />
    </View>
  );
};

export default ProductList;