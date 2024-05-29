import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';
import { API_GOOGLE_MAP_TOKEN } from '@env';

const MapComponent = () => {
  const mapRef = useRef(null);

  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState<any>(null);
  const [taxiStand, setTaxiStand] = useState<any>(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const [destinationInfo, setDestinationInfo] = useState("");
  const [switchDestination, setSwitchDestination] = useState(false);

  let currentPoint = null;

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setCurrentLocation(location.coords);

    const region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };

    setInitialRegion(region);
  };




  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {

    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.BestForNavigation, timeInterval: 1000 },
        ({ coords }) => {
          setCurrentLocation(coords);
          console.log("this is changes " + coords.altitude);
        });
    })();

    return () => {
      subscription?.remove();
    };

  }, []);




  useEffect(() => {
    if (!currentLocation || !destination || !mapRef.current) return;

    mapRef.current.fitToSuppliedMarkers(['currentLocation', 'destination'], {
      edgePadding: { top: 50, bottom: 50, left: 50, right: 50 },
    });
  }, [currentLocation, destination, mapRef.current]);


  useEffect(() => {
    if (destination && destination.location != null) {
      // console.log(destination.location);
    }

    // console.log(currentLocation);

    if (destination && destination.location) {
      const distance = calculateDistance(currentLocation.latitude,
        currentLocation.longitude, destination.location.lat, destination.location.lng);
      console.log(currentLocation.longitude)
      console.log(destination.location)
      console.log("Distance between current location and destination:", distance);


      const range = 0.1;
      if (distance <= range) {
        console.log("Taxi Reached", "Current location is close to the destination");

        // Alert.alert(
        //   "You reached taxi rank or taxi stand",
        //   "Do you want to continue to navigate to your destination?",
        //   [
        //     {
        //       text: "Cancel",
        //       onPress: () => {
        //         setSwitchDestination(true);
        //       },
        //     },
        //     {
        //       text: "OK",
        //       onPress: () => {
        //         setSwitchDestination(true);
        //       },
        //     },
        //   ]
        // );


      } else {
        console.log("Current location is not close to the destination");
      }
    }
  }, [switchDestination]);


  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }


  function toRad(degrees) {
    return degrees * Math.PI / 180;
  }

  return (
    <View style={styles.container}>
      <View style={styles.placeholder}>
        <GooglePlacesAutocomplete
          placeholder="Enter location"
          query={{
            key: API_GOOGLE_MAP_TOKEN,
            language: 'en',
          }}
          styles={{
            container: {
              flex: 0,
              paddingTop: 65,
              justifyContent: 'center',
              alignItems: 'center',
              // display:'none'
            },
            textInput: {
              fontSize: 18,
            },
          }}
          fetchDetails={true}
          nearbyPlacesAPI="GooglePlacesSearch"
          debounce={400}
          enablePoweredByContainer={false}
          onPress={(data, details) => {
            setDestination({
              location: details?.geometry.location,
              description: data.description,
            });
            // console.log(data.description)
            setDestinationInfo(data.description)
          }}
        />
      </View>
      {initialRegion && (
        <MapView style={styles.map} initialRegion={initialRegion} mapType="mutedStandard" ref={mapRef} >
          {currentLocation && destination && (
            <MapViewDirections
              apikey={API_GOOGLE_MAP_TOKEN}
              origin={currentLocation}
              destination={destination.description}
              strokeColor="red"
              strokeWidth={4}
              optimizeWaypoints={true}
              timePrecision="now"
              time={new Date().getTime()}

            />
          )}

          {currentLocation && (
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              title="Origin"
              pinColor="orange"
              identifier="currentLocation"
            />
          )}

          {destination && destination.location && (
            <Marker
              coordinate={{
                latitude: destination.location.lat,
                longitude: destination.location.lng,
              }}
              title={destinationInfo}
              pinColor="green"
              identifier="destination"
            />
          )}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    marginTop: 85,
    marginLeft: 30,
    marginRight: 30,
    width: '100%',
  },
});

export default MapComponent;