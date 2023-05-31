import { FlashList } from "@shopify/flash-list";
import * as Linking from 'expo-linking';
import * as Location from "expo-location";
import * as SplashScreen from 'expo-splash-screen';
import { collection, documentId, onSnapshot, query, where } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import { LoaderScreen, View } from "react-native-ui-lib";
import MapRow from "../../components/map/map-row";
import { auth, db } from "../../firebase";

const Map = () => {
  const [farmers, setFarmers] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapRegion, setMapRegion] = useState(null);
  
  const renderItem = useCallback(({item}) => {
    return (
      <MapRow item={item} />
    );
  }, []);

  const getLocation = async () => {
    let {status} = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      return;
    }

    let location = await Location.getCurrentPositionAsync();

    setLocation(location);
  }

  const navigateToApp = (farmer) => {
    if (Platform.OS == "android") {
      Linking.openURL(`google.navigation:q=${farmer.latitude}+${farmer.longitude}`);
    } else {
      Linking.openURL(`maps://app?saddr=${location.coords.latitude}+${location.coords.longitude}&daddr=${farmer.latitude}+${farmer.longitude}`);
    }
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
      SplashScreen.hideAsync();
    }
  }, [location]);
  
  if (loading) {
    SplashScreen.preventAutoHideAsync();
    return (
      <LoaderScreen color={"#32CD32"} />
    )
  }

  return (
    <View useSafeArea flex>
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
          mapType={"standard"}
          showsTraffic
          // cacheEnabled
        >
          {/* {farmers.map((farmer, index) => {
            return (
              <Marker 
                key={index} 
                focusable 
                title={farmer.business} 
                description={farmer.address} 
                coordinate={{ latitude: farmer?.location?.latitude, longitude: farmer?.location?.longitude }}
                onPress={() => {
                  navigateToApp(farmer.location);
                }}
              />
            );
          })} */}
        </MapView>
      </View>
      <View style={styles.farmers}>
        <FlashList 
          data={farmers}
          keyExtractor={(item: any) => item.id}
          estimatedItemSize={farmers.length != 0 ? farmers.length : 150}
          renderItem={renderItem}
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
    height: "50%",
  },
  farmers: {
    width: "100%",
    height: "50%"
  }
});

export default Map;