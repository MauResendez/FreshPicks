import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, Image, Text, View } from 'react-native-ui-lib';
import { global } from '../../style';
import Row from '../extra/row';

const Card = ({
  id,
  business,
  address,
  logo,
  message,
  image
}) => {
  return (
    <TouchableOpacity style={global.card}>
      <View style={global.cardContent}>
        <Row>
          {logo && <Avatar size={50} source={{ uri: logo }} containerStyle={{ marginRight: 8 }} />}
          <Text h2>{business}</Text>
        </Row>        
        <Text h3>{address}</Text>

        <Text style={[global.liItem, styles.message]}>{message}</Text>
        {image && <Image style={global.cardImg} source={{ uri: image }} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  message: {
    color: "#059669"
  },
});

export default Card