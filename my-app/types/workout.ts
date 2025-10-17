export interface WorkoutSet {
  id: string;
  exercise: string;
  sets: string;
  reps: string;
  weight: string;
  notes: string;
}

export interface Workout {
  id: string;
  name: string;
  date: string;
  sets: WorkoutSet[];
  videoUri?: string;
}