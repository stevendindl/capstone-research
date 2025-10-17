import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Text, Searchbar, FAB, Menu, Button } from 'react-native-paper';
import { router } from 'expo-router';
import { useWorkouts } from '../../contexts/workout-context';
import WorkoutCard from '../../components/workout/workout-card';

const Logs = () => {
  const { workouts, deleteWorkout } = useWorkouts();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [menuVisible, setMenuVisible] = useState(false);

  const filteredAndSortedWorkouts = workouts
    .filter(workout => 
      workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workout.sets.some(set => 
        set.exercise.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return a.name.localeCompare(b.name);
      }
    });

  const handleDeleteWorkout = (workoutId: string, workoutName: string) => {
    Alert.alert(
      'Delete Workout',
      `Are you sure you want to delete "${workoutName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteWorkout(workoutId)
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text variant="headlineSmall">Workout Logs</Text>
              <Text variant="bodyMedium">{workouts.length} total workouts</Text>
            </View>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setMenuVisible(true)}
                  icon="sort"
                  compact
                >
                  Sort
                </Button>
              }
            >
              <Menu.Item
                onPress={() => {
                  setSortBy('date');
                  setMenuVisible(false);
                }}
                title="By Date"
                leadingIcon={sortBy === 'date' ? 'check' : undefined}
              />
              <Menu.Item
                onPress={() => {
                  setSortBy('name');
                  setMenuVisible(false);
                }}
                title="By Name"
                leadingIcon={sortBy === 'name' ? 'check' : undefined}
              />
            </Menu>
          </View>
        </Card.Content>
      </Card>

      {/* Search */}
      <Searchbar
        placeholder="Search workouts or exercises..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {/* Workout List */}
      <ScrollView style={styles.scrollView}>
        {filteredAndSortedWorkouts.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <View style={styles.emptyState}>
                {searchQuery ? (
                  <>
                    <Text variant="bodyLarge" style={styles.emptyText}>
                      No workouts match your search
                    </Text>
                    <Text variant="bodyMedium" style={styles.emptySubtext}>
                      Try searching for a different exercise or workout name
                    </Text>
                  </>
                ) : (
                  <>
                    <Text variant="bodyLarge" style={styles.emptyText}>
                      No workouts logged yet
                    </Text>
                    <Text variant="bodyMedium" style={styles.emptySubtext}>
                      Start your fitness journey by logging your first workout!
                    </Text>
                    <Button 
                      mode="contained" 
                      onPress={() => router.push('/(tabs)/add')}
                      style={styles.startButton}
                    >
                      Log Your First Workout
                    </Button>
                  </>
                )}
              </View>
            </Card.Content>
          </Card>
        ) : (
          filteredAndSortedWorkouts.map(workout => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              showActions={true}
              onPress={() => {
                // Navigate to workout detail view (future implementation)
                console.log('View workout details:', workout.id);
              }}
              onDelete={() => handleDeleteWorkout(workout.id, workout.name)}
            />
          ))
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/(tabs)/add')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerCard: {
    margin: 16,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyCard: {
    marginTop: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#666',
  },
  emptySubtext: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#888',
  },
  startButton: {
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default Logs;