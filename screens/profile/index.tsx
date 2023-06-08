import { useIsFocused, useNavigation } from "@react-navigation/native";
import * as Linking from 'expo-linking';
import { addDoc, collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import React, { createRef, useEffect, useState } from "react";
import { Platform, ScrollView, StyleSheet, useWindowDimensions } from "react-native";
import { Button, Carousel, Chip, Colors, Image, LoaderScreen, Text, View } from "react-native-ui-lib";
import { useSelector } from "react-redux";
import ProfileRow from "../../components/profile/profile-row";
import { selectOrderItems } from "../../features/order-slice";
import { auth, db } from "../../firebase";
import { global } from "../../style";

const Profile = ({ route }) => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const carousel = createRef<typeof Carousel>();
  const [products, setProducts] = useState([]);
  const [chat, setChat] = useState(null);
  const [consumer, setConsumer] = useState(null);
  const [farmer, setFarmer] = useState(null);
  const items = useSelector(selectOrderItems);
  const [loading, setLoading] = useState(true);
  const layout = useWindowDimensions();
  const width = layout.width/4;
  const [index, setIndex] = useState(0);
  const [current, setCurrent] = useState(0);
  const [routes] = useState([
    { key: "first", title: "About Us" },
    { key: "second", title: "Products" },
    { key: "third", title: "Reviews" },
  ]);

  const IMAGES = [
    'https://images.pexels.com/photos/2529159/pexels-photo-2529159.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    'https://images.pexels.com/photos/2529146/pexels-photo-2529146.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    'https://images.pexels.com/photos/2529158/pexels-photo-2529158.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
  ];

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

    getDoc(doc(db, "Users", route.params.id)).then((docSnapshot) => {
      const data = docSnapshot.data();
      setFarmer({...data, id: route.params.id});
    });

    const subscriber = onSnapshot(query(collection(db, "Products"), where("user", "==", route.params.id)), async (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  useEffect(() => {
    if (consumer && farmer) {
      onSnapshot(query(collection(db, "Chats"), where("consumer", "==", auth.currentUser.uid), where("farmer", "==", route.params.id)), async (snapshot) => {
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
      <LoaderScreen color={Colors.primary} />
    )
  }

  return (
    <View useSafeArea flex style={global.bgWhite}>
      <ScrollView style={global.flex} contentContainerStyle={global.flex}>
        <Carousel
          containerStyle={{
            height: 200
          }}
        >
          {farmer.images?.map((image, i) => {
            return (
              <View flex centerV key={i}>
                <Image
                  overlayType={Image.overlayTypes.BOTTOM}
                  style={{flex: 1}}
                  source={{
                    uri: image
                  }}
                  cover
                />
              </View>
            );
          })}
        </Carousel>

        <View style={styles.header}>
          <View row>
            <Text h2>{farmer.business}</Text>
          </View>

          <View row>
            <Text h3>{farmer.address}</Text>
          </View>

          <View row>
            <Text h3>{farmer.description}</Text>
          </View>

          <View row style={[global.spaceBetween, global.flexWrap]}>
            <Chip backgroundColor={Colors.primary} containerStyle={{ paddingVertical: 8, marginVertical: 8 }} label={`Chat with ${farmer.name}`} labelStyle={{ color: Colors.white }} onPress={handleChat}/>
            <Chip backgroundColor="blue" containerStyle={{ paddingVertical: 8, marginVertical: 8 }} label={`Call`} labelStyle={{ color: Colors.white }} onPress={() => { Linking.openURL(`tel:${farmer.phone}`) }}/>
            <Chip backgroundColor="red" containerStyle={{ paddingVertical: 8, marginVertical: 8 }} label={`Email`} labelStyle={{ color: Colors.white }} onPress={() => { Linking.openURL(`mailto:${farmer.email}`) }}/>
          </View>
        </View>

        {products.map((item) => (
          <ProfileRow item={item} farmer={farmer} user={consumer} />
        ))}

        <View flexG />

        <View style={styles.cart}>
          <Button 
            backgroundColor={Colors.primary}
            color={Colors.white}
            label={items.length != 0 ? "Go to Basket" : "Add items to Basket"} 
            labelStyle={{ fontWeight: '600', padding: 8 }} 
            style={[global.btnTest, items.length == 0 ? styles.disabled : styles.checkout]}
            onPress={() => items.length != 0 && navigation.navigate("Second", { screen: "Basket" })}               
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    height: 200,
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
    backgroundColor: Colors.white,
    padding: 16,
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
    color: Colors.black,
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
    color: Colors.white,
  },
  cart: {
    padding: 16,
    backgroundColor: Colors.white,
  },
  checkout: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
  checkoutText: {
    color: Colors.white,
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