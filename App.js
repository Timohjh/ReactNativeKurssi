import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo } from '@expo/vector-icons'; 
import Results from './components/Results';
import Tools from './components/Tools';
import AddResult from './components/AddResult';

// alanavigaation nappulat ja niiden iconit
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
            } else if (route.name === 'Tools') {
            iconName = 'tools';
            } else if (route.name === 'Add') { iconName = 'plus'; } 
            return <Entypo name={iconName} size={size} color={color} />;
          },
        })}>

        <Tab.Screen name="Home" component={Results} />
        <Tab.Screen name="Add" component={AddResult} />
        <Tab.Screen name="Tools" component={Tools} />
      </Tab.Navigator>
    </NavigationContainer>
    
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
