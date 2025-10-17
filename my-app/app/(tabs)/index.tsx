import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button, FAB } from 'react-native-paper';
import { router } from 'expo-router';
import { useWorkouts } from '../../contexts/workout-context';
import WorkoutCard from '../../components/workout/workout-card';

const Home = () => {
  const { getRecentWorkouts } = useWorkouts();
  const recentWorkouts = getRecentWorkouts(3);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Welcome Header */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <Text variant="headlineSmall">Welcome Back!</Text>
            <Text variant="bodyMedium">Ready for your next workout?</Text>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Button 
            mode="contained" 
            onPress={() => router.push('/(tabs)/add')}
            style={styles.actionButton}
            icon="plus"
          >
            New Workout
          </Button>
          <Button 
            mode="outlined" 
            onPress={() => router.push('/(tabs)/logs')}
            style={styles.actionButton}
            icon="history"
          >
            View All Logs
          </Button>
        </View>

        {/* Recent Workouts */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text variant="titleMedium">Recent Workouts</Text>
              <Button 
                mode="text" 
                onPress={() => router.push('/(tabs)/logs')}
                compact
              >
                View All
              </Button>
            </View>
            
            {recentWorkouts.length === 0 ? (
              <View style={styles.emptyState}>
                <Text variant="bodyMedium" style={styles.emptyText}>
                  No workouts yet. Start your fitness journey!
                </Text>
                <Button 
                  mode="contained" 
                  onPress={() => router.push('/(tabs)/add')}
                  style={styles.startButton}
                >
                  Log Your First Workout
                </Button>
              </View>
            ) : (
              recentWorkouts.map(workout => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  onPress={() => {
                    // Navigate to workout detail view
                    console.log('View workout:', workout.id);
                  }}
                />
              ))
            )}
          </Card.Content>
        </Card>

        {/* Stats Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">This Week</Text>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text variant="headlineSmall">{recentWorkouts.length}</Text>
                <Text variant="bodySmall">Workouts</Text>
              </View>
              <View style={styles.stat}>
                <Text variant="headlineSmall">
                  {recentWorkouts.reduce((total, w) => total + w.sets.length, 0)}
                </Text>
                <Text variant="bodySmall">Exercises</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  startButton: {
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  stat: {
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default Home;