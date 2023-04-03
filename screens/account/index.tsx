import { useNavigation } from "@react-navigation/native";
import { Platform } from "expo-modules-core";
import * as Notifications from 'expo-notifications';
import { deleteUser, signOut } from "firebase/auth";
import { arrayRemove, doc, onSnapshot, updateDoc } from "firebase/firestore";
import * as React from "react";
import { useEffect, useLayoutEffect, useState } from "react";
import { Alert, ScrollView, Share, StyleSheet } from "react-native";
import { Avatar, Chip, Colors, Image, ListItem, LoaderScreen, Text, View } from "react-native-ui-lib";
import { auth, db } from "../../firebase";
import { global } from "../../style";


const Account = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState<any>(true);

  const deleteAccount = async () => {
    // Delete everything from database that has current user
    deleteUser(auth.currentUser);
  }

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
    await updateDoc(doc(db, "Users", auth.currentUser.uid), { role: !user.role }).then(() => {
      // Toast.show("Switched roles", {
      //   duration: Toast.durations.SHORT,
      //   backgroundColor: "orange",
      //   position: Platform.OS == "web" ? 650 : 700
      // });
    });
  }

  useEffect(() => {
    getToken();
  }, [])

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "Users", auth.currentUser.uid), (doc) => {
      setUser(doc.data());
    });

    return unsubscribe
  }, [auth.currentUser.uid]);

  useEffect(() => {
    if (user && token) {
      setLoading(false);
    }
  }, [user, token]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, []);

  if (loading) {
    return (
      <LoaderScreen />
    )
  }
  
  return (
    <View useSafeArea flex>
      <ScrollView
        showsVerticalScrollIndicator={Platform.OS == "web"}
      >
        <View style={styles.cover}>
          <Image source={{ uri: user.cover }} style={styles.image} />
        </View>

        <View style={styles.header}>
          <View row>
            {user.logo ? (
              <Avatar
                size={75}
                source={{ uri: user.logo }}
              />
            ) : (
              <Avatar
                size={75}
                source={require("../../assets/profile.png")}
              />
            )}
          </View>

          <View row>
            {user.role ? (
              <Text h2>{user.business}</Text>
            ) : (
              <Text h2>{user.name}</Text>
            )}
          </View>

          <View row>
            <Text h3>{user.address}</Text>
          </View>

          <View row>
            {user.role && <Text h3>{user.description}</Text>}
          </View>

          {/* <View row>
            {user.role && <Text style={{ paddingTop: 4, paddingBottom: 8 }}>{user.rating?.toFixed(2)}/5 Rating</Text>}
          </View> */}

          <View row style={[global.spaceBetween, global.flexWrap]}>
            {user.role && user?.payments?.paypal && (
              <Chip
                backgroundColor="#0079C1"
                containerStyle={{ paddingVertical: 8, marginVertical: 8 }}
                label={"PayPal: " + user.payments.paypal}
                labelStyle={{ color: "white" }}
              />
            )}

            {user.role && user?.payments?.cashapp && (
              <Chip
                backgroundColor="#00D632"
                containerStyle={{ paddingVertical: 8, marginVertical: 8 }}
                label={"CashApp: " + user.payments.cashapp}
                labelStyle={{ color: "white" }}
              />
            )}

            {user.role && user?.payments?.venmo && (
              <Chip
                backgroundColor="#008CFF"
                containerStyle={{ paddingVertical: 8, marginVertical: 8 }}
                label={"Venmo: " + user.payments.venmo}
                labelStyle={{ color: "white" }}
              />
            )}
          </View>

        </View>
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
              Switch to {user.role ? "Consumer Role" : "Farmer Role"}
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
          onPress={() => navigation.navigate("Update Personal Information")}
        >
          <ListItem.Part column containerStyle={[{backgroundColor: "white", paddingHorizontal: 15}]}>
            <Text h3 numberOfLines={1}>
              Update Personal Information
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
          onPress={() => navigation.navigate("Order History")}
        >
          <ListItem.Part column containerStyle={[{backgroundColor: "white", paddingHorizontal: 15}]}>
            <Text h3 numberOfLines={1}>
              My Order History
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
            onPress={() => navigation.navigate("Update Farmer Information")}
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
            onPress={() => navigation.navigate("Update Farmer Schedule")}
          >
            <ListItem.Part column containerStyle={[{backgroundColor: "white", paddingHorizontal: 15}]}>
              <Text h3 numberOfLines={1}>
                Update Farmer Schedule
              </Text>
            </ListItem.Part>
          </ListItem>
        )}
        {user?.farmer && (
          <ListItem
            backgroundColor={Colors.white}
            activeOpacity={0.3}
            height={60}
            onPress={() => navigation.navigate("Update Payment Information")}
          >
            <ListItem.Part column containerStyle={[{backgroundColor: "white", paddingHorizontal: 15}]}>
              <Text h3 numberOfLines={1}>
                Update Payment Information
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
              Other
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
          onPress={() => {
            Alert.alert("Delete Account", "Would you like to delete your account?", [
              {text: 'Cancel', style: 'cancel'},
              {text: 'OK', onPress: logOut},
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

const styles = StyleSheet.create({
  padding: {
    paddingVertical: 0
  },
  header: {
    backgroundColor: "white",
    padding: 16 
  },
  cover: {
    flex: 1,
    height: "auto",
    width: "100%",
  },
  logo: {
    flex: 1,
    height: "auto",
    width: "100%",
  },
  image: {
    ...Platform.select({
      web: {
        padding: 16, 
        width: "100%", 
        height: 250 
      },
      ios: {
        padding: 16, 
        width: "100%", 
        height: 200 
      },
      android: {
        padding: 16, 
        width: "100%", 
        height: 200
      }
    })
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  address: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    textAlign: "center"
  },
  update: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 300,
    padding: 16
  },
  payments: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    width: "100%",
    paddingHorizontal: 16
  },
  info: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 20,
  },
  infoItem: {
    justifyContent: "center",
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  infoSubtitle: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  tab: {
    height: "100%",
    flexDirection: "row"
  },
  text: {
    fontSize: 20,
    lineHeight: 20,
    letterSpacing: 1,
    color: "white",
  },
  buttons: {
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 4,
    elevation: 2,
    backgroundColor: "#ff4500",
    marginHorizontal: 0,
    paddingVertical: 12,
  },
  activeTabTextColor: {
    color: "#eeaf3b"
  },
  tabTextColor: {
    color: "black"
  },
  button: {
    width: "100%"
  },
  subtitle: {
    padding: 12,
    marginTop: 4
  }
});

export default Account;