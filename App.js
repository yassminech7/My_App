import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, Text, View, SafeAreaView, Image, Platform, TouchableOpacity, Dimensions } from 'react-native';
import Login from './src/screens/Login';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Signup from './src/screens/Signup';
import CameraScr from './src/screens/CameraScr';
import Map from './src/screens/Map';




const Stack = createNativeStackNavigator();

const App = ()=>{
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen options={{headerShown: false}} name='Login' component={Login}/>
        <Stack.Screen options={{headerShown: false}} name="Signup" component={Signup} />
        <Stack.Screen options={{headerShown: false}} name="CameraScr" component={CameraScr} />
        <Stack.Screen options={{headerShown: false}} name="Map" component={Map} />
      </Stack.Navigator>
    </NavigationContainer>

  );
};


export default App;