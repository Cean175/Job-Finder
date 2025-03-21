import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchJobs } from './jobService';



type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        console.log("Fetching jobs...");
        
        const jobsData = await fetchJobs();
        console.log("Jobs Data:", jobsData);

        if (!jobsData || jobsData.length === 0) {
          throw new Error('No jobs found');
        }

        setJobs(jobsData);
      } catch (error: any) {
        console.error('Error loading jobs:', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  const handleSaveJob = async (job: any) => {
    try {
      const existingSavedJobs = await AsyncStorage.getItem('savedJobs');
      const savedJobsArray = existingSavedJobs ? JSON.parse(existingSavedJobs) : [];

      if (!savedJobsArray.some((savedJob: any) => savedJob.id === job.id)) {
        const updatedJobs = [...savedJobsArray, job];
        await AsyncStorage.setItem('savedJobs', JSON.stringify(updatedJobs));
        console.log(`Job ${job.id} saved!`);
      } else {
        console.log(`Job ${job.id} is already saved.`);
      }
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  if (loading) {
    console.log("Rendering Loading Screen...");
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading jobs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={jobs}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()} // Fix undefined keys
        renderItem={({ item }) => (
          <View>
            <Text>{item?.title ?? "No Title"}</Text> 
           
          </View>
        )}
        ListEmptyComponent={<Text>No jobs found.</Text>}
      />
      <Button title="View Saved Jobs" onPress={() => navigation.navigate('SavedJobs')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
