import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import { onAuthStateChanged, User } from "firebase/auth";
import React, { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { ConnectionStatusBar, LoaderScreen, ThemeManager, Typography } from "react-native-ui-lib";
import { Provider } from "react-redux";
import { auth } from "./firebase";
import AuthStack from "./navigation/stack/auth-stack";
import MainStack from "./navigation/stack/main-stack";
import { store } from "./redux/store";

// ThemeManager.setComponentTheme('Wizard', (props, context) => {
//   // const containerStyle = {width, marginLeft, paddingVertical, paddingHorizontal};
//   const activeConfig = {color: "black", circleBackgroundColor: "#32CD32", circleColor: "black"};
//   return {activeConfig};
// });

ThemeManager.setComponentTheme('Stepper', (props, context) => {
  const config = {color: "black", backgroundColor: "#32CD32", circleColor: "black"};
  return {config};
});

ThemeManager.setComponentTheme('Card', (props, context) => {
  const style = {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 16,
  };
  return {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 16,
  };;
});

Typography.loadTypographies({ 
  title: {
    color: "#ff4500",
    fontSize: 24,
    fontWeight: "bold",
    paddingBottom: 16
  }, 
  subtitle: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 8
  },
  h2: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 4,
  }, 
  h3: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginVertical: 4
  }
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const App = () => {
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  const appConfig = require("./app.json");
  const projectId = appConfig?.expo?.extra?.eas?.projectId;
  const [user, setUser] = useState<User | null>(null);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const [loading, setLoading] = useState(true);

  const registerForPushNotificationsAsync = async () => {
    try {
      let token;
      
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        
        if (finalStatus !== "granted") {
          alert("Failed to get push token for push notification!");
          return;
        }
        
        token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      } else {
        alert("Must use physical device for Push Notifications");
      }

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      return token;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    try {
      if (Platform.OS !== "web") {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
  
        // This listener is fired whenever a notification is received while the app is foregrounded
        notificationListener.current = Notifications.addNotificationReceivedListener((notification: any) => {
          setNotification(notification);
        });
  
        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          console.log(response);
        });
  
        return () => {
          Notifications.removeNotificationSubscription(notificationListener.current);
          Notifications.removeNotificationSubscription(responseListener.current);
        };
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    try {
      onAuthStateChanged(auth, async (user: any) => {
        if (user) {
          setUser(user);
          setLoading(false);
        } else {
          setUser(null);
          setLoading(false);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, [user]);

  if (loading) {
    return (
      <LoaderScreen />
    );
  }

  return (
    <Provider store={store}>
      <StatusBar style={"auto"} animated />
      <ConnectionStatusBar label={"LSFKDJlj"} onConnectionChange={() => console.log('connection changed')}/>
      {auth.currentUser ? <MainStack /> : <AuthStack />}
    </Provider>
  );
}

export default App