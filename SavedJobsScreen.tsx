import React, { useState } from 'react';
import {View,Text,FlatList,StyleSheet,TouchableOpacity,Modal,TextInput,Alert,KeyboardAvoidingView,Platform
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './types';

interface Job {
  id: string;
  title: string;
  company: string;
  salary: string;
  jobType?: string;
  workModel?: string;
  seniority?: string;
}

interface SavedJobsScreenProps {
  route: RouteProp<RootStackParamList, 'SavedJobs'>;
}

const SavedJobsScreen: React.FC<SavedJobsScreenProps> = ({ route }) => {
  const { savedJobs, jobs } = route.params;
  const [currentSavedJobs, setCurrentSavedJobs] = useState<string[]>(savedJobs);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [application, setApplication] = useState({
    name: '',
    email: '',
    phone: '',
    coverLetter: ''
  });

  const savedJobsList = jobs.filter(job => currentSavedJobs.includes(job.id));

  const handleRemoveJob = (jobId: string) => {
    setCurrentSavedJobs(prev => prev.filter(id => id !== jobId));
  };

  const handleApplyPress = (job: Job) => {
    setSelectedJob(job);
    setModalVisible(true);
  };

  const handleApplicationSubmit = () => {
   
    if (!application.name || !application.email || !application.phone || !application.coverLetter) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    
    if (!/^\S+@\S+\.\S+$/.test(application.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!/^\d{11}$/.test(application.phone)) {
      Alert.alert('Error', 'Phone number must be exactly 11 digits');
      return;
    }

    Alert.alert(
      'Application Submitted',
      `Your application for ${selectedJob?.title} at ${selectedJob?.company} has been submitted!`
    );

    // Close modal and reset form
    setModalVisible(false);
    setApplication({
      name: '',
      email: '',
      phone: '',
      coverLetter: ''
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

      {/* Application Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
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
                const numbersOnly = text.replace(/[^0-9]/g, '');
                setApplication({...application, phone: numbersOnly});
              }}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Why should we hire you? *"
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
        </KeyboardAvoidingView>
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
    marginBottom: 5,
    textAlign: 'center'
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    fontSize: 16
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
    backgroundColor: '#4CAF50'
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

export default SavedJobsScreen;