import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  StyleSheet,
  Alert,
  Modal,
  Button,
  RefreshControl
} from 'react-native';
import axios from 'axios';
import uuid from 'react-native-uuid';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Job } from './types';
import { useTheme } from './ThemeContext';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const API_URL = 'https://empllo.com/api/v1';

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState('');
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const { theme, toggleTheme } = useTheme(); 
  const [application, setApplication] = useState({
    name: '',
    email: '',
    phone: '',
    coverLetter: ''
  });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(API_URL);
      
      let jobData = response.data;
      
      if (Array.isArray(jobData)) {
      } else if (jobData?.jobs && Array.isArray(jobData.jobs)) {
        jobData = jobData.jobs;
      } else if (jobData?.data && Array.isArray(jobData.data)) {
        jobData = jobData.data;
      } else {
        throw new Error('Unexpected API response structure');
      }

      const jobsWithIds = jobData.map((job: any) => ({
        id: job.id ? job.id.toString() : uuid.v4().toString(),
        title: job.title || "No Title",
        company: job.company || "Unknown Company",
        salary: job.salary ? `$${job.salary}` : "Salary not disclosed",
        jobType: job.jobType || "Not specified",
        workModel: job.workModel || "Not specified",
        seniority: job.seniority || "Not specified",
        description: job.description || "No description available",
        location: job.location || "Location not specified"
      }));

      setJobs(jobsWithIds);
      setFilteredJobs(jobsWithIds);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load jobs. Please try again later.');
      setJobs([]);
      setFilteredJobs([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          onPress={() => navigation.navigate('SavedJobs', { 
            savedJobs: savedJobs.map(job => job.id), 
            jobs: savedJobs 
          })}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>Saved ({savedJobs.length})</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, savedJobs]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchJobs();
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    setFilteredJobs(
      jobs.filter(job => 
        job.title.toLowerCase().includes(text.toLowerCase()) ||
        job.company.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  const toggleSaveJob = (job: Job) => {
    setSavedJobs(prev => {
      const isAlreadySaved = prev.some(savedJob => savedJob.id === job.id);
      if (isAlreadySaved) {
        return prev.filter(savedJob => savedJob.id !== job.id);
      } else {
        return [...prev, job];
      }
    });
  };

  const isJobSaved = (jobId: string) => {
    return savedJobs.some(job => job.id === jobId);
  };

  const handleApplyPress = (job: Job) => {
    setSelectedJob(job);
    setModalVisible(true);
  };

  const handleApplicationSubmit = () => {
    if (!application.name || !application.email || !application.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(application.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!application.coverLetter.trim()) {
      Alert.alert('Error',);
      return;
    }

    Alert.alert(
      'Application Submitted',
      `Your application for ${selectedJob?.title} at ${selectedJob?.company} has been submitted!`
    );
    setModalVisible(false);
    setApplication({
      name: '',
      email: '',
      phone: '',
      coverLetter: ''
    });
  };

  if (loading && jobs.length === 0) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchJobs}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (jobs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No jobs available</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchJobs}
        >
          <Text style={styles.retryButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
  
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Button 
        title="Dark Mode" 
        onPress={toggleTheme} 
        color={theme.colors.applyButton} 
      />
      <TextInput
        style={styles.searchInput}
        placeholder="Search jobs..."
        value={search}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredJobs}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View style={styles.jobCard}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text style={styles.company}>{item.company}</Text>
            <Text style={styles.salary}>{item.salary}</Text>
            <Text style={styles.detail}>Type: {item.jobType}</Text>
            <Text style={styles.detail}>Work Model: {item.workModel}</Text>
            <Text style={styles.detail}>Seniority: {item.seniority}</Text>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[
                  styles.saveButton, 
                  isJobSaved(item.id) && styles.savedButton
                ]}
                onPress={() => toggleSaveJob(item)}
              >
                <Text style={styles.saveButtonText}>
                  {isJobSaved(item.id) ? 'Saved' : 'Save'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={() => handleApplyPress(item)}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No jobs match your search</Text>
        }
      />

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Apply for {selectedJob?.title}
            </Text>
            <Text style={styles.modalSubtitle}>{selectedJob?.company}</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Full Name *"
              value={application.name}
              onChangeText={(text) => setApplication({...application, name: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Email *"
              keyboardType="email-address"
              autoCapitalize="none"
              value={application.email}
              onChangeText={(text) => setApplication({...application, email: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Phone * (11 digits)"
              keyboardType="phone-pad"
              maxLength={11}
              value={application.phone}
              onChangeText={(text) => {
                const cleanedText = text.replace(/[^0-9]/g, '').slice(0, 11);
                setApplication({...application, phone: cleanedText});
              }}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Why should we hire you?"
              multiline
              numberOfLines={4}
              value={application.coverLetter}
              onChangeText={(text) => setApplication({...application, coverLetter: text})}
            />
            
            <View style={styles.modalButtonRow}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleApplicationSubmit}
              >
                <Text style={styles.modalButtonText}>Submit</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setApplication({
                    name: '',
                    email: '',
                    phone: '',
                    coverLetter: ''
                  });
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5'
  },
  searchInput: {
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd'
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
  saveButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center'
  },
  savedButton: {
    backgroundColor: '#4caf50'
  },
  saveButtonText: {
    color: '#333',
    fontWeight: 'bold'
  },
  applyButton: {
    backgroundColor: '#2196f3',
    padding: 10,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center'
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  headerButton: {
    marginRight: 15
  },
  headerButtonText: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 16
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center'
  },
  retryButton: {
    backgroundColor: '#1976d2',
    padding: 12,
    borderRadius: 6,
    minWidth: 120
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9'
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top'
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  modalButton: {
    padding: 12,
    borderRadius: 6,
    minWidth: 120,
    alignItems: 'center'
  },
  submitButton: {
    backgroundColor: '#4caf50'
  },
  cancelButton: {
    backgroundColor: '#f44336'
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default HomeScreen;