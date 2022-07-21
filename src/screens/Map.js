import React from 'react';
import * as Location from 'expo-location';
import MapView, { Circle, Marker } from 'react-native-maps';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Image, Platform, TouchableOpacity, Dimensions } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { Camera } from 'expo-camera';
import { CameraType } from 'expo-camera/build/Camera.types';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { Video, Audio } from 'expo-av';
import * as Sharing from 'expo-sharing';
export default function Map() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
    
    const [pin,setPin]= React.useState({
        latitude:34.7893035 , 
        longitude: 10.7438359,
      });

      useEffect(() => {
        (async () => {
          
          
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
      
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
      
          setPin({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
    
       
        })();
      }, []);
    

    return(
        <MapView style={styles.map}
         initialRegion={{
          latitude: parseFloat(34.7893035),
          longitude: parseFloat(10.7438359),
          latitudeDelta: parseFloat(0.0922),
          longitudeDelta: parseFloat(0.0421),
        }} >
          <Marker coordinate={pin}></Marker>
          <Circle center={pin} radius={80}></Circle>
        </MapView>
  
      );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingBottom: 20
    },
   
    preview: {
      alignSelf: 'stretch',
      flex: 1
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    fill: {
      flex: 1,
      margin: 16
    },
    paragraph: {
      margin: 24,
      fontSize: 18,
      textAlign: 'center'
    },
    video: {
      flex: 1,
      alignSelf: "stretch"
    },
    camera:{
      flex: 1,
      borderRadius: 20,
  
    },
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
  
  });
