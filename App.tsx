import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './HomeScreen';
import SavedJobsScreen from './SavedJobsScreen';

export type RootStackParamList = {
  Home: undefined;
  SavedJobs: undefined; 
};

const Stack = createStackNavigator<RootStackParamList>();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SavedJobs" component={SavedJobsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

