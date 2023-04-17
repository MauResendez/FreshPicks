import React from 'react';
import { Card, Text, View } from 'react-native-ui-lib';

const PostCard = ({
  id,
  business,
  address,
  title,
  description,
  image
}) => {
  return (
    // <TouchableOpacity style={global.card}>
    //   <View style={global.cardContent}>
    //     <Row>
    //       {logo && <Avatar size={50} source={{ uri: logo }} containerStyle={{ marginRight: 8 }} />}
    //       <Text h2>{business}</Text>
    //     </Row>        
    //     <Text h3>{address}</Text>

    //     <Text style={[global.liItem, styles.message]}>{message}</Text>
    //     {image && <Image style={global.cardImg} source={{ uri: image }} />}
    //   </View>
    // </TouchableOpacity>
    <Card style={{ width: "100%", height: 250 }}>
      <Card.Image source={{ uri: image }} resizeMode='cover' />
      <View padding-12>
        <Text h2>
          {title}
        </Text>
        <Text h3>
          {description}
        </Text>
      </View>
    </Card>
  );
}

export default PostCard