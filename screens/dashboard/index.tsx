import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect } from "react";
import {
  TouchableOpacity,
} from "react-native";
import { Text, View } from "react-native-ui-lib";
import { global } from "../../style";

const Dashboard = () => {
  const navigation = useNavigation<any>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, []);

  return (
    <View useSafeArea flex>
      <View style={[global.container, global.spaceBetween]}>
        <View>
          <Text subtitle>Listings</Text>

          <View row style={[global.field, global.spaceBetween]}>
            <TouchableOpacity style={[global.btn2, global.bgOrange]} onPress={() => navigation.navigate("Create Listing")}>
              <Text style={[global.btnText, global.white]}>Create</Text>
            </TouchableOpacity>

            <View flexG />

            <TouchableOpacity style={[global.btn2, global.bgOrange]} onPress={() => navigation.navigate("Listings")}>
              <Text style={[global.btnText, global.white]}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text subtitle>Subscriptions</Text>

          <View row style={[global.field, global.spaceBetween]}>
            <TouchableOpacity style={[global.btn2, global.bgOrange]} onPress={() => navigation.navigate("Create Subscription")}>
              <Text style={[global.btnText, global.white]}>Back</Text>
            </TouchableOpacity>

            <View flexG />

            <TouchableOpacity style={[global.btn2, global.bgOrange]} onPress={() => navigation.navigate("Subscriptions")}>
              <Text style={[global.btnText, global.white]}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text subtitle>Posts</Text>

          <View row style={[global.field, global.spaceBetween]}>
            <TouchableOpacity style={[global.btn2, global.bgOrange]} onPress={() => navigation.navigate("Create Post")}>
              <Text style={[global.btnText, global.white]}>Back</Text>
            </TouchableOpacity>

            <View flexG />

            <TouchableOpacity style={[global.btn2, global.bgOrange]} onPress={() => navigation.navigate("Posts")}>
              <Text style={[global.btnText, global.white]}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

export default Dashboard