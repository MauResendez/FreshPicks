import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { Text, TouchableOpacity, View } from "react-native-ui-lib";
import { global } from "../../style";

const Role = () => {
  const navigation = useNavigation<any>();

  return (
    <View useSafeArea flex>
      <View style={[global.container, global.spaceBetween]}>
        <View style={global.field}>
          <Text style={[global.title, global.centerText]}>Farmer or Consumer?</Text>
        </View>

        <View style={global.field}>
          <TouchableOpacity style={[global.btn, global.bgOrange]} onPress={() => navigation.navigate("Register", { farmer: true })}>
            <Text style={[global.btnText, global.white]}>Farmer</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[global.btn, global.bgWhite]} onPress={() => navigation.navigate("Register", { farmer: false })}>
            <Text style={[global.btnText, global.black]}>Consumer</Text>
          </TouchableOpacity>
        </View> 
      </View>
    </View>
  )
}

export default Role