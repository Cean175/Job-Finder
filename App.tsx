import React from 'react';
import { ThemeProvider, useTheme } from './ThemeContext'; 
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import SavedJobsScreen from './SavedJobsScreen';
import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { theme } = useTheme(); 
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.buttonText,
        headerTitleStyle: {
          color: theme.colors.text,
        },
        cardStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Job Search' }}
      />
      <Stack.Screen 
        name="SavedJobs" 
        component={SavedJobsScreen} 
        options={{ title: 'Saved Jobs' }}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </NavigationContainer>

    
  );
};


export default App;