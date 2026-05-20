import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Dumbbell, Clock, Plus, Trash2, Check, CheckSquare, 
  Square, RefreshCw, X, AlertTriangle, ChevronRight, Award, Info, Eye
} from 'lucide-react';
import { WorkoutSession, WorkoutExercise, ExerciseSet, Exercise } from '../types';
import { COMPREHENSIVE_EXERCISES } from '../data';
import ExerciseGifPlayer from './ExerciseGifPlayer';
import ActiveExerciseCard from './ActiveExerciseCard';
import { useWorkout } from '../WorkoutContext';

export default function ActiveWorkoutTab() {
  const {
    activeWorkout,
    workoutTemplates,
    handleStartWorkout: onStartWorkout,
    handleUpdateSet: onUpdateSet,
    handleAddSet: onAddSet,
    handleDeleteSet: onDeleteSet,
    handleAddExerciseToActive: onAddExercise,
    handleFinishWorkout: onFinishWorkout,
    handleCancelActiveWorkout: onCancelActiveWorkout,
    getTimerRemaining,
    onUpdateTimer,
    isFemale,
    accentBg,
    accentBgHover,
    accentBorder,
    accentGlow,
    accentRing,
    accentFill,
    accentText,
    accentTextPlain,
    accentBadge
  } = useWorkout();

  // Active Workout Timer (how long the workout has been running)
  const [workoutSeconds, setWorkoutSeconds] = useState(0);
  const workoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Rest Timer State
  const [restSeconds, setRestSeconds] = useState(60);
  const [initialRestDuration, setInitialRestDuration] = useState(60);
  const [isRestActive, setIsRestActive] = useState(false);
  const [restTimerCompleted, setRestTimerCompleted] = useState(false);
  const restTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Exercise lookup state for adding premium exercise
  const [isAddPickerOpen, setIsAddPickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Track if they want to cancel (confirmation state)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Initialize and run the main Workout timer
  useEffect(() => {
    if (activeWorkout) {
      // Calculate elapsed seconds to survive reloads/refresh page
      let initialSecs = 1;
      if (activeWorkout.startTime) {
        const elapsedMs = Date.now() - new Date(activeWorkout.startTime).getTime();
        if (elapsedMs > 0) {
          initialSecs = Math.floor(elapsedMs / 1000);
        }
      }
      setWorkoutSeconds(initialSecs);

      workoutTimerRef.current = setInterval(() => {
        setWorkoutSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (workoutTimerRef.current) clearInterval(workoutTimerRef.current);
      setWorkoutSeconds(0);
    }

    return () => {
      if (workoutTimerRef.current) clearInterval(workoutTimerRef.current);
    };
  }, [activeWorkout]);

  // Handle rest countdown logic
  useEffect(() => {
    if (isRestActive && restSeconds > 0) {
      restTimerRef.current = setInterval(() => {
        setRestSeconds((prev) => {
          if (prev <= 1) {
            setIsRestActive(false);
            setRestTimerCompleted(true);
            if (restTimerRef.current) clearInterval(restTimerRef.current);
            // Trigger haptic vibration if available
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
              navigator.vibrate([200, 100, 200]);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    }

    return () => {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    };
  }, [isRestActive, restSeconds]);

  // Format seconds to MM:SS
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Triggered when a set is completed
  const handleSetCheckChange = (
    weId: string, 
    setId: string, 
    weight: number, 
    reps: number, 
    currentlyCompleted: boolean
  ) => {
    const nextCompletedState = !currentlyCompleted;
    onUpdateSet(weId, setId, weight, reps, nextCompletedState);

    // If marked as COMPLETED, dynamically register and kick off the 54s contextual countdown timer
    if (nextCompletedState) {
      getTimerRemaining(setId);
    }
  };

  // Adjust rest seconds on the fly
  const addRestTime = (secs: number) => {
    setRestSeconds((prev) => Math.max(0, prev + secs));
    setInitialRestDuration((prev) => Math.max(10, prev + secs));
  };

  const handleFinish = () => {
    if (!activeWorkout) return;

    // Calculate details
    const MathDurationMinutes = Math.round(workoutSeconds / 60) || 1;
    let totalVolume = 0;
    let totalSetsNum = 0;

    activeWorkout.exercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        if (s.isCompleted) {
          totalVolume += s.weight * s.reps;
          totalSetsNum += 1;
        }
      });
    });

    onFinishWorkout(MathDurationMinutes, totalVolume, totalSetsNum);
  };

  // Search filtered exercises for picker
  const filteredExercises = COMPREHENSIVE_EXERCISES.filter(ex => 
    ex.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    ex.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectExerciseToAdd = (ex: Exercise) => {
    onAddExercise(ex);
    setIsAddPickerOpen(false);
    setSearchQuery('');
  };

  // Render Workout Selector if no workout is active
  if (!activeWorkout) {
    const dumbbellColorClass = isFemale ? 'text-pink-500' : 'text-blue-400';
    const activeTextHighlight = isFemale ? 'text-pink-400' : 'text-blue-400 font-bold';

    return (
      <div className="space-y-6 animate-fade-in px-1 text-center py-10 relative z-15">
        <div className={`w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center ${dumbbellColorClass} mx-auto shadow-lg mb-4`}>
          <Dumbbell className="w-8 h-8" />
        </div>
        <div className="space-y-2.5">
          <h2 className="text-xl font-display font-extrabold text-white">Nenhum Treino Ativo</h2>
          <p className="text-gray-400 text-xs sm:text-sm max-w-xs sm:max-w-sm mx-auto leading-relaxed">
            Nenhuma sessão de treino iniciada. Vá até à aba <span className={`${activeTextHighlight} font-bold`}>Dashboard</span> e comece o seu treino recomendado do dia! 🏋️⚡
          </p>
        </div>

        {/* Workout library templates list - Unhidden so user can select their workout directly */}
        <div className="space-y-3 pt-4 text-left max-w-sm mx-auto">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono text-center mb-1">
            Ou comece um dos seus Treinos salvos:
          </p>
          {workoutTemplates.map((template) => (
            <div 
              key={template.id} 
              className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-750 rounded-2xl p-4 transition-all cursor-pointer group flex items-center justify-between"
              onClick={() => onStartWorkout(template.id)}
            >
              <div className="space-y-1 pr-4">
                <h3 className={`text-sm font-display font-bold text-white group-hover:${isFemale ? 'text-pink-500' : 'text-blue-400'} transition-colors`}>
                  {template.name}
                </h3>
                <p className="text-[11px] text-gray-400 font-medium line-clamp-1">
                  {template.exercises.map(e => e.exercise.name).slice(0, 3).join(', ')}...
                </p>
                <div className="flex gap-2 pt-1 font-mono">
                  <span className="text-[9px] font-mono bg-slate-950 font-semibold px-2 py-0.5 rounded text-gray-400">
                    {template.exercises.length} Exercícios
                  </span>
                </div>
              </div>
              <div className={`shrink-0 w-8 h-8 rounded-full ${isFemale ? 'bg-pink-500/10 text-pink-400 group-hover:bg-pink-500' : 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-600'} group-hover:text-slate-950 flex items-center justify-center transition-all`}>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Calculate completed stats out of total
  const totalSets = activeWorkout.exercises.reduce((sum, e) => sum + e.sets.length, 0);
  const completedSets = activeWorkout.exercises.reduce(
    (sum, e) => sum + e.sets.filter(s => s.isCompleted).length, 0
  );

  // Calculate total training load volume in real-time
  const currentVolume = activeWorkout.exercises.reduce((sum, e) => {
    return sum + e.sets.reduce((setSum, s) => {
      return s.isCompleted ? setSum + (s.weight * s.reps) : setSum;
    }, 0);
  }, 0);

  return (
    <div className="space-y-5 animate-fade-in pb-28 px-0.5 relative z-10">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md space-y-3">
        <div className="flex justify-between items-start gap-3">
          <div>
            <span className={`text-xs uppercase font-mono tracking-widest ${isFemale ? 'text-pink-400' : 'text-blue-400'} font-black`}>EM ANDAMENTO</span>
            <h2 className="text-2xl font-display font-black text-white tracking-tight">{activeWorkout.name}</h2>
          </div>
          <button 
            type="button"
            onClick={() => setShowCancelConfirm(true)}
            className="text-gray-400 hover:text-red-400 p-1.5 hover:bg-slate-950 rounded-lg transition-colors cursor-pointer"
            title="Cancelar treino"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Gorgeous, gamified 3-column layout */}
        <div className="grid grid-cols-3 items-center pt-3 border-t border-slate-800/60 text-xs gap-1.5">
          <div className="flex items-center gap-1.5 text-gray-300 font-mono">
            <Clock className={`w-3.5 h-3.5 ${isFemale ? 'text-pink-550' : 'text-blue-400'} shrink-0`} />
            <span className={`${isFemale ? 'text-pink-500 font-black' : 'text-blue-400 font-black'}`}>{formatTime(workoutSeconds)}</span>
          </div>

          <div className="flex items-center justify-center gap-1 text-gray-400 font-mono">
            <span className="hidden sm:inline">Sets: </span>
            <strong className={`${isFemale ? 'text-pink-500' : 'text-blue-400'} font-black`}>{completedSets}/{totalSets}</strong>
          </div>

          <div className={`flex items-center justify-end gap-1 ${isFemale ? 'text-pink-400' : 'text-blue-400'} font-mono font-bold`}>
            <Award className={`w-3.5 h-3.5 ${isFemale ? 'text-pink-400' : 'text-blue-400'} shrink-0`} />
            <span className="text-[11px]">Vol: <span className="text-white font-extrabold">{currentVolume}</span> kg</span>
          </div>
        </div>
      </div>

      {/* Confirmation modal overlay for canceling workout */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-xs w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-extrabold text-white text-base">Descartar treino?</h3>
              <p className="text-gray-400 text-xs">Todos os dados desta sessão de treino serão limpos e perdidos permanentemente.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                className="bg-slate-950 border border-slate-800 text-gray-300 font-bold py-2 px-3 rounded-xl text-xs hover:bg-slate-800 cursor-pointer"
                onClick={() => setShowCancelConfirm(false)}
              >
                Voltar
              </button>
              <button
                type="button"
                className="bg-red-600 text-white font-bold py-2 px-3 rounded-xl text-xs hover:bg-red-700 cursor-pointer shadow-lg shadow-red-900/20"
                onClick={() => {
                  setShowCancelConfirm(false);
                  onCancelActiveWorkout();
                }}
              >
                Sim, descartar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Exercises Cards */}
      <div className="space-y-4">
        {activeWorkout.exercises.map((we, ex_idx) => (
          <ActiveExerciseCard
            key={we.id}
            we={we}
            exIdx={ex_idx}
            onUpdateSet={onUpdateSet}
            onDeleteSet={onDeleteSet}
            onAddSet={onAddSet}
            handleSetCheckChange={handleSetCheckChange}
            getTimerRemaining={getTimerRemaining}
            onUpdateTimer={onUpdateTimer}
          />
        ))}
      </div>

      {/* Button to expand or insert extra exercises to active workout */}
      <div className="space-y-4 pt-2">
        <button
          type="button"
          onClick={() => setIsAddPickerOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-slate-900/40 hover:bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-xs font-semibold text-gray-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer select-none"
        >
          <Plus className={`w-4 h-4 ${isFemale ? 'text-pink-500' : 'text-blue-400'}`} />
          <span>Inserir Outro Exercício no Treino</span>
        </button>

        {/* Big Complete Workout CTA */}
        <button
          type="button"
          onClick={handleFinish}
          className={`w-full flex items-center justify-center gap-2 ${accentBg} ${accentBgHover} text-white font-bold font-display rounded-2xl py-3.5 px-4 shadow-xl active:scale-[0.98] transition-all cursor-pointer select-none text-sm`}
        >
          <CheckSquare className="w-5 h-5 fill-slate-900" />
          <span>Finalizar Treino</span>
        </button>
      </div>

      {/* Insert exercise picker dropdown modal */}
      {isAddPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 w-full max-w-sm h-[500px] flex flex-col space-y-3 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-extrabold text-white text-sm">Adicionar ao treino atual</h3>
              <button 
                type="button" 
                onClick={() => setIsAddPickerOpen(false)}
                className="text-gray-400 hover:text-white p-1 hover:bg-slate-950 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Pesquisar exercício..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-slate-950 border border-slate-800 focus:outline-none rounded-xl py-2 px-3 text-xs text-white focus:ring-1 ${accentRing}`}
            />

            <div className="flex-1 overflow-y-auto pr-1 space-y-1 bg-slate-950/50 p-2 rounded-xl border border-slate-800/40">
              {filteredExercises.length === 0 ? (
                <p className="text-gray-500 text-xs text-center p-4">Nenhum exercício encontrado.</p>
              ) : (
                filteredExercises.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => selectExerciseToAdd(ex)}
                    className="w-full text-left bg-slate-900/60 hover:bg-slate-800/80 p-2.5 rounded-lg text-xs font-semibold text-white flex items-center justify-between transition-colors border border-transparent hover:border-slate-700/60 mb-1"
                  >
                    <span>{ex.name}</span>
                    <span className="text-[9px] font-mono uppercase bg-slate-950 px-2 py-0.5 rounded text-gray-550">
                      {ex.category}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
