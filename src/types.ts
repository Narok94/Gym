export type MuscleGroup = 'Peito' | 'Costas' | 'Pernas' | 'Ombros' | 'Braços' | 'Cardio' | 'Abdômen';

export interface Exercise {
  id: string;
  name: string;
  category: MuscleGroup;
  description?: string;
  imageUrl?: string;
}

export interface ExerciseSet {
  id: string;
  setNumber: number;
  weight: number;      // in kg
  reps: number;        // reps count
  isCompleted: boolean;
}

export interface WorkoutExercise {
  id: string;
  exercise: Exercise;
  sets: ExerciseSet[];
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  name: string; // e.g. "Treino A - Peito e Tríceps"
  exercises: WorkoutExercise[];
  startTime?: string;
  endTime?: string;
  isCompleted: boolean;
  durationMinutes?: number;
}

export interface HistorySession {
  id: string;
  name: string;
  completedAt: string; // ISO string
  durationMinutes: number;
  totalSets: number;
  totalWeightVolume: number; // Sum of sets * weight
}

export interface WeightRecord {
  date: string; // format "DD/MM" or similar
  weight: number; // in kg
}

export interface UserProfile {
  name: string;
  avatarUrl: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  gender?: 'male' | 'female';
  streakDays: number;
  height: number; // cm
  currentWeight: number; // kg
  weightHistory: WeightRecord[];
  photos?: string[]; // list of workout gallery photos
  reminders?: WorkoutReminder[]; // list of workout reminders
}

export interface WorkoutReminder {
  id: string;
  dayOfWeek: string; // e.g., 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'
  time: string;      // e.g., '18:30'
  label: string;     // custom tag e.g. "Treino de Peito"
  isActive: boolean;
}
