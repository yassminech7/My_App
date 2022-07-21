import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Image, Platform, TouchableOpacity, Dimensions,Button } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { Camera } from 'expo-camera';
import { CameraType } from 'expo-camera/build/Camera.types';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { Video, Audio } from 'expo-av';
import * as Sharing from 'expo-sharing';

import * as Location from 'expo-location';
import MapView, { Circle, Marker } from 'react-native-maps';
import {Entypo} from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';



const CameraScr =({navigation})=> {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);

  const [hasMicrophonePermission, setHasMicrophonePermission] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState();

  
  const [recording, setRecording] = React.useState();
  const [recordings, setRecordings] = React.useState([]);
  const [message, setMessage] = React.useState("");

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [pin,setPin]= React.useState({
    latitude:34.7893035 , 
    longitude: 10.7438359,
  });

 
  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        });
        
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );

        setRecording(recording);
      } else {
        setMessage("Please grant permission to app to access microphone");
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stoppRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();

    let updatedRecordings = [...recordings];
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    updatedRecordings.push({
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI()
    });

    setRecordings(updatedRecordings);
  }
  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }
  function getRecordingLines() {
    
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>Recording {index + 1} - {recordingLine.duration}</Text>
          <Button style={styles.button} onPress={() => recordingLine.sound.replayAsync()} title="Play" icon='controller-play' color='black' ></Button>
          <Button style={styles.button} onPress={() => Sharing.shareAsync(recordingLine.file)} title="Share" icon='share' color='black'></Button>
        </View>
      );
    });
  }


  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      const microphonePermission = await Camera.requestMicrophonePermissionsAsync();
 

      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
      setHasMicrophonePermission(microphonePermission.status === "granted");

   
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

  function loc(){
    return(
      <MapView style={styles.map}
       initialRegion={{
        latitude: 34.7893035,
        longitude: 10.7438359,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }} >
        <Marker coordinate={pin}></Marker>
        <Circle center={pin} radius={80}></Circle>
      </MapView>

    );};


  if (hasCameraPermission === undefined || hasMicrophonePermission === undefined) {
    return <Text>Requesting permissions...</Text>
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted. Please change this in settings.</Text>
  }

  let recordVideo = () => {
    setIsRecording(true);
    let options = {
      quality: "1080p",
      maxDuration: 60,
      mute: false
    };

    cameraRef.current.recordAsync(options).then((recordedVideo) => {
      setVideo(recordedVideo);
      setIsRecording(false);
    });
  };

  let stopRecording = () => {
    setIsRecording(false);
    cameraRef.current.stopRecording();
  };

  if (video) {
    let shareVideo = () => {
      shareAsync(video.uri).then(() => {
        setVideo(defiined);
      });
    };

    let saveVideo = () => {
      MediaLibrary.saveToLibraryAsync(video.uri).then(() => {
        alert('Video save!');
        setVideo(defined);
        
      });
    };

    let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  


    return (
      <SafeAreaView style={styles.container}>
        <Video
          style={styles.video}
          source={{uri: video.uri}}
          useNativeControls
          resizeMode='contain'
          isLooping
        />
        <Text>{message}</Text>
      <Button
        title={recording ? 'Stop Recording' : 'Make a Voice Note'}
        onPress={recording ? stoppRecording : startRecording} icon='controller-record' color='black' />
      {getRecordingLines()}
        <Button title="Share" icon='share' onPress={shareVideo} color='black'/>
        {hasMediaLibraryPermission ? <Button title="Save" icon='save' onPress={saveVideo} color='black' /> : undefined}
        <Button title="back" icon='back'  onPress={() => setVideo(undefined)} color='black' />

        <View style={styles.container}>
      <Text style={styles.paragraph}>{text}</Text>
      <TouchableOpacity style={styles.loginBtn} onPress={()=>navigation.navigate("Map")} >
          <Text style={styles.loginText}>View Location </Text>
        </TouchableOpacity>
      
     
    
     
      
    
    </View>
      </SafeAreaView>
    );
  }




  



  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };

  



  if (photo) {
    let sharePic = () => {
      shareAsync(photo.uri).then(() => {
        setPhoto(defined);
      });
    };

    let savePhoto = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        alert('Picture save!');
        setPhoto(defined);
      });
    };

    let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  const uploadimag = async () => {

    const payload = new FormData();
    payload.append('image', {
      uri: photo.uri,
      type: photo.type,
      name: photo.fileName
    })

    const config = {
      body: payload,
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    let response = await fetch('http://192.168.1.17:8080/uploads/upload.php', config);
    console.log(response);
  }

    return (
      <SafeAreaView style={styles.container}>
        <Image style={styles.preview} source={{ uri: "data:image/jpg;base64," + photo.base64 }} />
        <Text>{message}</Text>
        
      <Button
        title={recording ? 'Stop Recording' : 'Make a Voice Note'}
        onPress={recording ? stoppRecording : startRecording } icon='controller-record' color='black' />
      {getRecordingLines()}

        <Button title="Share" icon='share' onPress={sharePic} color='black' />

        <Button title="Upload" onPress={uploadimag}></Button>

        {hasMediaLibraryPermission ? <Button title="Save" icon='save' onPress={savePhoto} color='black' /> : undefined}
        <Button title="back" icon='back' onPress={() => setPhoto(undefined)} color='black' />

        <View style={styles.container}>
      <Text style={styles.paragraph}>{text}</Text>
      <TouchableOpacity style={styles.loginBtn} onPress={()=>navigation.navigate("Map")} >
          <Text style={styles.loginText}>View Location </Text>
        </TouchableOpacity>
    </View>

   
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
    <Camera style={styles.camera} ref={cameraRef} type={type} flashMode={flash}>
      <View style={{ flexDirection:'row', justifyContent: 'space-between', padding: 30, }}>
        <TouchableOpacity icon={'flash'} color={flash === Camera.Constants.FlashMode.off ? 'gray' : 'black'}
        onPress={() =>{
          setFlash(flash === Camera.Constants.FlashMode.off
            ? Camera.Constants.FlashMode.on
            : Camera.Constants.FlashMode.off)

        } }><Entypo name="retweet" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity icon={'flash'} color={flash === Camera.Constants.FlashMode.off ? 'gray' : 'black'}
        onPress={() =>{
          setFlash(flash === Camera.Constants.FlashMode.off
            ? Camera.Constants.FlashMode.on
            : Camera.Constants.FlashMode.off)

        } } >
<Entypo name="flash" size={24} color="black" />
        </TouchableOpacity>
        
        

      </View>
      </Camera>
     
      <View >
        <TouchableOpacity style={styles.loginBtn} icon='camera' onPress={takePic} color='black'>
        <Ionicons name="camera" size={25} color="white" />
        <Text style={styles.loginText}>Take Picture</Text>
        </TouchableOpacity>
      </View>
      <View >
      <TouchableOpacity style={styles.loginBtn} title={isRecording ? "Stop Recording" : "Record Video"}  icon='video-camera' onPress={isRecording ? stopRecording : recordVideo}>
      <Ionicons name="ios-videocam" size={25} color="white" />
      <Text style={styles.loginText}>Take Video</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    
    </View>

  );
}


export default CameraScr;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 10
  },
  loginBtn:{
    width:"30%",
    backgroundColor:"black",
    borderRadius:25,
    height:40,
    alignItems:"center",
    justifyContent:"center",
    marginTop:5,
    marginBottom:0,
    marginLeft:150
  },
  loginText:{
    color:"white"
  },
  Button:{
    width:"80%",
    backgroundColor:"white",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
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