import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Alert } from 'react-native';
import { 
  Modal, 
  Portal, 
  Appbar, 
  TextInput, 
  Button, 
  Text, 
  Divider,
  Card,
  IconButton 
} from 'react-native-paper';
import { Workout, WorkoutSet } from '../../types/workout';

const { height } = Dimensions.get('window');

interface WorkoutModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (workout: Workout) => void;
  initialWorkout?: Workout;
}

const WorkoutModal: React.FC<WorkoutModalProps> = ({
  visible,
  onDismiss,
  onSave,
  initialWorkout
}) => {
  const [currentWorkout, setCurrentWorkout] = useState<Workout>(
    initialWorkout || {
      id: '',
      name: '',
      date: new Date().toISOString().split('T')[0],
      sets: []
    }
  );

  const [currentSet, setCurrentSet] = useState<WorkoutSet>({
    id: '',
    exercise: '',
    sets: '',
    reps: '',
    weight: '',
    notes: ''
  });

  const addSetToWorkout = () => {
    if (!currentSet.exercise) {
      Alert.alert('Error', 'Please enter an exercise name');
      return;
    }

    const newSet: WorkoutSet = {
      ...currentSet,
      id: Date.now().toString()
    };

    setCurrentWorkout(prev => ({
      ...prev,
      sets: [...prev.sets, newSet]
    }));

    setCurrentSet({
      id: '',
      exercise: '',
      sets: '',
      reps: '',
      weight: '',
      notes: ''
    });
  };

  const removeSetFromWorkout = (setId: string) => {
    setCurrentWorkout(prev => ({
      ...prev,
      sets: prev.sets.filter(set => set.id !== setId)
    }));
  };

  const handleSave = () => {
    if (!currentWorkout.name || currentWorkout.sets.length === 0) {
      Alert.alert('Error', 'Please enter a workout name and add at least one set');
      return;
    }

    const workout: Workout = {
      ...currentWorkout,
      id: currentWorkout.id || Date.now().toString()
    };

    onSave(workout);
    onDismiss();
  };

  return (
    <Portal>
      <Modal 
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.container}
      >
        <View style={styles.content}>
          <Appbar.Header style={styles.header}>
            <Appbar.BackAction onPress={onDismiss} />
            <Appbar.Content title="Log Workout" />
            <Appbar.Action icon="check" onPress={handleSave} />
          </Appbar.Header>
          
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.form}>
              <TextInput
                label="Workout Name"
                value={currentWorkout.name}
                onChangeText={(text) => setCurrentWorkout(prev => ({ ...prev, name: text }))}
                style={styles.input}
                mode="outlined"
              />
              
              <TextInput
                label="Date"
                value={currentWorkout.date}
                onChangeText={(text) => setCurrentWorkout(prev => ({ ...prev, date: text }))}
                style={styles.input}
                mode="outlined"
              />

              <Divider style={styles.divider} />
              <Text variant="titleMedium" style={styles.sectionTitle}>Add Exercise</Text>
              
              <TextInput
                label="Exercise"
                value={currentSet.exercise}
                onChangeText={(text) => setCurrentSet(prev => ({ ...prev, exercise: text }))}
                style={styles.input}
                mode="outlined"
              />
              
              <View style={styles.row}>
                <TextInput
                  label="Sets"
                  value={currentSet.sets}
                  onChangeText={(text) => setCurrentSet(prev => ({ ...prev, sets: text }))}
                  style={[styles.input, styles.halfWidth]}
                  keyboardType="numeric"
                  mode="outlined"
                />
                <TextInput
                  label="Reps"
                  value={currentSet.reps}
                  onChangeText={(text) => setCurrentSet(prev => ({ ...prev, reps: text }))}
                  style={[styles.input, styles.halfWidth]}
                  keyboardType="numeric"
                  mode="outlined"
                />
              </View>
              
              <View style={styles.row}>
                <TextInput
                  label="Weight (lbs)"
                  value={currentSet.weight}
                  onChangeText={(text) => setCurrentSet(prev => ({ ...prev, weight: text }))}
                  style={[styles.input, styles.halfWidth]}
                  keyboardType="numeric"
                  mode="outlined"
                />
                <View style={[styles.halfWidth, styles.addSetContainer]}>
                  <Button 
                    mode="contained" 
                    onPress={addSetToWorkout} 
                    style={styles.addSetButton}
                    compact
                  >
                    Add Set
                  </Button>
                </View>
              </View>
              
              <TextInput
                label="Notes (optional)"
                value={currentSet.notes}
                onChangeText={(text) => setCurrentSet(prev => ({ ...prev, notes: text }))}
                style={styles.notesInput}
                multiline
                numberOfLines={3}
                mode="outlined"
              />

              {currentWorkout.sets.length > 0 && (
                <View style={styles.setsSection}>
                  <Divider style={styles.divider} />
                  <Text variant="titleMedium" style={styles.sectionTitle}>
                    Current Workout ({currentWorkout.sets.length} exercises)
                  </Text>
                  {currentWorkout.sets.map(set => (
                    <Card key={set.id} style={styles.setCard}>
                      <Card.Content>
                        <View style={styles.setHeader}>
                          <Text style={styles.setExercise}>{set.exercise}</Text>
                          <IconButton
                            icon="delete"
                            size={20}
                            onPress={() => removeSetFromWorkout(set.id)}
                          />
                        </View>
                        <Text style={styles.setDetails}>
                          {set.sets} sets × {set.reps} reps @ {set.weight}lbs
                        </Text>
                        {set.notes && (
                          <Text style={styles.setNotes}>{set.notes}</Text>
                        )}
                      </Card.Content>
                    </Card>
                  ))}
                </View>
              )}
              
              <View style={styles.bottomPadding} />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    margin: 8,
    marginTop: 60,
    marginBottom: 20,
    borderRadius: 12,
    maxHeight: height * 0.9,
  },
  content: {
    flex: 1,
  },
  header: {
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  form: {
    padding: 16,
  },
  input: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    flex: 0.48,
  },
  addSetContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addSetButton: {
    marginTop: 8,
  },
  notesInput: {
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  setsSection: {
    marginTop: 8,
  },
  setCard: {
    marginBottom: 8,
  },
  setHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  setExercise: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  setDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  setNotes: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 4,
  },
  bottomPadding: {
    height: 40,
  },
});

export default WorkoutModal;