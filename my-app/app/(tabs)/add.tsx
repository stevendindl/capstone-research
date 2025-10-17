import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, Dimensions } from 'react-native';
import { Camera, useCameraDevices, useCameraPermission, VideoFile } from 'react-native-vision-camera';
import { 
  Button, 
  Card, 
  Text, 
  FAB,
  Portal,
  Modal,
  Appbar,
  List
} from 'react-native-paper';
import { router } from 'expo-router';
import { useWorkouts } from '../../contexts/workout-context';
import WorkoutModal from '../../components/workout/workout-modal';
import { Workout } from '../../types/workout';

const { width, height } = Dimensions.get('window');

const Add = () => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'back');
  const camera = useRef<Camera>(null);
  const { workouts, addWorkout, updateWorkout } = useWorkouts();

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<VideoFile | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  // Modal state
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showVideoLinkModal, setShowVideoLinkModal] = useState(false);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const startRecording = async () => {
    if (camera.current && device) {
      try {
        setIsRecording(true);
        await camera.current.startRecording({
          onRecordingFinished: (video) => {
            setRecordedVideo(video);
            setIsRecording(false);
            setShowCamera(false);
          },
          onRecordingError: (error) => {
            console.error('Recording error:', error);
            setIsRecording(false);
            Alert.alert('Error', 'Failed to record video');
          },
        });
      } catch (error) {
        console.error('Failed to start recording:', error);
        setIsRecording(false);
      }
    }
  };

  const stopRecording = async () => {
    if (camera.current && isRecording) {
      try {
        await camera.current.stopRecording();
      } catch (error) {
        console.error('Failed to stop recording:', error);
      }
    }
  };

  const handleSaveWorkout = (workout: Workout) => {
    addWorkout(workout);
    Alert.alert('Success', 'Workout saved successfully!');
  };

  const linkVideoToWorkout = (workoutId: string) => {
    if (!recordedVideo) {
      Alert.alert('Error', 'No video recorded');
      return;
    }

    const workout = workouts.find(w => w.id === workoutId);
    if (workout) {
      updateWorkout({ ...workout, videoUri: recordedVideo.path });
      setShowVideoLinkModal(false);
      setRecordedVideo(null);
      Alert.alert('Success', 'Video linked to workout successfully!');
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Camera Permission Required</Text>
            <Text variant="bodyMedium" style={styles.permissionText}>
              We need camera access to record your workout videos.
            </Text>
            <Button 
              mode="contained" 
              onPress={requestPermission}
              style={styles.permissionButton}
            >
              Grant Permission
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">No Camera Found</Text>
            <Text variant="bodyMedium">
              Unable to find a camera device on your device.
            </Text>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <Text variant="headlineSmall">Add Workout</Text>
            <Text variant="bodyMedium">Record videos and log your exercises</Text>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Button 
            mode="contained" 
            onPress={() => setShowCamera(true)}
            style={styles.actionButton}
            icon="video"
          >
            Record Video
          </Button>
          <Button 
            mode="contained" 
            onPress={() => setShowWorkoutModal(true)}
            style={styles.actionButton}
            icon="plus"
          >
            Log Workout
          </Button>
        </View>

        {/* Recorded Video Section */}
        {recordedVideo && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">Recorded Video</Text>
              <Text variant="bodyMedium">Video recorded successfully!</Text>
              <View style={styles.videoActions}>
                <Button 
                  mode="outlined" 
                  onPress={() => setShowVideoLinkModal(true)}
                  disabled={workouts.length === 0}
                  style={styles.videoButton}
                >
                  Link to Workout
                </Button>
                <Button 
                  mode="text" 
                  onPress={() => setRecordedVideo(null)}
                  style={styles.videoButton}
                >
                  Remove
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {/* Camera Modal */}
      <Portal>
        <Modal 
          visible={showCamera} 
          onDismiss={() => setShowCamera(false)}
          contentContainerStyle={styles.cameraModalContainer}
        >
          <View style={styles.cameraContainer}>
            <Appbar.Header style={styles.cameraHeader}>
              <Appbar.BackAction onPress={() => setShowCamera(false)} />
              <Appbar.Content title="Record Workout" />
              {isRecording && (
                <Appbar.Action 
                  icon="record-circle" 
                  iconColor="#FF4444"
                />
              )}
            </Appbar.Header>
            
            <Camera
              ref={camera}
              style={styles.camera}
              device={device}
              isActive={showCamera}
              video={true}
            />
            
            <View style={styles.cameraControls}>
              <View style={styles.recordingInfo}>
                {isRecording && (
                  <Text style={styles.recordingText}>Recording...</Text>
                )}
              </View>
              <FAB
                icon={isRecording ? "stop" : "record"}
                onPress={isRecording ? stopRecording : startRecording}
                style={[styles.recordButton, isRecording && styles.recordingButton]}
                size="large"
              />
            </View>
          </View>
        </Modal>
      </Portal>

      {/* Workout Modal */}
      <WorkoutModal
        visible={showWorkoutModal}
        onDismiss={() => setShowWorkoutModal(false)}
        onSave={handleSaveWorkout}
      />

      {/* Video Link Modal */}
      <Portal>
        <Modal 
          visible={showVideoLinkModal} 
          onDismiss={() => setShowVideoLinkModal(false)}
          contentContainerStyle={styles.videoLinkModalContainer}
        >
          <View style={styles.workoutModalContent}>
            <Appbar.Header style={styles.modalHeader}>
              <Appbar.BackAction onPress={() => setShowVideoLinkModal(false)} />
              <Appbar.Content title="Link Video to Workout" />
            </Appbar.Header>
            
            <ScrollView style={styles.linkScrollView}>
              <View style={styles.linkContent}>
                <Text variant="bodyMedium" style={styles.linkDescription}>
                  Select a workout to link your recorded video:
                </Text>
                {workouts.length === 0 ? (
                  <Card style={styles.emptyCard}>
                    <Card.Content>
                      <Text variant="bodyMedium">
                        No workouts available. Create a workout first to link your video.
                      </Text>
                    </Card.Content>
                  </Card>
                ) : (
                  workouts.map(workout => (
                    <List.Item
                      key={workout.id}
                      title={workout.name}
                      description={`${workout.date} • ${workout.sets.length} exercises`}
                      left={props => <List.Icon {...props} icon="dumbbell" />}
                      right={props => workout.videoUri ? 
                        <List.Icon {...props} icon="video" /> : 
                        <List.Icon {...props} icon="plus" />
                      }
                      onPress={() => linkVideoToWorkout(workout.id)}
                      style={styles.workoutListItem}
                    />
                  ))
                )}
              </View>
            </ScrollView>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

// ... (styles remain largely the same, with some additions)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flex: 0.48,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    marginBottom: 12,
  },
  navButton: {
    marginBottom: 8,
  },
  permissionText: {
    marginVertical: 12,
  },
  permissionButton: {
    marginTop: 8,
  },
  videoActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  videoButton: {
    flex: 0.48,
  },
  // Camera styles
  cameraModalContainer: {
    flex: 1,
    backgroundColor: 'black',
    margin: 0,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  cameraHeader: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    elevation: 0,
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    alignItems: 'center',
  },
  recordingInfo: {
    marginBottom: 20,
    alignItems: 'center',
  },
  recordingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  recordButton: {
    backgroundColor: '#FF4444',
  },
  recordingButton: {
    backgroundColor: '#CC0000',
  },
  // Modal styles
  videoLinkModalContainer: {
    flex: 1,
    backgroundColor: 'white',
    margin: 20,
    marginTop: 80,
    marginBottom: 40,
    borderRadius: 12,
    maxHeight: height * 0.7,
  },
  workoutModalContent: {
    flex: 1,
  },
  modalHeader: {
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  linkScrollView: {
    flex: 1,
  },
  linkContent: {
    padding: 16,
  },
  linkDescription: {
    marginBottom: 16,
  },
  emptyCard: {
    marginTop: 20,
  },
  workoutListItem: {
    marginBottom: 4,
  },
});

export default Add;