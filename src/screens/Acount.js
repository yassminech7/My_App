import { useRoute } from "@react-navigation/native";
import React from "react";
import { View, Text } from "react-native";

export default function Acount(){
  const route = useRoute();
  return(
    <View>
        <Text style={{fontSize: 20}}>Name: {route.params.name}</Text>
    </View>
  )
}