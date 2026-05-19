import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Dumbbell, Clock, Plus, Trash2, Check, CheckSquare, 
  Square, RefreshCw, X, AlertTriangle, ChevronRight, Award, Info, Eye
} from 'lucide-react';
import { WorkoutSession, WorkoutExercise, ExerciseSet, Exercise } from '../types';
import { COMPREHENSIVE_EXERCISES } from '../data';
import ExerciseGifPlayer from './ExerciseGifPlayer';
import ActiveExerciseCard from './ActiveExerciseCard';

interface ActiveWorkoutTabProps {
  activeWorkout: WorkoutSession | null;
  workoutTemplates: WorkoutSession[];
  onStartWorkout: (workoutId: string) => void;
  onUpdateSet: (exerciseId: string, setId: string, weight: number, reps: number, isCompleted: boolean) => void;
  onAddSet: (exerciseId: string) => void;
  onDeleteSet: (exerciseId: string, setId: string) => void;
  onAddExercise: (exercise: Exercise) => void;
  onFinishWorkout: (durationMinutes: number, totalVolume: number, totalSets: number) => void;
  onCancelActiveWorkout: () => void;
}

export default function ActiveWorkoutTab({
  activeWorkout,
  workoutTemplates,
  onStartWorkout,
  onUpdateSet,
  onAddSet,
  onDeleteSet,
  onAddExercise,
  onFinishWorkout,
  onCancelActiveWorkout
}: ActiveWorkoutTabProps) {
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

    // If marked as COMPLETED, activate rest timer
    if (nextCompletedState) {
      setRestSeconds(60); // standard rest timer: 60 seconds
      setInitialRestDuration(60);
      setIsRestActive(true);
      setRestTimerCompleted(false);
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
    return (
      <div className="space-y-6 animate-fade-in px-1 text-center py-10">
        <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-neon-green mx-auto shadow-lg mb-4">
          <Dumbbell className="w-8 h-8" />
        </div>
        <div className="space-y-2.5">
          <h2 className="text-xl font-display font-extrabold text-white">Nenhum Treino Ativo</h2>
          <p className="text-gray-400 text-xs sm:text-sm max-w-xs sm:max-w-sm mx-auto leading-relaxed">
            Nenhuma sessão de treino iniciada. Vá até à aba <span className="text-neon-green font-bold">Dashboard</span> e comece o seu treino recomendado do dia! 🏋️⚡
          </p>
        </div>

        {/* Workout library templates list - Hidden for now as requested */}
        {/*
        <div className="space-y-3 pt-4 text-left max-w-md mx-auto">
          {workoutTemplates.map((template) => (
            <div 
              key={template.id} 
              className="bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl p-4 transition-all cursor-pointer group flex items-center justify-between"
              onClick={() => onStartWorkout(template.id)}
            >
              <div className="space-y-1 pr-4">
                <h3 className="text-sm font-display font-bold text-white group-hover:text-neon-green transition-colors">
                  {template.name}
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  {template.exercises.map(e => e.exercise.name).slice(0, 3).join(', ')} ...
                </p>
                <div className="flex gap-2 pt-1">
                  <span className="text-[10px] font-mono bg-slate-950 font-semibold px-2 py-0.5 rounded text-gray-400">
                    {template.exercises.length} Exercícios
                  </span>
                </div>
              </div>
              <div className="shrink-0 w-8 h-8 rounded-full bg-neon-green/10 text-neon-green group-hover:bg-neon-green group-hover:text-slate-950 flex items-center justify-center transition-all">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
        */}
      </div>
    );
  }

  // Calculate completed stats out of total
  const totalSets = activeWorkout.exercises.reduce((sum, e) => sum + e.sets.length, 0);
  const completedSets = activeWorkout.exercises.reduce(
    (sum, e) => sum + e.sets.filter(s => s.isCompleted).length, 0
  );

  return (
    <div className="space-y-5 animate-fade-in pb-28 px-0.5 relative">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
        <div className="flex justify-between items-start gap-3">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-neon-green font-bold">EM ANDAMENTO</span>
            <h2 className="text-base font-display font-black text-white">{activeWorkout.name}</h2>
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

        <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs">
          <div className="flex items-center gap-1.5 text-gray-300 font-mono font-medium">
            <Clock className="w-4 h-4 text-neon-green" />
            <span>Tempo:</span>
            <span className="text-white font-bold">{formatTime(workoutSeconds)}</span>
          </div>

          <div className="flex items-center gap-1 text-gray-400">
            <span>Progresso:</span>
            <strong className="text-neon-green font-mono">{completedSets}</strong>/
            <span className="font-mono">{totalSets} séries</span>
          </div>
        </div>
      </div>

      {/* Confirmation modal overlay for canceling workout */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
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
          <Plus className="w-4 h-4 text-neon-green" />
          <span>Inserir Outro Exercício no Treino</span>
        </button>

        {/* Big Complete Workout CTA */}
        <button
          type="button"
          onClick={handleFinish}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-neon-green to-lime-500 text-slate-950 font-bold font-display rounded-2xl py-3.5 px-4 shadow-xl hover:shadow-neon-green/20 hover:scale-[1.01] transition-all cursor-pointer select-none text-sm"
        >
          <CheckSquare className="w-5 h-5 fill-slate-950" />
          <span>Finalizar Treino</span>
        </button>
      </div>

      {/* Insert exercise picker dropdown modal */}
      {isAddPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
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
              placeholder="Pesquisar exercício ou grupo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-neon-green rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
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
                    <span className="text-[9px] font-mono uppercase bg-slate-950 px-2 py-0.5 rounded text-gray-500">
                      {ex.category}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Rest Timer Panel (Appears at the bottom when a set checkbox is completed) */}
      {isRestActive && (
        <div className="fixed bottom-[74px] left-1/2 transform -translate-x-1/2 w-[92%] max-w-md bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-neon-green/40 hover:border-neon-green/80 rounded-2xl p-3.5 shadow-[0_-4px_24px_rgba(163,230,53,0.15)] z-40 flex items-center justify-between gap-3 animate-bounce-short">
          <div className="flex items-center gap-3">
            {/* Visual ticking indicator ring */}
            <div className={`relative w-11 h-11 rounded-full flex items-center justify-center font-mono font-bold text-sm bg-slate-950 border ${restSeconds < 10 ? 'border-red-500 text-red-500 animate-pulse' : 'border-neon-green text-neon-green'}`}>
              <span>{restSeconds}</span>
              {/* Radial spinner animation helper */}
              <div 
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-neon-green/40 animate-spin"
                style={{ animationDuration: '3s' }}
              ></div>
            </div>
            <div>
              <p className="text-[11px] font-extrabold text-white">Descanso Ativo</p>
              <p className="text-[9px] text-gray-400 font-mono">Prepare-se para a próxima</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => addRestTime(-15)}
              className="bg-slate-900 border border-slate-800 text-gray-400 hover:text-white font-mono text-xs font-bold w-9 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer"
              title="Reduzir 15 segundos"
            >
              -15s
            </button>
            <button
              onClick={() => addRestTime(15)}
              className="bg-slate-900 border border-slate-800 text-gray-400 hover:text-white font-mono text-xs font-bold w-9 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer"
              title="Adicionar 15 segundos"
            >
              +15s
            </button>
            <button
              onClick={() => setIsRestActive(false)}
              className="bg-neon-green/20 hover:bg-neon-green hover:text-slate-950 border-2 border-neon-green/40 text-neon-green font-display font-extrabold text-[11px] px-2.5 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-sm"
            >
              Pular
            </button>
          </div>
        </div>
      )}

      {/* Modal/Banner for when Rest Timer successfully completes without skip */}
      {restTimerCompleted && (
        <div className="fixed bottom-[74px] left-1/2 transform -translate-x-1/2 w-[92%] max-w-md bg-slate-950 border-2 border-neon-green rounded-2xl p-3 shadow-[0_0_20px_rgba(163,230,53,0.3)] z-40 flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-neon-green text-slate-950 flex items-center justify-center animate-pulse">
              <Award className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Tempo de descanso concluído! 👊</p>
              <p className="text-[10px] text-neon-green font-medium">Hora de pegar pesado de novo!</p>
            </div>
          </div>
          <button
            onClick={() => setRestTimerCompleted(false)}
            className="text-gray-400 hover:text-white bg-slate-900 border border-slate-800 p-1.5 rounded-lg text-xs font-semibold cursor-pointer"
          >
            Fechar
          </button>
        </div>
      )}
    </div>
  );
}
