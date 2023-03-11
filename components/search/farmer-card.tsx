import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Card, Text, View } from "react-native-ui-lib";

const FarmerCard = ({
  id,
  image,
  title,
  subtitle,
  rating,
}) => {
  const navigation = useNavigation<any>();

  const handlePress = () => {
    navigation.navigate("Profile", {
      id
    });
  };

  return (
    <Card style={{ width: 250, height: "auto", marginRight: 16 }} onPress={() => handlePress()}>
      <Card.Image source={{ uri: image }} height={125} />
      <View padding-12>
        <Text h2>
          {title}
        </Text>
        <Text h3>
          {subtitle}
        </Text>
        {/* <Text text80 $textDefault>
          Rating: {rating.toFixed(2)}/5
        </Text> */}
      </View>
    </Card>
  );
};

export default FarmerCard;