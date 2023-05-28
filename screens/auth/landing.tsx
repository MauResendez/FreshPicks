import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { useLayoutEffect } from "react";
import { Image, ImageBackground } from "react-native";
import { Button, Colors, View } from "react-native-ui-lib";
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
        <View flex style={[global.container, global.spaceBetween]}>
          <Image style={{ width: "auto", height: 100, marginTop: 32 }} source={require("../../assets/logo.png")} resizeMode="contain" />

          <View style={global.field}>
            <Button 
              backgroundColor={"#ff4500"}
              color={Colors.white}
              label={"Register"} 
              labelStyle={{ fontWeight: '600', padding: 4 }} 
              style={global.btnTest} 
              onPress={() => navigation.navigate("Register")}  
            />

            <Button 
              backgroundColor={Colors.white}
              color={Colors.black}
              label={"Login"} 
              labelStyle={{ fontWeight: '600', padding: 8 }} 
              style={global.btnTest} 
              onPress={() => navigation.navigate("Login")}  
            />
          </View>   
        </View>
      </View>
    </ImageBackground>
  )
}

export default Landing