import { useEffect, useState, useRef } from 'react';
import { WorkoutSession } from '../types';

export interface PersistentWorkoutState {
  activeWorkout: WorkoutSession | null;
  lastInteractionTimestamp: number;
  activeTimers: Record<string, { startTime: number; duration: number }>;
}

const STORAGE_KEY = 'tatu_gym_active_workout_state';
const TIMEOUT_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function usePersistentWorkout(
  activeWorkout: WorkoutSession | null,
  setActiveWorkout: (workout: WorkoutSession | null) => void
) {
  const [activeTimers, setActiveTimers] = useState<Record<string, { startTime: number; duration: number }>>({});
  const activeWorkoutRef = useRef(activeWorkout);
  activeWorkoutRef.current = activeWorkout;

  // Initialize and load saved state on mount or foreground
  useEffect(() => {
    const handleLoadState = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      try {
        const state: PersistentWorkoutState = JSON.parse(stored);
        const now = Date.now();
        const inactiveDuration = now - state.lastInteractionTimestamp;

        if (inactiveDuration > TIMEOUT_MS) {
          // Inactive for more than 30 minutes - clear everything
          localStorage.removeItem(STORAGE_KEY);
          setActiveWorkout(null);
          setActiveTimers({});
          localStorage.removeItem('tatu_activeWorkout');
        } else {
          // Valid state: restore active workout if different
          if (state.activeWorkout) {
            setActiveWorkout(state.activeWorkout);
          }
          if (state.activeTimers) {
            setActiveTimers(state.activeTimers);
          }
        }
      } catch (e) {
        console.error('Error restoring active workout state from localStorage', e);
      }
    };

    handleLoadState();

    // Listen to visibilitychange to restore/update times dynamically
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleLoadState();
      } else {
        // Save current state when backgrounded
        saveCurrentState();
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Save state on change helper
  const saveCurrentState = () => {
    if (!activeWorkoutRef.current) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    const state: PersistentWorkoutState = {
      activeWorkout: activeWorkoutRef.current,
      lastInteractionTimestamp: Date.now(),
      activeTimers
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  };

  // Sync to local storage whenever activeWorkout or activeTimers modify
  useEffect(() => {
    saveCurrentState();
  }, [activeWorkout, activeTimers]);

  // Keep interaction timestamp updated on general user taps/inputs
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!activeWorkoutRef.current) return;
      
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const state: PersistentWorkoutState = JSON.parse(stored);
          state.lastInteractionTimestamp = Date.now();
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
          // Silently ignore
        }
      }
    };

    window.addEventListener('mousedown', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);

    return () => {
      window.removeEventListener('mousedown', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  const getOrStartTimer = (setId: string, defaultDuration: number = 54): number => {
    const now = Date.now();
    const existing = activeTimers[setId];

    if (existing) {
      const elapsedSeconds = Math.floor((now - existing.startTime) / 1000);
      const remaining = existing.duration - elapsedSeconds;
      return remaining > 0 ? remaining : 0;
    }

    // Start a brand-new timer
    const newTimer = { startTime: now, duration: defaultDuration };
    setActiveTimers(prev => ({ ...prev, [setId]: newTimer }));
    return defaultDuration;
  };

  const updateTimerRemaining = (setId: string, newRemaining: number) => {
    const now = Date.now();
    setActiveTimers(prev => ({
      ...prev,
      [setId]: {
        startTime: now,
        duration: newRemaining
      }
    }));
  };

  const clearTimer = (setId: string) => {
    setActiveTimers(prev => {
      const next = { ...prev };
      delete next[setId];
      return next;
    });
  };

  return {
    getOrStartTimer,
    updateTimerRemaining,
    clearTimer
  };
}
