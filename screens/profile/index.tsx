import { useNavigation, useRoute } from "@react-navigation/native";
import { addDoc, collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Linking, Platform, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar, Chip, Colors, Image, ListItem, Text, View } from "react-native-ui-lib";
import { useSelector } from "react-redux";
import Loading from "../../components/extra/loading";
import DisplayRow from "../../components/profile/display-row";
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
  const [listings, setListings] = useState([]);
  const [chat, setChat] = useState(null);
  const [user, setUser] = useState(null);
  const [farmer, setFarmer] = useState(null);
  const items = useSelector(selectOrderItems);
  const [loading, setLoading] = useState(true);

  const handleChat = async () => {
    // Check user if they have current farmer id saved in chatted
    // If there isn't, create a chat and 
    // Find a chat that has both ids in the chat
    
    if (chat.length != 0) {
      navigation.navigate("Conversation", { id: chat[0]?.id });
      return
    }

    await addDoc(collection(db, "Chats"), {
      consumer: user,
      farmer: farmer,
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
      setUser({...data, id: auth.currentUser.uid});
    });

    getDoc(doc(db, "Users", id)).then((docSnapshot) => {
      const data = docSnapshot.data();
      setFarmer({...data, id: id});
    });

    // onSnapshot(doc(db, "Users", auth.currentUser.uid), async (doc) => {
    //   setUser(doc.data());
    // });

    onSnapshot(query(collection(db, "Listings"), where("user", "==", id)), async (snapshot) => {
      setListings(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    });

    // const unsubscribe = onSnapshot(doc(db, "Users", id), (doc) => {
    //   setFarmer(doc.data());
    // });

    // return unsubscribe
  }, []);

  useEffect(() => {
    if (user && farmer) {
      onSnapshot(query(collection(db, "Chats"), where("consumer.id", "==", auth.currentUser.uid), where("farmer.id", "==", id)), async (snapshot) => {
        setChat(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
      });
    }
  }, [user, farmer]);

  useEffect(() => {
    if (chat) {
      setLoading(false);
    }
  }, [chat]);

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <View useSafeArea flex>
      <ScrollView contentContainerStyle={global.flex} showsVerticalScrollIndicator={Platform.OS == "web"}>
        <View flex>
          <View style={styles.cover}>
            <Image source={{ uri: farmer.cover }} style={styles.image} />
          </View>

          <View style={styles.header}>
            <View row>
              {user.logo 
                ? <Avatar size={75} source={{ uri: farmer.logo }} imageStyle={{ borderWidth: 1 }} />
                : <Avatar size={75} source={require("../../assets/profile.png")} imageStyle={{ borderWidth: 1 }} />
              }
            </View>

            <View row>
              <Text style={styles.title}>{farmer.business}</Text>
            </View>

            <View row>
              <Text style={styles.address}>{farmer.address}</Text>
            </View>

            {/* <View row>
              <Text style={styles.address}>{farmer.rating?.toFixed(2)}/5 Rating</Text>
              <AirbnbRating showRating={false} size={16} defaultRating={5} onFinishRating={(rating) => rateFarmer(rating)}/>
            </View> */}

            {/* <View row>
              <Text style={styles.address}>{farmer.description}</Text>
            </View> */}

            <View row style={[global.spaceBetween, global.flexWrap]}>
              {farmer?.payments?.paypal && <Chip
                backgroundColor="#0079C1"
                containerStyle={{ paddingVertical: 8, marginVertical: 8 }}
                label={"PayPal: " + user.payments.paypal}
                labelStyle={{ color: "white" }}
                onPress={() => Linking.openURL(`https://paypal.me/${farmer.payments.paypal}`)}
              />}

              {farmer?.payments?.cashapp && <Chip
                backgroundColor="#00D632"
                containerStyle={{ paddingVertical: 8, marginVertical: 8 }}
                label={"CashApp: " + user.payments.cashapp}
                labelStyle={{ color: "white" }}
                onPress={() => Linking.openURL(`https://cash.app/${farmer.payments.cashapp}/`)}
              />}

              {farmer?.payments?.venmo && <Chip
                backgroundColor="#008CFF"
                containerStyle={{ paddingVertical: 8, marginVertical: 8 }}
                label={"Venmo: " + user.payments.venmo}
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

          <ListItem
            activeBackgroundColor={Colors.white}
            activeOpacity={0.3}
            height={60}
          >
            <ListItem.Part containerStyle={[{paddingHorizontal: 15}]}>
              <Text subtitle numberOfLines={1}>
              Products
              </Text>
            </ListItem.Part>
          </ListItem>


          {listings.map((product) => (
            <DisplayRow
              key={product.id}
              id={product.id}
              title={product.title}
              description={product.description}
              price={product.price}
              image={product.image}
              quantity={product.quantity}
              farmer={farmer}
              user={user}
            />
          ))}

          <View flexG />

          <View style={styles.cart}>
            <TouchableOpacity disabled={items.length == 0} onPress={() => navigation.navigate("Cart")} style={items.length == 0 ? styles.disabled : styles.checkout}>
              {items.length == 0 
                ? <Text style={styles.checkoutText}>Add items to Cart</Text>
                : <Text style={styles.checkoutText}>Go to Cart</Text>
              }
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    height: 150,
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
        height: "100%",
      },
      android: {
        padding: 16,
        width: "100%",
        height: "100%",
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
    textAlign: "center",
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