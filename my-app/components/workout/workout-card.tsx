import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Chip, IconButton } from 'react-native-paper';
import { Workout } from '../../types/workout';

interface WorkoutCardProps {
  workout: Workout;
  onPress?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ 
  workout, 
  onPress, 
  onDelete, 
  showActions = false 
}) => {
  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.info}>
            <Text variant="titleMedium">{workout.name}</Text>
            <Text variant="bodySmall" style={styles.date}>{workout.date}</Text>
            <Text variant="bodySmall" style={styles.exercises}>
              {workout.sets.length} exercises
            </Text>
          </View>
          {showActions && onDelete && (
            <IconButton
              icon="delete"
              size={20}
              onPress={onDelete}
            />
          )}
        </View>
        
        {workout.videoUri && (
          <Chip icon="video" mode="outlined" style={styles.videoChip}>
            Video Linked
          </Chip>
        )}
        
        <View style={styles.setsPreview}>
          {workout.sets.slice(0, 3).map(set => (
            <Text key={set.id} variant="bodySmall" style={styles.setPreview}>
              {set.exercise}: {set.sets}×{set.reps} @ {set.weight}lbs
            </Text>
          ))}
          {workout.sets.length > 3 && (
            <Text variant="bodySmall" style={styles.moreText}>
              +{workout.sets.length - 3} more exercises
            </Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  info: {
    flex: 1,
  },
  date: {
    color: '#666',
    marginTop: 2,
  },
  exercises: {
    color: '#666',
    marginTop: 2,
  },
  videoChip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  setsPreview: {
    marginTop: 8,
  },
  setPreview: {
    color: '#555',
    marginBottom: 2,
  },
  moreText: {
    color: '#888',
    fontStyle: 'italic',
  },
});

export default WorkoutCard;