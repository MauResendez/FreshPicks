import { useNavigation } from "@react-navigation/native";
import { Platform } from "expo-modules-core";
import * as Notifications from 'expo-notifications';
import { signOut } from "firebase/auth";
import { arrayRemove, doc, onSnapshot, updateDoc } from "firebase/firestore";
import * as React from "react";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Share } from "react-native";
import { Colors, ListItem, LoaderScreen, Text, View } from "react-native-ui-lib";
import { auth, db } from "../../firebase";

const Settings = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState<any>(true);

  const getToken = async () => {
    let token = await Notifications.getExpoPushTokenAsync();

    setToken(token.data);
  }

  const logOut = async () => {
    await updateDoc(doc(db, "Users", auth.currentUser.uid), {
      token: arrayRemove(token)
    });

    signOut(auth);
  }

  const deleteAccount = async () => {
    try {
      const response = await fetch("https://us-central1-utrgvfreshpicks.cloudfunctions.net/deleteAccount", {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'data': {
            'uid': auth.currentUser.uid,
          }
        }),
      });

      console.log(response);

      const json = await response.json();

      console.log(json);

      auth.currentUser.reload();

      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const share = async () => {
    const options = {
      title: 'Fresh Picks by UTRGV',
      message: 'Find the best fresh produce in the RGV with Fresh Picks by UTRGV',
      url: require("../../assets/image.png")
    }

    try {
      const response = await Share.share(options);
    } catch (error) {
      
    }
  }

  const switchRoles = async () => {
    if (user.role === "Farmer") {
      await updateDoc(doc(db, "Users", auth.currentUser.uid), { role: "Consumer" }).then(() => {
        // Toast.show("Switched roles", {
        //   duration: Toast.durations.SHORT,
        //   backgroundColor: "orange",
        //   position: Platform.OS == "web" ? 650 : 700
        // });
      });
    } else {
      await updateDoc(doc(db, "Users", auth.currentUser.uid), { role: "Farmer" }).then(() => {
        // Toast.show("Switched roles", {
        //   duration: Toast.durations.SHORT,
        //   backgroundColor: "orange",
        //   position: Platform.OS == "web" ? 650 : 700
        // });
      });
    }
    // await updateDoc(doc(db, "Users", auth.currentUser.uid), { role: !user.role }).then(() => {
    //   // Toast.show("Switched roles", {
    //   //   duration: Toast.durations.SHORT,
    //   //   backgroundColor: "orange",
    //   //   position: Platform.OS == "web" ? 650 : 700
    //   // });
    // });
  }

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    const subscriber = onSnapshot(doc(db, "Users", auth.currentUser.uid), (doc) => {
      setUser(doc.data());
    });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, [auth.currentUser.uid]);

  useEffect(() => {
    if (user && token) {
      setLoading(false);
    }
  }, [user, token]);

  if (loading) {
    return (
      <LoaderScreen color={"#32CD32"} />
    )
  }
  
  return (
    <View useSafeArea flex>
      <ScrollView showsVerticalScrollIndicator={Platform.OS == "web"}>
        <ListItem
          activeBackgroundColor={Colors.grey60}
          activeOpacity={0.3}
          height={60}
        >
          <ListItem.Part containerStyle={[{paddingHorizontal: 15}]}>
            <Text h2 numberOfLines={1}>
              Roles
            </Text>
          </ListItem.Part>
        </ListItem>
        <ListItem
          backgroundColor={Colors.white}
          activeOpacity={0.3}
          height={60}
          onPress={() => {
            Alert.alert("Switch Roles", "Would you like to switch roles?", [
              {text: 'Cancel', style: 'cancel'},
              {text: 'OK', onPress: switchRoles},
            ]);
          }}
        >
          <ListItem.Part column containerStyle={[{backgroundColor: "white", paddingHorizontal: 15}]}>
            <Text h3 numberOfLines={1}>
              Switch to {user.role === "Farmer" ? "Consumer Role" : "Farmer Role"}
            </Text>
          </ListItem.Part>
        </ListItem>
        <ListItem
          activeBackgroundColor={Colors.grey60}
          activeOpacity={0.3}
          height={60}
        >
          <ListItem.Part containerStyle={[{paddingHorizontal: 15}]}>
            <Text h2 numberOfLines={1}>
              App
            </Text>
          </ListItem.Part>
        </ListItem>
        <ListItem
          backgroundColor={Colors.white}
          activeOpacity={0.3}
          height={60}
          onPress={share}
        >
          <ListItem.Part column containerStyle={[{backgroundColor: "white", paddingHorizontal: 15}]}>
            <Text h3 numberOfLines={1}>
              Report an issue
            </Text>
          </ListItem.Part>
        </ListItem>
        <ListItem
          backgroundColor={Colors.white}
          activeOpacity={0.3}
          height={60}
          onPress={share}
        >
          <ListItem.Part column containerStyle={[{backgroundColor: "white", paddingHorizontal: 15}]}>
            <Text h3 numberOfLines={1}>
              Share with your friends
            </Text>
          </ListItem.Part>
        </ListItem>
        <ListItem
          activeBackgroundColor={Colors.grey60}
          activeOpacity={0.3}
          height={60}
        >
          <ListItem.Part containerStyle={[{paddingHorizontal: 15}]}>
            <Text h2 numberOfLines={1}>
              Account
            </Text>
          </ListItem.Part>
        </ListItem>
        <ListItem
          backgroundColor={Colors.white}
          activeOpacity={0.3}
          height={60}
          onPress={() => navigation.navigate("Change Phone")}
        >
          <ListItem.Part column containerStyle={[{backgroundColor: "white", paddingHorizontal: 15}]}>
            <Text h3 numberOfLines={1}>
              Change Phone
            </Text>
          </ListItem.Part>
        </ListItem>
        <ListItem
          backgroundColor={Colors.white}
          activeOpacity={0.3}
          height={60}
          onPress={() => navigation.navigate("Link Account")}
        >
          <ListItem.Part column containerStyle={[{backgroundColor: "white", paddingHorizontal: 15}]}>
            <Text h3 numberOfLines={1}>
              Link Account
            </Text>
          </ListItem.Part>
        </ListItem>
        <ListItem
          activeBackgroundColor={Colors.grey60}
          activeOpacity={0.3}
          height={60}
        >
          <ListItem.Part containerStyle={[{paddingHorizontal: 15}]}>
            <Text h2 numberOfLines={1}>
              Consumer
            </Text>
          </ListItem.Part>
        </ListItem>
        <ListItem
          backgroundColor={Colors.white}
          activeOpacity={0.3}
          height={60}
          onPress={() => navigation.navigate("Personal Information")}
        >
          <ListItem.Part column containerStyle={[{backgroundColor: "white", paddingHorizontal: 15}]}>
            <Text h3 numberOfLines={1}>
              Update Personal Information
            </Text>
          </ListItem.Part>
        </ListItem>
        {/* <ListItem
          backgroundColor={Colors.white}
          activeOpacity={0.3}
          height={60}
          onPress={() => navigation.navigate("Order History")}
        >
          <ListItem.Part column containerStyle={[{backgroundColor: "white", paddingHorizontal: 15}]}>
            <Text h3 numberOfLines={1}>
              My Order History
            </Text>
          </ListItem.Part>
        </ListItem> */}
        <ListItem
          activeBackgroundColor={Colors.grey60}
          activeOpacity={0.3}
          height={60}
        >
          <ListItem.Part containerStyle={[{paddingHorizontal: 15}]}>
            <Text h2 numberOfLines={1}>
              Farmer
            </Text>
          </ListItem.Part>
        </ListItem>
        {!user?.farmer && (
          <ListItem
            backgroundColor={Colors.white}
            activeOpacity={0.3}
            height={60}
            onPress={() => navigation.navigate("Add Your Business")}
          >
            <ListItem.Part column containerStyle={[{backgroundColor: "white", paddingHorizontal: 15}]}>
              <Text h3 numberOfLines={1}>
                Add Your Business
              </Text>
            </ListItem.Part>
          </ListItem>
        )}
        {user?.farmer && (
          <ListItem
            backgroundColor={Colors.white}
            activeOpacity={0.3}
            height={60}
            onPress={() => navigation.navigate("Farmer Information")}
          >
            <ListItem.Part column containerStyle={[{backgroundColor: "white", paddingHorizontal: 15}]}>
              <Text h3 numberOfLines={1}>
                Update Farmer Information
              </Text>
            </ListItem.Part>
          </ListItem>
        )}
        {user?.farmer && (
          <ListItem
            backgroundColor={Colors.white}
            activeOpacity={0.3}
            height={60}
            onPress={() => navigation.navigate("Farmer Location")}
          >
            <ListItem.Part column containerStyle={[{backgroundColor: "white", paddingHorizontal: 15}]}>
              <Text h3 numberOfLines={1}>
                Update Farmer Location
              </Text>
            </ListItem.Part>
          </ListItem>
        )}
        {user?.farmer && (
          <ListItem
            backgroundColor={Colors.white}
            activeOpacity={0.3}
            height={60}
            onPress={() => navigation.navigate("Farmer Schedule")}
          >
            <ListItem.Part column containerStyle={[{backgroundColor: "white", paddingHorizontal: 15}]}>
              <Text h3 numberOfLines={1}>
                Update Farmer Schedule
              </Text>
            </ListItem.Part>
          </ListItem>
        )}
        <ListItem
          activeBackgroundColor={Colors.grey60}
          activeOpacity={0.3}
          height={60}
        >
          <ListItem.Part containerStyle={[{paddingHorizontal: 15}]}>
            <Text h2 numberOfLines={1}>
              UTRGV
            </Text>
          </ListItem.Part>
        </ListItem>
        <ListItem
          backgroundColor={Colors.white}
          activeOpacity={0.3}
          height={60}
          onPress={share}
        >
          <ListItem.Part column containerStyle={[{backgroundColor: "white", paddingHorizontal: 15}]}>
            <Text h3 numberOfLines={1}>
              About Us
            </Text>
          </ListItem.Part>
        </ListItem>
        <ListItem
          activeBackgroundColor={Colors.grey60}
          activeOpacity={0.3}
          height={60}
        >
          <ListItem.Part containerStyle={[{paddingHorizontal: 15}]}>
            <Text h2 numberOfLines={1}>
              Other
            </Text>
          </ListItem.Part>
        </ListItem>
        <ListItem
          backgroundColor={Colors.white}
          activeOpacity={0.3}
          height={60}
          onPress={() => {
            Alert.alert("Log Out", "Would you like to log out of your account?", [
              {text: 'Cancel', style: 'cancel'},
              {text: 'OK', onPress: logOut},
            ]);
          }}
        >
          <ListItem.Part column containerStyle={[{backgroundColor: "white", paddingHorizontal: 15}]}>
            <Text h3 numberOfLines={1}>
              Log Out
            </Text>
          </ListItem.Part>
        </ListItem>
        <ListItem
          backgroundColor={Colors.white}
          activeOpacity={0.3}
          height={60}
          onPress={async () => {
            Alert.alert("Delete Account", "Would you like to delete your account?", [
              {text: 'Cancel', style: 'cancel'},
              {text: 'OK', onPress: async () => {
                await deleteAccount();
                // await auth.updateCurrentUser(null);
                // await auth.currentUser.reload();
                // auth.currentUser.refreshToken;
              }},
            ]);
          }}
        >
          <ListItem.Part column containerStyle={[{backgroundColor: "white", paddingHorizontal: 15}]}>
            <Text h3 numberOfLines={1}>
              Delete Account
            </Text>
          </ListItem.Part>
        </ListItem>
        {/* <Dialog
          isVisible={visible}
          onDismiss={toggleDialog}
          panDirection={PanningProvider.Directions.DOWN}
        >
          <Dialog.Title title="Would you like to switch roles?" />
          <Dialog.Actions>
            <Dialog.Button
              title="OK"
              onPress={async () => {
                switchRoles();
              }}
            />
            <Dialog.Button title="Cancel" onPress={toggleDialog} />
          </Dialog.Actions>
        </Dialog> */}
      </ScrollView>
    </View>
  );
}

export default Settings;