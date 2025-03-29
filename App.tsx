import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import SavedJobsScreen from './SavedJobsScreen';

export type RootStackParamList = {
  Home: undefined;
  SavedJobs: { savedJobs: string[]; jobs: Job[] };
};

export interface Job {
  id: string;
  title: string;
  company: string;
  salary: string;
  jobType?: string;
  workModel?: string;
  seniority?: string;
  description?: string;
}

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SavedJobs" component={SavedJobsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;