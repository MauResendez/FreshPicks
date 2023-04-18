import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { useLayoutEffect } from "react";
import { Image, ImageBackground, TouchableOpacity } from "react-native";
import { Text, View } from "react-native-ui-lib";
import { global } from "../../style";

const Landing = () => {
  const navigation = useNavigation<any>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, []);

  return (
    <ImageBackground style={global.flex} source={require("../../assets/landing.png")} >
      <View useSafeArea flex>
        <View style={[global.container, global.spaceBetween]}>
          <Image style={{ width: "auto", height: 100, marginTop: 32 }} source={require("../../assets/logo.png")} resizeMode="contain" />

          <View style={global.field}>
            <TouchableOpacity style={[global.btn, global.bgOrange]} onPress={() => navigation.navigate("Register")}>
              <Text style={[global.btnText, global.white]}>Register</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[global.btn, global.bgWhite]} onPress={() => navigation.navigate("Login")}>
              <Text style={[global.btnText, global.black]}>Login</Text>
            </TouchableOpacity>
          </View>   
        </View>
      </View>
    </ImageBackground>
  )
}

export default Landing