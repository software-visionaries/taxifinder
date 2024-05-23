import React, { useEffect, useRef, useState } from 'react';
import {StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import { API_GOOGLE_MAP_TOKEN } from '@env';
import { useLocalSearchParams } from 'expo-router';

const MapComponent = () => {
  const mapRef = useRef(null);

  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState<any>(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const { id } = useLocalSearchParams<{ id: string }>();

  useEffect(() => {
    if(!id) {
      return;
    }
    fetch(`http://146.141.180.63:8080/trip/${id}`)
      .then(res => {
        if(!res.ok) {
          throw new Error("Network response was not okay")
        }
        return res.json();
      })
      .then(data => {
        setDestination({
            latitude: data.lat,
            longitude: data.lng
          });
          
      })
      .catch(error => {
        console.log(error);
      })
  }, [id])
  

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

    let subscription :Location.LocationSubscription | null = null;

    (async () => {
      subscription = await Location.watchPositionAsync(
        {accuracy :Location.Accuracy.BestForNavigation,timeInterval:100},
        ({coords}) => {
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


  return (
    <View style={styles.container}>      
      {initialRegion && (
        <MapView style={styles.map} initialRegion={initialRegion} mapType="mutedStandard" ref={mapRef} >
          {currentLocation && destination && (
            <MapViewDirections
              apikey={API_GOOGLE_MAP_TOKEN}
              origin={currentLocation}
              destination={`${destination.latitude},${destination.longitude}`}
              strokeColor="red"
              strokeWidth={4}
              optimizeWaypoints={true}   
              mode='WALKING'         
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

          {destination && (
            <Marker
              coordinate={{
                latitude: Number(destination.latitude),
                longitude:Number(destination.longitude),
              }}
              title="destination"
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