import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import * as Linking from 'expo-linking';
import { addDoc, collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Platform, ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { Avatar, Chip, Colors, Image, ListItem, LoaderScreen, Text, View } from "react-native-ui-lib";
import { useSelector } from "react-redux";
import ProfileRow from "../../components/profile/profile-row";
import { selectOrderItems } from "../../features/order-slice";
import { auth, db } from "../../firebase";
import { global } from "../../style";

const Profile = () => {
  const {
    params: {
      id
    },
  } = useRoute<any>();

  const navigation = useNavigation<any>();
  const parent = navigation.getParent("MainDrawer");
  const isFocused = useIsFocused();
  const [listings, setListings] = useState([]);
  const [chat, setChat] = useState(null);
  const [consumer, setConsumer] = useState(null);
  const [farmer, setFarmer] = useState(null);
  const items = useSelector(selectOrderItems);
  const [loading, setLoading] = useState(true);
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "About Us" },
    { key: "second", title: "Products" },
    { key: "third", title: "Reviews" },
  ]);

  const FirstRoute = () => (
    <View useSafeArea flex style={global.bgWhite}>
      <ScrollView style={global.flex} showsVerticalScrollIndicator={Platform.OS == "web"}>
        <View style={{ padding: 16 }}>
          <ListItem>
            <ListItem.Part>
              <Text subtitle>About Us</Text>
              <Text h3>{farmer.description}</Text>
            </ListItem.Part>
          </ListItem>
        </View>
      </ScrollView>
    </View>
  );

  const SecondRoute = () => (
    <View useSafeArea flex style={global.bgWhite}>
      <ScrollView style={global.flex} showsVerticalScrollIndicator={Platform.OS == "web"}>
        <View style={{ padding: 16 }}>
          <ListItem>
            <ListItem.Part>
              <Text subtitle>Products</Text>
            </ListItem.Part>
          </ListItem>

          {listings.map((product) => (
            <ProfileRow
              key={product.id}
              id={product.id}
              title={product.title}
              description={product.description}
              price={product.price}
              image={product.image}
              quantity={product.quantity}
              expiration={product.expiration}
              farmer={farmer}
              user={consumer}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const ThirdRoute = () => (
    <View useSafeArea flex style={global.bgWhite}>
      <ScrollView style={global.flex} showsVerticalScrollIndicator={Platform.OS == "web"}>
        <View style={{ padding: 16 }}>
          <ListItem>
            <ListItem.Part>
              <Text subtitle>Reviews</Text>
            </ListItem.Part>
          </ListItem>

          {listings.map((product) => (
            <ProfileRow
              key={product.id}
              id={product.id}
              title={product.title}
              description={product.description}
              price={product.price}
              image={product.image}
              quantity={product.quantity}
              expiration={product.expiration}
              farmer={farmer}
              user={consumer}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderLabel = ({ route, focused, color }) => {
    return (
      <Text style={[focused ? "#32CD32" : Colors.black]}>
        {route.title}
      </Text>
    );
  };

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute
  });

  const handleChat = async () => {
    // Check user if they have current farmer id saved in chatted
    // If there isn't, create a chat and 
    // Find a chat that has both ids in the chat
    
    if (chat.length != 0) {
      navigation.navigate("Conversation", { id: chat[0]?.id });
      return
    }

    await addDoc(collection(db, "Chats"), {
      consumer: consumer.id,
      farmer: farmer.id,
      messages: []
    })
    .then((doc) => {
      navigation.navigate("Conversation", { id: doc?.id })
    })
    .catch(e => alert(e.message));
  }

  // const rateFarmer = async (rating) => {
  //   await updateDoc(doc(db, "Users", farmer.id), { rating: ((farmer.ratings * 5) + rating)/(farmer.ratings + 1), ratings: farmer.ratings + 1 })
  //   .then(() => {
  //     Toast.show("Rating successful", {
  //       duration: Toast.durations.SHORT,
  //       backgroundColor: "orange",
  //       position: Platform.OS == "web" ? 650 : 700
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err.message);
  //   });
  // }

  useEffect(() => {
    getDoc(doc(db, "Users", auth.currentUser.uid)).then((docSnapshot) => {
      const data = docSnapshot.data();
      setConsumer({...data, id: auth.currentUser.uid});
    });

    getDoc(doc(db, "Users", id)).then((docSnapshot) => {
      const data = docSnapshot.data();
      setFarmer({...data, id: id});
    });

    onSnapshot(query(collection(db, "Listings"), where("user", "==", id)), async (snapshot) => {
      setListings(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    });
  }, []);

  useEffect(() => {
    if (consumer && farmer) {
      onSnapshot(query(collection(db, "Chats"), where("consumer", "==", auth.currentUser.uid), where("farmer", "==", id)), async (snapshot) => {
        setChat(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
      });
    }
  }, [consumer, farmer]);

  useEffect(() => {
    if (chat) {
      setLoading(false);
    }
  }, [chat]);

  // useLayoutEffect(() => {
  //   parent.setOptions({
  //     headerShown: isFocused ? false : true
  //   });
  // }, [isFocused]);

  if (loading) {
    return (
      <LoaderScreen color={"#32CD32"} />
    )
  }

  return (
    <View useSafeArea flex style={global.bgWhite}>
      <View style={styles.cover}>
        <Image source={{ uri: farmer.cover }} style={styles.image} />
      </View>

      <View style={styles.header}>
        <View row>
          {consumer.logo 
            ? <Avatar size={75} source={{ uri: farmer.logo }} imageStyle={{ borderWidth: 1 }} />
            : <Avatar size={75} source={require("../../assets/profile.png")} imageStyle={{ borderWidth: 1 }} />
          }
        </View>

        <View row>
          <Text h2>{farmer.business}</Text>
        </View>

        <View row>
          <Text h3>{farmer.address}</Text>
        </View>

        {/* <View row>
          <Text style={styles.address}>{farmer.rating?.toFixed(2)}/5 Rating</Text>
          <AirbnbRating showRating={false} size={16} defaultRating={5} onFinishRating={(rating) => rateFarmer(rating)}/>
        </View> */}

        {/* <View row>
          <Text style={styles.address}>{farmer.description}</Text>
        </View> */}

        <View row style={[global.spaceBetween, global.flexWrap]}>
          {farmer.payments.paypal && <Chip
            backgroundColor="#0079C1"
            containerStyle={{ paddingVertical: 8, marginVertical: 8 }}
            label={"PayPal: " + farmer.payments.paypal}
            labelStyle={{ color: "white" }}
            onPress={() => Linking.openURL(`https://paypal.me/${farmer.payments.paypal}`)}
          />}

          {farmer.payments.cashapp && <Chip
            backgroundColor="#00D632"
            containerStyle={{ paddingVertical: 8, marginVertical: 8 }}
            label={"CashApp: " + farmer.payments.cashapp}
            labelStyle={{ color: "white" }}
            onPress={() => Linking.openURL(`https://cash.app/${farmer.payments.cashapp}/`)}
          />}

          {farmer.payments.venmo && <Chip
            backgroundColor="#008CFF"
            containerStyle={{ paddingVertical: 8, marginVertical: 8 }}
            label={"Venmo: " + farmer.payments.venmo}
            labelStyle={{ color: "white" }}
            onPress={() => Linking.openURL(`venmo://paycharge?recipients=${farmer.payments.venmo}`)}
          />}
        </View>

        <View row style={[global.spaceBetween, global.flexWrap]}>
          <Chip backgroundColor="green" containerStyle={{ paddingVertical: 8, marginVertical: 8 }} label={`Chat with ${farmer.name}`} labelStyle={{ color: "white" }} onPress={handleChat}/>
          <Chip backgroundColor="blue" containerStyle={{ paddingVertical: 8, marginVertical: 8 }} label={`Call`} labelStyle={{ color: "white" }} onPress={() => { Linking.openURL(`tel:${farmer.phone}`) }}/>
          <Chip backgroundColor="red" containerStyle={{ paddingVertical: 8, marginVertical: 8 }} label={`Email`} labelStyle={{ color: "white" }} onPress={() => { Linking.openURL(`mailto:${farmer.email}`) }}/>
        </View>
      </View>
      <TabView
        style={[global.bgWhite, global.flex]}
        navigationState={{ index, routes }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "black" }}
            style={{ backgroundColor: "white", height: 50 }}
            renderLabel={renderLabel}
          />
        )}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />

      {/* <View flexG /> */}

      <View style={styles.cart}>
        <TouchableOpacity disabled={items.length == 0} onPress={() => parent.navigate("Cart")} style={items.length == 0 ? styles.disabled : styles.checkout}>
          {items.length == 0 
            ? <Text style={styles.checkoutText}>Add items to Cart</Text>
            : <Text style={styles.checkoutText}>Go to Cart</Text>
          }
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    height: 200,
    width: "100%",
  },
  logo: {
    height: "auto",
    width: "100%",
  },
  image: {
    ...Platform.select({
      web: {
        padding: 16,
        width: "100%",
        height: 250,
      },
      ios: {
        padding: 16,
        width: "100%",
        height: 200,
      },
      android: {
        padding: 16,
        width: "100%",
        height: 200,
      },
    }),
  },
  back: {
    position: "absolute",
    left: 10,
    top: 56,
    padding: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 50,
  },
  header: {
    backgroundColor: "white",
    padding: 16,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    width: "100%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
  content: {
    marginVertical: 4,
    flexDirection: "row",
  },
  ratingContainer: {
    marginLeft: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    color: "#059669",
    flex: 1,
    textAlign: "right",
  },
  address: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    textAlign: "left",
    marginTop: 4,
    marginBottom: 4,
  },
  description: {
    paddingBottom: 16,
    marginTop: 8,
    color: "black",
  },
  products: {
  },
  productsTitle: {
    paddingHorizontal: 16,
    paddingTop: 32,
    marginBottom: 12,
    fontSize: 20,
    lineHeight: 32,
    fontWeight: "700",
  },
  basket: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  text: {
    fontSize: 20,
    lineHeight: 20,
    fontWeight: "bold",
    letterSpacing: 1,
    color: "white",
  },
  cart: {
    padding: 16,
    backgroundColor: "white",
  },
  checkout: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "green",
  },
  checkoutText: {
    color: "white",
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  disabled: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "lightgray",
  },
});

export default Profile;