import { useNavigation } from "@react-navigation/native";
import * as Linking from 'expo-linking';
import * as Location from "expo-location";
import { collection, documentId, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { FlatList, Image, Platform, StyleSheet } from "react-native";
import getDirections from "react-native-google-maps-directions";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { LoaderScreen, View } from "react-native-ui-lib";
import MapRow from "../../components/map/map-row";
import { auth, db } from "../../firebase";

const Map = () => {
  const navigation = useNavigation<any>();
  const [farmers, setFarmers] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapRegion, setMapRegion] = useState(null);  

  const getLocation = async () => {
    let {status} = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      return;
    }

    let location = await Location.getCurrentPositionAsync();

    setLocation(location);
  }

  const navigateToFarmer = (farmer) => {
    navigation.navigate("Profile", { id: farmer.id })
  }

  const navigateToApp = (coordinates) => {
    if (Platform.OS == "android") {
      Linking.openURL(`google.navigation:q=${coordinates.lat}+${coordinates.lng}`);
    } else {
      Linking.openURL(`maps://app?saddr=${location.coords.latitude}+${location.coords.longitude}&daddr=${coordinates.lat}+${coordinates.lng}`);
    }
  }

  const handleGetDirections = (lat, lng) => {
    const data = {
      source: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      },
      destination: {
        latitude: lat,
        longitude: lng
      },
      params: [
        {
          key: "travelmode",
          value: "driving"        // may be "walking", "bicycling" or "transit" as well
        },
        {
          key: "dir_action",
          value: "navigate"       // this instantly initializes navigation using the given travel mode
        }
      ],
    }

    getDirections(data)
  }

  useEffect(() => { 
    onSnapshot(query(collection(db, "Users"), where("farmer", "==", true), where(documentId(), "!=", auth.currentUser.uid)), async (snapshot) => {
      setFarmers(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    });

    getLocation();
  }, []);

  useEffect(() => {
    if (location) {
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      setLoading(false);
    }
  }, [location]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, []);
  
  if (loading) {
    return (
      <LoaderScreen color={"#32CD32"} />
    )
  }

  return (
    <View useSafeArea flex>
      {Platform.OS === "web" ? 
        <View style={styles.map}>
          <MapView
            ref={map => (this.map = map)} 
            provider={PROVIDER_GOOGLE}
            style={styles.mapview}
            region={mapRegion}
            showsUserLocation={true}
            showsMyLocationButton={true}
            followsUserLocation={true}
            showsPointsOfInterest={false}
          >
            {farmers.map((farmer, index) => {
              return (
                <MapView.Marker  
                  title={farmer.business} 
                  description={farmer.address} 
                  coordinate={{ latitude: farmer?.coordinates?.lat, longitude: farmer?.coordinates?.lng }} 
                  icon={require("../../assets/marker.png")} 
                  onPress={() => {
                    // const zoom = this.map.getCamera().zoom === 20 ? 15 : 20;
                    // this.map.animateCamera({
                    //   zoom,
                    //   center: {
                    //     lat: farmer?.coordinates?.lat,
                    //     lng: farmer?.coordinates?.lng,
                    //   },
                    // });
                    handleGetDirections(farmer.coordinates.lat, farmer.coordinates.lng);
                  }}
                />
              );
            })}
          </MapView>
        </View>
      :
        <View style={styles.map}>
          <MapView
            ref={map => (this.map = map)} 
            style={styles.mapview}
            region={mapRegion}
            showsUserLocation={true}
            showsMyLocationButton={true}
            followsUserLocation={false}
            showsPointsOfInterest={false}
            moveOnMarkerPress={true}
          >
            {farmers.map((farmer, index) => {
              return (
                <Marker 
                  key={index} 
                  focusable 
                  title={farmer.business} 
                  description={farmer.address} 
                  coordinate={{ latitude: farmer?.coordinates?.lat, longitude: farmer?.coordinates?.lng }}
                  onPress={() => {
                    // const zoom = this.map.getCamera().zoom === 17 ? 15 : 17;
                    // this.map.animateCamera({
                    //   zoom,
                    //   center: {
                    //     latitude: farmer?.coordinates?.lat,
                    //     longitude: farmer?.coordinates?.lng,
                    //   },
                    // });
                    // handleGetDirections(farmer.coordinates.lat, farmer.coordinates.lng);
                    navigateToApp(farmer.coordinates);
                  }}
                >
                  <Image source={require("../../assets/marker.png")} />
                </Marker>
              );
            })}
          </MapView>
        </View>
      }
      <View style={styles.farmers}>
        <FlatList 
          data={farmers}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <MapRow farmer={item.id} cover={item.cover} business={item.business} name={item.name} address={item.address} />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapview: {
    width: "100%",
    height: "100%"
  },
  map: {
    width: "100%",
    height: "70%",
  },
  farmers: {
    width: "100%",
    height: "30%"
  }
});

export default Map;