import React from 'react';
import { Flame, Dumbbell, Zap } from 'lucide-react';
import { WorkoutSession, UserProfile } from '../types';

interface DashboardTabProps {
  userProfile: UserProfile;
  workoutTemplates: WorkoutSession[];
  onStartWorkout: (workoutId: string) => void;
  completedHistoryCount: number;
}

export default function DashboardTab({
  userProfile,
  workoutTemplates,
  onStartWorkout,
  completedHistoryCount
}: DashboardTabProps) {
  // Determine suggested workout of the day.
  const todayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday, etc.
  // Monday/Thursday -> Workout A, Tuesday/Friday -> Workout B, Wednesday/Saturday -> Workout C, Sunday -> Cardio
  let recommendedTemplate = workoutTemplates[0]; // default A
  if (todayIndex === 2 || todayIndex === 5) {
    recommendedTemplate = workoutTemplates[1]; // B
  } else if (todayIndex === 3 || todayIndex === 6) {
    recommendedTemplate = workoutTemplates[2] || workoutTemplates[0]; // C
  }

  // Focus helper string for subtitle
  let trainingFocus = '';
  if (recommendedTemplate.id === 'workout-a') {
    trainingFocus = 'Foco em Peito, Tríceps e Ombros';
  } else if (recommendedTemplate.id === 'workout-b') {
    trainingFocus = 'Foco em Costas, Bíceps e Abdômen';
  } else if (recommendedTemplate.id === 'workout-c') {
    trainingFocus = 'Foco em Pernas e Panturrilhas';
  } else {
    trainingFocus = 'Foco em Alta Performance';
  }

  // Weekday constancy logic
  const weekDays = [
    { key: 'seg', label: 'S', name: 'Segunda', done: true },
    { key: 'ter', label: 'T', name: 'Terça', done: true },
    { key: 'qua', label: 'Q', name: 'Quarta', done: false },
    { key: 'qui', label: 'Q', name: 'Quinta', done: true },
    { key: 'sex', label: 'S', name: 'Sexta', done: false },
    { key: 'sab', label: 'S', name: 'Sábado', done: false },
    { key: 'dom', label: 'D', name: 'Domingo', done: false }
  ];

  const firstName = userProfile.name ? userProfile.name.split(' ')[0] : 'Atleta';

  return (
    <div className="space-y-5 animate-fade-in px-1">
      {/* 1. Header (Greeting and streak on a single elegant line) */}
      <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800/60 rounded-xl px-4 py-3 shadow-sm">
        <span className="text-sm font-bold text-white flex items-center gap-1.5">
          Olá, {firstName}! 👋
        </span>
        <div className="flex items-center gap-1.5 bg-neon-green/10 border border-neon-green/35 rounded-lg px-2.5 py-1">
          <Flame className="w-4 h-4 text-neon-green fill-neon-green animate-pulse" />
          <span className="text-xs font-bold text-white font-mono">{userProfile.streakDays} Dias Seguidos</span>
        </div>
      </div>

      {/* 2. Central Hero Card: Today's Workout Recommended Selector */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col space-y-5">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-neon-green/10 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-lime-500/5 rounded-full blur-2xl -ml-6 -mb-6 pointer-events-none"></div>

        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-neon-green">
              Treino de Hoje
            </p>
            <h3 className="text-xl font-display font-extrabold text-white leading-tight">
              {recommendedTemplate.name}
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              {trainingFocus} • {recommendedTemplate.exercises.length} Exercícios
            </p>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-850 text-neon-green">
            <Dumbbell className="w-5 h-5" />
          </div>
        </div>

        {/* Big Neon Action Key */}
        <button
          onClick={() => onStartWorkout(recommendedTemplate.id)}
          className="w-full flex items-center justify-center gap-2 bg-neon-green hover:bg-lime-400 active:scale-[0.99] text-slate-950 font-display font-extrabold text-sm py-4 rounded-xl shadow-[0_4px_20px_rgba(163,230,53,0.15)] hover:shadow-[0_4px_25px_rgba(163,230,53,0.3)] transition-all cursor-pointer select-none tracking-wider uppercase"
          id="btn-start-today-workout"
        >
          <Zap className="w-4 h-4 fill-slate-950 stroke-[2.5]" />
          <span>Esmagar Treino ⚡</span>
        </button>
      </div>

      {/* 3. Consistency Tracker (A compact visual tracker of the week) */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-4 shadow-sm space-y-3">
        <h3 className="text-xs font-display font-bold text-slate-400 flex items-center justify-between">
          <span>Constância Semanal</span>
          <span className="text-[9px] text-slate-500 font-mono">Meta: 5 treinos/semana</span>
        </h3>
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div key={day.key} className="flex flex-col items-center gap-1.5">
              <span className="text-[9px] text-slate-500 font-medium">{day.label}</span>
              <div 
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  day.done 
                    ? 'bg-neon-green/15 border border-neon-green/45 text-neon-green font-bold shadow-[0_0_8px_rgba(163,230,53,0.08)]' 
                    : 'bg-slate-950 border border-slate-900 text-slate-600'
                }`}
              >
                {day.done ? (
                  <span className="text-[9px] font-bold font-mono">OK</span>
                ) : (
                  <span className="text-[10px] font-mono font-medium opacity-40">-</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
