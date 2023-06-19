import { useNavigation } from "@react-navigation/native";
import * as Notifications from 'expo-notifications';
import { signOut } from "firebase/auth";
import { arrayRemove, doc, onSnapshot, updateDoc } from "firebase/firestore";
import * as React from "react";
import { useEffect, useState } from "react";
import { Alert, Platform, ScrollView, Share } from "react-native";
import { Colors, ListItem, LoaderScreen, Text, View } from "react-native-ui-lib";
import { auth, db } from "../../firebase";

const Settings = () => {
  const navigation = useNavigation<any>();
  const appConfig = require("../../app.json");
  const projectId = appConfig?.expo?.extra?.eas?.projectId;
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState<any>(true);
  const url = "https://www.utrgv.edu";

  const getToken = async () => {
    let token = await Notifications.getExpoPushTokenAsync({ projectId });

    setToken(token.data);
  }

  const logOut = async () => {
    await updateDoc(doc(db, "Users", auth.currentUser.uid), {
      token: arrayRemove(token)
    });

    await signOut(auth);
  }

  const deleteAccount = async () => {
    try {
      const uid = auth.currentUser.uid;

      await signOut(auth);
      
      const response = await fetch("https://us-central1-utrgvfreshpicks.cloudfunctions.net/deleteAccount", {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'data': {
            'uid': uid,
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

  const deleteBusiness = async () => {
    try {
      const uid = auth.currentUser.uid;
      
      const response = await fetch("https://us-central1-utrgvfreshpicks.cloudfunctions.net/deleteBusiness", {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'data': {
            'uid': uid,
          }
        }),
      });

      setLoading(true);

      console.log(response);

      const json = await response.json();

      console.log(json);

      auth.currentUser.reload();

      setLoading(false);

      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const share = async () => {
    try {
      const options = {
        title: 'Fresh Picks by UTRGV',
        message: 'Find the best fresh produce in the RGV with Fresh Picks',
        url: url
      }

      const response = await Share.share(options);

      if (response.action === Share.dismissedAction) {
        console.log("Shared dismissed");
        return;
      } else if (response.action === Share.sharedAction) {
        console.log("Shared completed");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }

  const switchRoles = async () => {
    if (user.role === "Farmer") {
      await updateDoc(doc(db, "Users", auth.currentUser.uid), { role: "Consumer" });
    } else {
      await updateDoc(doc(db, "Users", auth.currentUser.uid), { role: "Farmer" });
    }
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
      <LoaderScreen color={Colors.tertiary} backgroundColor={Colors.white} overlay />    
    )
  }
  
  return (
    <View useSafeArea flex>
      <ScrollView showsVerticalScrollIndicator={Platform.OS == "web"}>
        {user?.farmer && (
          <ListItem
            activeBackgroundColor={Colors.grey60}
            activeOpacity={0.3}
            height={60}
          >
            <ListItem.Part containerStyle={[{paddingHorizontal: 16}]}>
              <Text text65 marginV-4 numberOfLines={1}>
                Roles
              </Text>
            </ListItem.Part>
          </ListItem>
        )}
        {user?.farmer && (
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
            <ListItem.Part column containerStyle={[{backgroundColor: Colors.white, paddingHorizontal: 16}]}>
              <Text text80M grey30 marginV-4 numberOfLines={1}>
                Switch to {user.role === "Farmer" ? "Consumer Role" : "Farmer Role"}
              </Text>
            </ListItem.Part>
          </ListItem>
        )}
        <ListItem
          activeBackgroundColor={Colors.grey60}
          activeOpacity={0.3}
          height={60}
        >
          <ListItem.Part containerStyle={[{paddingHorizontal: 16}]}>
            <Text text65 marginV-4 numberOfLines={1}>
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
          <ListItem.Part column containerStyle={[{backgroundColor: Colors.white, paddingHorizontal: 16}]}>
            <Text text80M grey30 marginV-4 numberOfLines={1}>
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
          <ListItem.Part column containerStyle={[{backgroundColor: Colors.white, paddingHorizontal: 16}]}>
            <Text text80M grey30 marginV-4 numberOfLines={1}>
              Share with your friends
            </Text>
          </ListItem.Part>
        </ListItem>
        <ListItem
          activeBackgroundColor={Colors.grey60}
          activeOpacity={0.3}
          height={60}
        >
          <ListItem.Part containerStyle={[{paddingHorizontal: 16}]}>
            <Text text65 marginV-4 numberOfLines={1}>
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
          <ListItem.Part column containerStyle={[{backgroundColor: Colors.white, paddingHorizontal: 16}]}>
            <Text text80M grey30 marginV-4 numberOfLines={1}>
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
          <ListItem.Part column containerStyle={[{backgroundColor: Colors.white, paddingHorizontal: 16}]}>
            <Text text80M grey30 marginV-4 numberOfLines={1}>
              Link Account
            </Text>
          </ListItem.Part>
        </ListItem>
        <ListItem
          backgroundColor={Colors.white}
          activeOpacity={0.3}
          height={60}
          onPress={() => navigation.navigate("Personal Information")}
        >
          <ListItem.Part column containerStyle={[{backgroundColor: Colors.white, paddingHorizontal: 16}]}>
            <Text text80M grey30 marginV-4 numberOfLines={1}>
              Update Personal Information
            </Text>
          </ListItem.Part>
        </ListItem>
        <ListItem
          activeBackgroundColor={Colors.grey60}
          activeOpacity={0.3}
          height={60}
        >
          <ListItem.Part containerStyle={[{paddingHorizontal: 16}]}>
            <Text text65 marginV-4 numberOfLines={1}>
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
            <ListItem.Part column containerStyle={[{backgroundColor: Colors.white, paddingHorizontal: 16}]}>
              <Text text80M grey30 marginV-4 numberOfLines={1}>
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
            onPress={async () => {
              Alert.alert("Delete Your Business", "Are you sure to delete your business?\n\n Your data will be permanently deleted.\n\n (Transactions, Orders, Products, Chats)", [
                {text: 'Cancel', style: 'cancel'},
                {text: 'OK', onPress: async () => {
                  await deleteBusiness();
                }},
              ]);
            }}
          >
            <ListItem.Part column containerStyle={[{backgroundColor: Colors.white, paddingHorizontal: 16}]}>
              <Text text80M grey30 marginV-4 numberOfLines={1}>
              Delete Your Business
              </Text>
            </ListItem.Part>
          </ListItem>
        )}
        {user?.farmer && (
          <ListItem
            backgroundColor={Colors.white}
            activeOpacity={0.3}
            height={60}
            onPress={() => navigation.navigate("Farmer Preview", { id: auth.currentUser.uid })}
          >
            <ListItem.Part column containerStyle={[{backgroundColor: Colors.white, paddingHorizontal: 16}]}>
              <Text text80M grey30 marginV-4 numberOfLines={1}>
                Preview Your Profile
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
            <ListItem.Part column containerStyle={[{backgroundColor: Colors.white, paddingHorizontal: 16}]}>
              <Text text80M grey30 marginV-4 numberOfLines={1}>
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
            <ListItem.Part column containerStyle={[{backgroundColor: Colors.white, paddingHorizontal: 16}]}>
              <Text text80M grey30 marginV-4 numberOfLines={1}>
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
            <ListItem.Part column containerStyle={[{backgroundColor: Colors.white, paddingHorizontal: 16}]}>
              <Text text80M grey30 marginV-4 numberOfLines={1}>
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
          <ListItem.Part containerStyle={[{paddingHorizontal: 16}]}>
            <Text text65 marginV-4 numberOfLines={1}>
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
          <ListItem.Part column containerStyle={[{backgroundColor: Colors.white, paddingHorizontal: 16}]}>
            <Text text80M grey30 marginV-4 numberOfLines={1}>
              About Us
            </Text>
          </ListItem.Part>
        </ListItem>
        <ListItem
          activeBackgroundColor={Colors.grey60}
          activeOpacity={0.3}
          height={60}
        >
          <ListItem.Part containerStyle={[{paddingHorizontal: 16}]}>
            <Text text65 marginV-4 numberOfLines={1}>
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
          <ListItem.Part column containerStyle={[{backgroundColor: Colors.white, paddingHorizontal: 16}]}>
            <Text text80M grey30 marginV-4 numberOfLines={1}>
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
              }},
            ]);
          }}
        >
          <ListItem.Part column containerStyle={[{backgroundColor: Colors.white, paddingHorizontal: 16}]}>
            <Text text80M grey30 marginV-4 numberOfLines={1}>
              Delete Account
            </Text>
          </ListItem.Part>
        </ListItem>
      </ScrollView>
    </View>
  );
}

export default Settings;