import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workout } from '../types/workout';

interface WorkoutContextType {
  workouts: Workout[];
  addWorkout: (workout: Workout) => void;
  updateWorkout: (workout: Workout) => void;
  deleteWorkout: (id: string) => void;
  getRecentWorkouts: (limit?: number) => Workout[];
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const useWorkouts = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkouts must be used within a WorkoutProvider');
  }
  return context;
};

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const stored = await AsyncStorage.getItem('workouts');
      if (stored) {
        setWorkouts(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading workouts:', error);
    }
  };

  const saveWorkouts = async (newWorkouts: Workout[]) => {
    try {
      await AsyncStorage.setItem('workouts', JSON.stringify(newWorkouts));
      setWorkouts(newWorkouts);
    } catch (error) {
      console.error('Error saving workouts:', error);
    }
  };

  const addWorkout = (workout: Workout) => {
    const newWorkouts = [...workouts, workout];
    saveWorkouts(newWorkouts);
  };

  const updateWorkout = (updatedWorkout: Workout) => {
    const newWorkouts = workouts.map(w => 
      w.id === updatedWorkout.id ? updatedWorkout : w
    );
    saveWorkouts(newWorkouts);
  };

  const deleteWorkout = (id: string) => {
    const newWorkouts = workouts.filter(w => w.id !== id);
    saveWorkouts(newWorkouts);
  };

  const getRecentWorkouts = (limit: number = 5) => {
    return workouts
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  return (
    <WorkoutContext.Provider value={{
      workouts,
      addWorkout,
      updateWorkout,
      deleteWorkout,
      getRecentWorkouts
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};