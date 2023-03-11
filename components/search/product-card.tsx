import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Card, Text, View } from "react-native-ui-lib";

const ProductCard = ({
  id,
  image,
  title,
  subtitle,
  price,
  quantity,
  farmer
}) => {
  const navigation = useNavigation<any>();

  const handlePress = () => {
    navigation.navigate("Profile", {
      id: farmer
    });
  };

  return (
    // <TouchableOpacity style={styles.card} onPress={handlePress}>
    //   {quantity > 0 
    //     ? <Image source={{ uri: image }} style={styles.image} />
    //     : <ImageBackground source={{ uri: image }} style={styles.image} imageStyle={{ opacity: 0.2, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
    //         <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center" }}>
    //           <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center" }}>Out of stock</Text>
    //         </View>
    //       </ImageBackground>
    //   }
    //   <View style={styles.products}>
    //     <View style={styles.row}>
    //       <Text style={styles.title}>{title}</Text>
    //     </View>

    //     <View style={styles.row}>
    //       <Text style={styles.subtitle}>{subtitle}</Text>
    //     </View>

    //     <View style={styles.row}>
    //       <Text style={styles.content}>${price.toFixed(2)}/lb · {quantity} remaining</Text>
    //     </View>
    //   </View>
    // </TouchableOpacity>
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
          ${price}
        </Text> */}
      </View>
    </Card>
  );
};

export default ProductCard;