import { useNavigation } from "@react-navigation/native";
import React, { memo } from "react";
import { Card, Text, View } from "react-native-ui-lib";

const ProductCard = (props) => {
  const {item} = props;
  const navigation = useNavigation<any>();

  const handlePress = () => {
    navigation.navigate("Profile", {
      id: item.user
    });
  };

  return (
    <Card 
      style={{ 
        width: 250,
        height: "auto",
        minHeight: 250, 
        marginRight: 16, 
        shadowColor: "#000", 
          shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 8 
      }} 
      onPress={() => handlePress()}
    >
      <Card.Image source={{ uri: item.image[0] }} height={125} />
      <View padding-12>
        <Text h2>
          {item.title}
        </Text>
        <Text h3>
          ${item.price.toFixed(2)}/{item.amount}
        </Text>
      </View>
    </Card>
  );
};

export default memo(ProductCard);