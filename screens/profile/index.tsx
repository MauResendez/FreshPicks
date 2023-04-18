import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import * as Linking from 'expo-linking';
import { addDoc, collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import React, { createRef, useEffect, useState } from "react";
import { Platform, ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { Carousel, Chip, Image, ListItem, LoaderScreen, Text, View } from "react-native-ui-lib";
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
  const carousel = createRef<typeof Carousel>();
  const [products, setProducts] = useState([]);
  const [chat, setChat] = useState(null);
  const [consumer, setConsumer] = useState(null);
  const [farmer, setFarmer] = useState(null);
  const items = useSelector(selectOrderItems);
  const [loading, setLoading] = useState(true);
  const layout = useWindowDimensions();
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

          {products.map((product) => (
            <ProfileRow
              key={product.id}
              id={product.id}
              title={product.title}
              description={product.description}
              price={product.price}
              image={product.image}
              quantity={product.quantity}
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

          {products.map((product) => (
            <ProfileRow
              key={product.id}
              id={product.id}
              title={product.title}
              description={product.description}
              price={product.price}
              image={product.image}
              quantity={product.quantity}
              // expiration={product.expiration}
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
      <Text style={[focused ? global.activeTabTextColor : global.tabTextColor]}>
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

    onSnapshot(query(collection(db, "Products"), where("user", "==", id)), async (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
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
      {/* <View style={styles.cover}>
        <Image source={{ uri: farmer.cover }} style={styles.image} />
      </View> */}

      <Carousel
        containerStyle={{
          height: 200
        }}
        autoplay
        loop
        pageControlProps={{
          size: 10,
          containerStyle: {position: 'absolute',
          bottom: 15,
          left: 10}
        }}
        pageControlPosition={Carousel.pageControlPositions.OVER}
        showCounter
      >
        {IMAGES.map((image, i) => {
          return (
            <View flex centerV key={i}>
              <Image
                overlayType={Image.overlayTypes.BOTTOM}
                style={{flex: 1}}
                source={{
                  uri: image
                }}
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
            indicatorStyle={{ backgroundColor: global.activeTabTextColor.color }}
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
    padding: 12,
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