import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Dumbbell, Clock, Plus, Trash2, Check, CheckSquare, 
  Square, RefreshCw, X, AlertTriangle, ChevronRight, Award, Info, Eye, ArrowLeft
} from 'lucide-react';
import { WorkoutSession, WorkoutExercise, ExerciseSet, Exercise } from '../types';
import { COMPREHENSIVE_EXERCISES } from '../data';
import ActiveExerciseCard from './ActiveExerciseCard';
import { useWorkout } from '../WorkoutContext';

export default function ActiveWorkoutTab() {
  const {
    activeWorkout,
    workoutTemplates,
    userProfile,
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
    accentBg
  } = useWorkout();

  // Active Workout Timer (how long the workout has been running)
  const [workoutSeconds, setWorkoutSeconds] = useState(0);
  const workoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Track if they want to cancel (confirmation state)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Exercise lookup state for adding premium exercise
  const [isAddPickerOpen, setIsAddPickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Synchronize timer based on absolute Date.now() vs activeWorkout.startTime
  const syncTimerWithStartTime = () => {
    if (activeWorkout && activeWorkout.startTime) {
      const elapsedMs = Date.now() - new Date(activeWorkout.startTime).getTime();
      setWorkoutSeconds(Math.max(0, Math.floor(elapsedMs / 1000)));
    }
  };

  // Initialize and run the main Workout timer
  useEffect(() => {
    if (activeWorkout) {
      syncTimerWithStartTime();

      workoutTimerRef.current = setInterval(() => {
        syncTimerWithStartTime();
      }, 1000);

      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          syncTimerWithStartTime();
        } else {
          // Continuous saving of activeWorkout status to guard against accidental closures
          if (activeWorkout) {
            localStorage.setItem('tatu_activeWorkout', JSON.stringify(activeWorkout));
          }
        }
      };

      window.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        if (workoutTimerRef.current) clearInterval(workoutTimerRef.current);
        window.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    } else {
      setWorkoutSeconds(0);
    }
  }, [activeWorkout]);

  // Format seconds to MM:SS
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSetCheckChange = (
    weId: string, 
    setId: string, 
    weight: number, 
    reps: number, 
    currentlyCompleted: boolean
  ) => {
    const nextCompletedState = !currentlyCompleted;
    onUpdateSet(weId, setId, weight, reps, nextCompletedState);
  };

  const handleFinish = () => {
    if (!activeWorkout) return;

    // Calculate details
    const MathDurationMinutes = Math.round(workoutSeconds / 60) || 1;
    let totalVolume = 0;
    let totalSetsNum = 0;

    activeWorkout.exercises.forEach((ex) => {
      // Save load for each exercise to historical weight history on workout finish
      const targetExerciseId = ex.exercise.id;
      const weights = ex.sets.map(s => s.weight);
      localStorage.setItem(`tatu_last_loads_ex_${targetExerciseId}`, JSON.stringify(weights));

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
    const activeTextHighlight = 'text-blue-400 font-bold';

    return (
      <div className="space-y-6 animate-fade-in px-1 text-center py-10 relative z-15">
        <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-[#0055ff] mx-auto shadow-lg mb-4">
          <Dumbbell className="w-8 h-8" />
        </div>
        <div className="space-y-2.5">
          <h2 className="text-xl font-display font-extrabold text-white">Nenhum Treino Ativo</h2>
          <p className="text-gray-400 text-xs sm:text-sm max-w-xs sm:max-w-sm mx-auto leading-relaxed">
            Nenhuma sessão de treino iniciada. Vá até à aba <span className={`${activeTextHighlight} font-bold`}>Dashboard</span> e comece o seu treino recomendado do dia! 🏋️⚡
          </p>
        </div>

        {/* Workout templates list */}
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
                <h3 className="text-sm font-display font-bold text-white group-hover:text-[#0055ff] transition-colors">
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
              <div className="shrink-0 w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 group-hover:bg-[#0055ff] group-hover:text-slate-950 flex items-center justify-center transition-all">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Retrieve dynamic profile details
  const profileName = userProfile.name || 'Atleta';
  const profileAvatar = userProfile.avatarUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=200&auto=format&fit=crop';
  const profileLevelBadge = userProfile.level === 'Avançado' ? 'Atleta Premium' : `Atleta ${userProfile.level}`;

  return (
    <div className="min-h-screen bg-white text-black -mx-4 -mt-5 -mb-8 p-4 relative z-50 flex flex-col justify-between font-sans">
      
      {/* 1. TOP DYNAMIC PROFILE BANNER */}
      <div className="bg-white border-b border-gray-100 py-3 flex items-center justify-between -mx-4 -mt-4 px-4 select-none mb-3">
        <div className="flex items-center gap-3">
          {/* Back button */}
          <button 
            type="button" 
            onClick={() => setShowCancelConfirm(true)}
            className="text-black hover:bg-gray-100 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 font-bold" />
          </button>
          
          {/* Dynamic Profile Photo */}
          <img 
            src={profileAvatar} 
            alt={profileName} 
            className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
          />
          
          {/* Dynamic Profile Name */}
          <div>
            <h3 className="text-sm font-bold text-black tracking-tight leading-none mb-0.5">{profileName}</h3>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{profileLevelBadge}</span>
          </div>
        </div>

        {/* Dynamic UTC Timer in place of clock */}
        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-150 rounded-full px-3 py-1 font-mono text-[11px] font-extrabold text-gray-700">
          <Clock className="w-3.5 h-3.5 text-[#0055ff]" />
          <span>{formatTime(workoutSeconds)}</span>
        </div>
      </div>

      {/* 1.5 DYNAMIC WORKOUT TITLE HEADER */}
      <div className="px-1.5 py-1 mb-3.5 flex items-center justify-between border-b border-gray-150 pb-2">
        <div>
          <span className="text-[10.5px] text-[#0055ff] font-extrabold uppercase tracking-widest font-mono">TREINO EM ANDAMENTO</span>
          <h2 className="text-lg font-black text-black leading-tight tracking-tight mt-0.5">
            {activeWorkout.name}
          </h2>
        </div>
        <div className="bg-blue-50 text-[#0055ff] text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-blue-100 font-mono">
          {activeWorkout.exercises.length} EXERCÍCIOS
        </div>
      </div>

      {/* Confirmation modal overlay for canceling workout */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-white border border-gray-150 rounded-2xl p-6 max-w-xs w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-sans font-extrabold text-black text-base">Descartar treino?</h3>
              <p className="text-gray-500 text-xs text-balance">Todos os dados desta sessão de treino serão limpos e perdidos permanentemente.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                className="bg-gray-100 text-gray-700 font-bold py-2 px-3 rounded-xl text-xs hover:bg-gray-200 cursor-pointer border border-gray-200"
                onClick={() => setShowCancelConfirm(false)}
              >
                Voltar
              </button>
              <button
                type="button"
                className="bg-red-600 text-white font-bold py-2 px-3 rounded-xl text-xs hover:bg-red-700 cursor-pointer shadow-md"
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

      {/* 2. CARD LIST VIEW Area - Completely dynamic, mapping to imported ActiveExerciseCard */}
      <div className="flex-1 space-y-3.5 overflow-y-auto pb-4">
        {activeWorkout.exercises.map((we, index) => (
          <ActiveExerciseCard 
            key={we.id}
            we={we}
            exIdx={index}
            onUpdateSet={onUpdateSet}
            onDeleteSet={onDeleteSet}
            onAddSet={onAddSet}
            handleSetCheckChange={handleSetCheckChange}
            getTimerRemaining={getTimerRemaining}
            onUpdateTimer={onUpdateTimer}
            isLight={true}
          />
        ))}
      </div>

      {/* 3. FOOTER ACTION BUTTONS Container */}
      <div className="space-y-4 pt-3 bg-white shrink-0 pb-2 mt-auto border-t border-gray-100">
        {/* "+ Adicionar exercício" dotted style button containing black text */}
        <button
          type="button"
          onClick={() => setIsAddPickerOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border border-black border-dashed rounded-2xl py-3.5 px-4 text-xs font-bold text-black tracking-wide transition-colors duration-150 cursor-pointer select-none"
        >
          <Plus className="w-4 h-4 text-black stroke-[2.5]" />
          <span>+ Adicionar exercício</span>
        </button>

        {/* CANCELAR & SALVAR action button grid */}
        <div className="grid grid-cols-2 gap-3.5">
          <button
            type="button"
            onClick={() => setShowCancelConfirm(true)}
            className="w-full bg-white hover:bg-gray-50 border border-black text-black font-extrabold font-sans rounded-2xl py-3.5 px-4 text-xs tracking-wider transition-all duration-150 cursor-pointer uppercase select-none text-center"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleFinish}
            className="w-full bg-[#0055ff] hover:bg-[#0044ee] text-white font-extrabold font-sans rounded-2xl py-3.5 px-4 text-xs tracking-wider transition-all duration-150 cursor-pointer shadow-lg shadow-[#0055ff]/15 uppercase select-none text-center"
          >
            Salvar
          </button>
        </div>
      </div>

      {/* Insert exercise picker dropdown modal dialog */}
      {isAddPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div className="bg-white border border-gray-150 rounded-2xl p-4 w-full max-w-sm h-[500px] flex flex-col space-y-3 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-sans font-extrabold text-black text-sm">Adicionar exercício</h3>
              <button 
                type="button" 
                onClick={() => setIsAddPickerOpen(false)}
                className="text-gray-400 hover:text-black p-1 hover:bg-gray-50 rounded"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Pesquisar exercício..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:outline-none rounded-xl py-2 px-3 text-xs text-black focus:ring-1 focus:ring-[#0055ff]"
            />

            <div className="flex-1 overflow-y-auto pr-1 space-y-1 bg-gray-50/50 p-2 rounded-xl border border-gray-100">
              {filteredExercises.length === 0 ? (
                <p className="text-gray-400 text-xs text-center p-4">Nenhum exercício encontrado.</p>
              ) : (
                filteredExercises.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => selectExerciseToAdd(ex)}
                    className="w-full text-left bg-white hover:bg-gray-50 p-2.5 rounded-lg text-xs font-bold text-black flex items-center justify-between transition-colors border border-gray-100 mb-1"
                  >
                    <span>{ex.name}</span>
                    <span className="text-[9px] font-mono uppercase bg-gray-100 px-2 py-0.5 rounded text-gray-500">
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
