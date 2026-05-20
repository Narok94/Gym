import React, { createContext, useContext, useState, useEffect } from 'react';
import { WorkoutSession, UserProfile, HistorySession, Exercise, WeightRecord } from './types';
import { WORKOUT_TEMPLATES, MOCK_USER_PROFILE, MOCK_WORKOUT_HISTORY } from './data';
import { usePersistentWorkout } from './hooks/usePersistentWorkout';

interface WorkoutContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  activeTab: 'dashboard' | 'active-workout' | 'exercises' | 'profile';
  setActiveTab: (tab: 'dashboard' | 'active-workout' | 'exercises' | 'profile') => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  workoutTemplates: WorkoutSession[];
  setWorkoutTemplates: React.Dispatch<React.SetStateAction<WorkoutSession[]>>;
  activeWorkout: WorkoutSession | null;
  setActiveWorkout: React.Dispatch<React.SetStateAction<WorkoutSession | null>>;
  workoutHistory: HistorySession[];
  setWorkoutHistory: React.Dispatch<React.SetStateAction<HistorySession[]>>;
  
  showFinishOverlay: boolean;
  setShowFinishOverlay: React.Dispatch<React.SetStateAction<boolean>>;
  congratsPhoto: string | null;
  setCongratsPhoto: React.Dispatch<React.SetStateAction<string | null>>;
  lastFinishedWorkoutStats: {
    name: string;
    duration: number;
    volume: number;
    setsCount: number;
  } | null;
  setLastFinishedWorkoutStats: React.Dispatch<React.SetStateAction<{
    name: string;
    duration: number;
    volume: number;
    setsCount: number;
  } | null>>;

  // Custom Hook Operations
  getTimerRemaining: (setId: string, defaultDuration?: number) => number;
  onUpdateTimer: (setId: string, seconds: number) => void;
  clearTimer: (setId: string) => void;

  // Global Actions
  handleStartWorkout: (templateId: string) => void;
  handleCancelActiveWorkout: () => void;
  handleUpdateSet: (exerciseId: string, setId: string, weight: number, reps: number, isCompleted: boolean) => void;
  handleAddSet: (exerciseId: string) => void;
  handleDeleteSet: (exerciseId: string, setId: string) => void;
  handleAddExerciseToActive: (exercise: Exercise) => void;
  handleFinishWorkout: (durationMinutes: number, totalVolume: number, totalSetsNum: number) => void;
  handleAddWeightRecord: (weight: number) => void;
  handleClearHistory: () => void;
  handleUpdateProfile: (updatedData: {
    name: string;
    avatarUrl: string;
    height: number;
    currentWeight: number;
    level: 'Iniciante' | 'Intermediário' | 'Avançado';
    gender?: 'male' | 'female';
  }) => void;
  handleAddGalleryPhoto: (photoBase64OrUrl: string) => void;
  handleDeleteGalleryPhoto: (photoUrl: string) => void;
  handleAddReminder: (dayOfWeek: string, time: string, label: string) => void;
  handleDeleteReminder: (id: string) => void;
  handleToggleReminder: (id: string) => void;
  handleResetAllData: () => void;
  isFemale: boolean;
  accentText: string;
  accentTextPlain: string;
  accentBg: string;
  accentBgHover: string;
  accentBorder: string;
  accentGlow: string;
  accentRing: string;
  accentFill: string;
  accentBadge: string;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tatu_isAuthenticated') === 'true';
    }
    return false;
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'active-workout' | 'exercises' | 'profile'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tatu_activeTab');
      if (stored === 'dashboard' || stored === 'active-workout' || stored === 'exercises' || stored === 'profile') {
        return stored;
      }
    }
    return 'dashboard';
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tatu_userProfile');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return MOCK_USER_PROFILE;
  });

  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutSession[]>(WORKOUT_TEMPLATES);
  const [activeWorkout, setActiveWorkout] = useState<WorkoutSession | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tatu_activeWorkout');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return null;
  });

  const {
    getOrStartTimer,
    updateTimerRemaining,
    clearTimer
  } = usePersistentWorkout(activeWorkout, setActiveWorkout);

  const [workoutHistory, setWorkoutHistory] = useState<HistorySession[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tatu_workoutHistory');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return MOCK_WORKOUT_HISTORY;
  });

  const [showFinishOverlay, setShowFinishOverlay] = useState(false);
  const [congratsPhoto, setCongratsPhoto] = useState<string | null>(null);
  const [lastFinishedWorkoutStats, setLastFinishedWorkoutStats] = useState<{
    name: string;
    duration: number;
    volume: number;
    setsCount: number;
  } | null>(null);

  useEffect(() => {
    localStorage.setItem('tatu_isAuthenticated', String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('tatu_activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('tatu_userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    if (activeWorkout) {
      localStorage.setItem('tatu_activeWorkout', JSON.stringify(activeWorkout));
    } else {
      localStorage.removeItem('tatu_activeWorkout');
    }
  }, [activeWorkout]);

  useEffect(() => {
    localStorage.setItem('tatu_workoutHistory', JSON.stringify(workoutHistory));
  }, [workoutHistory]);

  const handleStartWorkout = (templateId: string) => {
    const template = workoutTemplates.find((t) => t.id === templateId);
    if (!template) return;

    const clonedWorkout: WorkoutSession = {
      ...template,
      id: `active-${Date.now()}`,
      isCompleted: false,
      startTime: new Date().toISOString(),
      exercises: template.exercises.map((we) => ({
        ...we,
        sets: we.sets.map((s) => ({
          ...s,
          isCompleted: false
        }))
      }))
    };

    setActiveWorkout(clonedWorkout);
    setActiveTab('active-workout');
  };

  const handleCancelActiveWorkout = () => {
    setActiveWorkout(null);
    setActiveTab('dashboard');
  };

  const handleUpdateSet = (
    exerciseId: string,
    setId: string,
    weight: number,
    reps: number,
    isCompleted: boolean
  ) => {
    if (!activeWorkout) return;

    const updatedExercises = activeWorkout.exercises.map((we) => {
      if (we.id === exerciseId) {
        return {
          ...we,
          sets: we.sets.map((set) => {
            if (set.id === setId) {
              return { ...set, weight, reps, isCompleted };
            }
            return set;
          })
        };
      }
      return we;
    });

    setActiveWorkout({
      ...activeWorkout,
      exercises: updatedExercises
    });
  };

  const handleAddSet = (exerciseId: string) => {
    if (!activeWorkout) return;

    const updatedExercises = activeWorkout.exercises.map((we) => {
      if (we.id === exerciseId) {
        const lastSet = we.sets[we.sets.length - 1];
        const templateWeight = lastSet ? lastSet.weight : 10;
        const templateReps = lastSet ? lastSet.reps : 10;

        const newSet = {
          id: `set-${Date.now()}-${Math.random()}`,
          setNumber: we.sets.length + 1,
          weight: templateWeight,
          reps: templateReps,
          isCompleted: false
        };
        return {
          ...we,
          sets: [...we.sets, newSet]
        };
      }
      return we;
    });

    setActiveWorkout({
      ...activeWorkout,
      exercises: updatedExercises
    });
  };

  const handleDeleteSet = (exerciseId: string, setId: string) => {
    if (!activeWorkout) return;

    const updatedExercises = activeWorkout.exercises.map((we) => {
      if (we.id === exerciseId) {
        const nextSets = we.sets.filter((s) => s.id !== setId).map((s, idx) => ({
          ...s,
          setNumber: idx + 1
        }));
        return {
          ...we,
          sets: nextSets
        };
      }
      return we;
    });

    setActiveWorkout({
      ...activeWorkout,
      exercises: updatedExercises
    });
  };

  const handleAddExerciseToActive = (exercise: Exercise) => {
    if (!activeWorkout) {
      const emptySession: WorkoutSession = {
        id: `active-${Date.now()}`,
        name: 'Treino Personalizado',
        isCompleted: false,
        startTime: new Date().toISOString(),
        exercises: [{
          id: `we-${Date.now()}`,
          exercise: exercise,
          sets: [
            { id: `s-${Date.now()}-1`, setNumber: 1, weight: 10, reps: 10, isCompleted: false },
            { id: `s-${Date.now()}-2`, setNumber: 2, weight: 10, reps: 10, isCompleted: false },
            { id: `s-${Date.now()}-3`, setNumber: 3, weight: 10, reps: 10, isCompleted: false }
          ]
        }]
      };
      setActiveWorkout(emptySession);
      setActiveTab('active-workout');
      return;
    }

    const newWorkoutExercise = {
      id: `we-${Date.now()}`,
      exercise: exercise,
      sets: [
        { id: `s-${Date.now()}-1`, setNumber: 1, weight: 10, reps: 10, isCompleted: false },
        { id: `s-${Date.now()}-2`, setNumber: 2, weight: 10, reps: 10, isCompleted: false },
        { id: `s-${Date.now()}-3`, setNumber: 3, weight: 10, reps: 10, isCompleted: false }
      ]
    };

    setActiveWorkout({
      ...activeWorkout,
      exercises: [...activeWorkout.exercises, newWorkoutExercise]
    });
    setActiveTab('active-workout');
  };

  const handleFinishWorkout = (durationMinutes: number, totalVolume: number, totalSetsNum: number) => {
    if (!activeWorkout) return;

    const historyItem: HistorySession = {
      id: `history-${Date.now()}`,
      name: activeWorkout.name,
      completedAt: new Date().toISOString(),
      durationMinutes: durationMinutes,
      totalSets: totalSetsNum,
      totalWeightVolume: totalVolume
    };

    setWorkoutHistory(prev => [historyItem, ...prev]);
    
    setUserProfile((prev) => ({
      ...prev,
      streakDays: prev.streakDays + 1
    }));

    setLastFinishedWorkoutStats({
      name: activeWorkout.name,
      duration: durationMinutes,
      volume: totalVolume,
      setsCount: totalSetsNum
    });
    
    setShowFinishOverlay(true);
    setActiveWorkout(null);
  };

  const handleAddWeightRecord = (weight: number) => {
    const formattedDate = new Date().toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
    const capitalizedMonth = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    const newRecord: WeightRecord = {
      date: capitalizedMonth,
      weight: weight
    };

    setUserProfile((prev) => ({
      ...prev,
      currentWeight: weight,
      weightHistory: [...prev.weightHistory, newRecord].slice(-6)
    }));
  };

  const handleClearHistory = () => {
    setWorkoutHistory([]);
  };

  const handleUpdateProfile = (updatedData: {
    name: string;
    avatarUrl: string;
    height: number;
    currentWeight: number;
    level: 'Iniciante' | 'Intermediário' | 'Avançado';
    gender?: 'male' | 'female';
  }) => {
    setUserProfile((prev) => {
      const weightHistory = [...(prev.weightHistory || [])];
      if (updatedData.currentWeight !== prev.currentWeight) {
        const formattedDate = new Date().toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
        const capitalizedMonth = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
        weightHistory.push({
          date: capitalizedMonth,
          weight: updatedData.currentWeight
        });
      }
      return {
        ...prev,
        ...updatedData,
        weightHistory: weightHistory.slice(-6)
      };
    });
  };

  const handleAddGalleryPhoto = (photoBase64OrUrl: string) => {
    setUserProfile((prev) => ({
      ...prev,
      photos: [photoBase64OrUrl, ...(prev.photos || [])]
    }));
  };

  const handleDeleteGalleryPhoto = (photoUrl: string) => {
    setUserProfile((prev) => ({
      ...prev,
      photos: (prev.photos || []).filter(item => item !== photoUrl)
    }));
  };

  const handleAddReminder = (dayOfWeek: string, time: string, label: string) => {
    setUserProfile((prev) => ({
      ...prev,
      reminders: [
        ...(prev.reminders || []),
        {
          id: `reminder-${Date.now()}`,
          dayOfWeek,
          time,
          label: label.trim(),
          isActive: true
        }
      ]
    }));
  };

  const handleDeleteReminder = (id: string) => {
    setUserProfile((prev) => ({
      ...prev,
      reminders: (prev.reminders || []).filter(r => r.id !== id)
    }));
  };

  const handleToggleReminder = (id: string) => {
    setUserProfile((prev) => ({
      ...prev,
      reminders: (prev.reminders || []).map(r => r.id === id ? { ...r, isActive: !r.isActive } : r)
    }));
  };

  const handleResetAllData = () => {
    setUserProfile({
      name: 'Henrique Silva',
      avatarUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200',
      level: 'Iniciante',
      gender: 'male',
      streakDays: 0,
      height: 180,
      currentWeight: 80.0,
      weightHistory: [],
      photos: [],
      reminders: []
    });
    setWorkoutHistory([]);
    setActiveWorkout(null);
  };

  const isFemale = userProfile.gender === 'female';
  const accentText = isFemale ? 'text-pink-500 font-extrabold' : 'text-blue-400 font-extrabold';
  const accentTextPlain = isFemale ? 'text-pink-400' : 'text-blue-450';
  const accentBg = isFemale ? 'bg-pink-600' : 'bg-blue-600';
  const accentBgHover = isFemale ? 'hover:bg-pink-500' : 'hover:bg-blue-500';
  const accentBorder = isFemale ? 'border-pink-500/30' : 'border-blue-500/30';
  const accentGlow = isFemale ? 'shadow-[0_4px_25px_rgba(236,72,153,0.35)]' : 'shadow-[0_4px_25px_rgba(37,99,235,0.35)]';
  const accentRing = isFemale ? 'focus:ring-pink-500 focus:border-pink-500' : 'focus:ring-blue-500 focus:border-blue-500';
  const accentFill = isFemale ? 'fill-pink-500 text-pink-500' : 'fill-blue-500 text-blue-500';
  const accentBadge = isFemale ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20';

  return (
    <WorkoutContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        activeTab,
        setActiveTab,
        userProfile,
        setUserProfile,
        workoutTemplates,
        setWorkoutTemplates,
        activeWorkout,
        setActiveWorkout,
        workoutHistory,
        setWorkoutHistory,
        showFinishOverlay,
        setShowFinishOverlay,
        congratsPhoto,
        setCongratsPhoto,
        lastFinishedWorkoutStats,
        setLastFinishedWorkoutStats,
        getTimerRemaining: getOrStartTimer,
        onUpdateTimer: updateTimerRemaining,
        clearTimer,
        handleStartWorkout,
        handleCancelActiveWorkout,
        handleUpdateSet,
        handleAddSet,
        handleDeleteSet,
        handleAddExerciseToActive,
        handleFinishWorkout,
        handleAddWeightRecord,
        handleClearHistory,
        handleUpdateProfile,
        handleAddGalleryPhoto,
        handleDeleteGalleryPhoto,
        handleAddReminder,
        handleDeleteReminder,
        handleToggleReminder,
        handleResetAllData,
        isFemale,
        accentText,
        accentTextPlain,
        accentBg,
        accentBgHover,
        accentBorder,
        accentGlow,
        accentRing,
        accentFill,
        accentBadge
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};
