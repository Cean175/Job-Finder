import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity,
  Alert 
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Job } from './App';

type SavedJobsScreenRouteProp = RouteProp<RootStackParamList, 'SavedJobs'>;

interface SavedJobsScreenProps {
  route: SavedJobsScreenRouteProp;
  navigation: any; // Add navigation prop
}

const SavedJobsScreen: React.FC<SavedJobsScreenProps> = ({ route, navigation }) => {
  const { savedJobs, jobs } = route.params;
  const [currentSavedJobs, setCurrentSavedJobs] = React.useState<string[]>(savedJobs);

  const savedJobsList = jobs.filter(job => currentSavedJobs.includes(job.id));

  const handleRemoveJob = (jobId: string) => {
    setCurrentSavedJobs(prev => prev.filter(id => id !== jobId));
  };

  const handleApplyPress = (job: Job) => {
    navigation.navigate('Home', { 
      screen: 'JobSearch',
      params: { applyForJob: job }
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={savedJobsList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.jobCard}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text style={styles.company}>{item.company}</Text>
            <Text style={styles.salary}>{item.salary}</Text>
            {item.jobType && <Text style={styles.detail}>Type: {item.jobType}</Text>}
            {item.workModel && <Text style={styles.detail}>Work Model: {item.workModel}</Text>}
            {item.seniority && <Text style={styles.detail}>Seniority: {item.seniority}</Text>}
            
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveJob(item.id)}
              >
                <Text style={styles.buttonText}>Remove</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => handleApplyPress(item)}
              >
                <Text style={styles.buttonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No saved jobs yet</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5'
  },
  jobCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  company: {
    fontSize: 16,
    color: '#666',
    marginVertical: 4
  },
  salary: {
    fontSize: 16,
    color: '#2e7d32',
    fontWeight: '600',
    marginBottom: 8
  },
  detail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12
  },
  removeButton: {
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 6
  },
  applyButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginLeft: 6
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888'
  }
});

export default SavedJobsScreen;