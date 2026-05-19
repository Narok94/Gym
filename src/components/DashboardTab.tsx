import React from 'react';
import { Play, Flame, Calendar, Dumbbell, TrendingUp, Trophy } from 'lucide-react';
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
  // We can cycle based on some rule, but let's offer the top unused workout templates, e.g. workout-a, b, or c.
  const todayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday, 2 is Tuesday, etc.
  // Monday/Thursday -> Workout A, Tuesday/Friday -> Workout B, Wednesday/Saturday -> Workout C, Sunday -> Cardio
  let recommendedTemplate = workoutTemplates[0]; // default A
  if (todayIndex === 2 || todayIndex === 5) {
    recommendedTemplate = workoutTemplates[1]; // B
  } else if (todayIndex === 3 || todayIndex === 6) {
    recommendedTemplate = workoutTemplates[2] || workoutTemplates[0]; // C
  }

  // Weakday constancy logic
  const weekDays = [
    { key: 'seg', label: 'S', name: 'Segunda', done: true },
    { key: 'ter', label: 'T', name: 'Terça', done: true },
    { key: 'qua', label: 'Q', name: 'Quarta', done: false },
    { key: 'qui', label: 'Q', name: 'Quinta', done: true },
    { key: 'sex', label: 'S', name: 'Sexta', done: false },
    { key: 'sab', label: 'S', name: 'Sábado', done: false },
    { key: 'dom', label: 'D', name: 'Domingo', done: false }
  ];

  return (
    <div className="space-y-6 animate-fade-in px-1">
      {/* Header and Welcome */}
      <div className="flex items-center justify-between pb-2">
        <div>
          <h1 className="text-2xl font-display font-extrabold tracking-tight text-white flex items-center gap-2">
            TATU <span className="text-neon-green">GYM</span>
          </h1>
          <p className="text-gray-400 text-xs">Acompanhamento de alta performance</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-3 py-1.5">
          <Flame className="w-4 h-4 text-neon-green fill-neon-green" />
          <span className="text-sm font-bold text-white font-mono">{userProfile.streakDays} Dias</span>
        </div>
      </div>

      {/* User Greeting Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-green/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="flex items-center gap-4">
          <img 
            src={userProfile.avatarUrl} 
            alt={userProfile.name} 
            className="w-12 h-12 rounded-full object-cover border-2 border-neon-green"
            referrerPolicy="no-referrer"
          />
          <div>
            <h2 className="text-lg font-display font-bold text-white">E aí, {userProfile.name.split(' ')[0]}! 👋</h2>
            <p className="text-slate-400 text-xs">Pronto para esmagar mais um treino hoje?</p>
          </div>
        </div>

        {/* Short motivational quote */}
        <div className="mt-4 border-l-2 border-neon-green/40 pl-3 py-1 bg-slate-900/40 rounded-r-lg">
          <p className="text-xs italic text-gray-300">
            "A persistência é o caminho do êxito. Cada repetição aproxima você da sua melhor versão."
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-col items-center text-center">
          <TrendingUp className="w-5 h-5 text-neon-green mb-1" />
          <span className="text-xs text-gray-400">Peso Atual</span>
          <span className="text-sm font-bold text-white font-mono mt-0.5">{userProfile.currentWeight} kg</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-col items-center text-center">
          <Trophy className="w-5 h-5 text-neon-green mb-1" />
          <span className="text-xs text-gray-400">Realizados</span>
          <span className="text-sm font-bold text-white font-mono mt-0.5">{completedHistoryCount}</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-col items-center text-center">
          <Calendar className="w-5 h-5 text-neon-green mb-1" />
          <span className="text-xs text-gray-400">Nível</span>
          <span className="text-xs font-bold text-neon-green mt-1 px-1.5 py-0.5 bg-neon-green/10 rounded-full">
            {userProfile.level}
          </span>
        </div>
      </div>

      {/* featured Today's Workout Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-neon-green/10 rounded-xl text-neon-green">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-mono">Recomendado de Hoje</p>
              <h3 className="text-base font-display font-bold text-white">{recommendedTemplate.name}</h3>
            </div>
          </div>
        </div>

        {/* Exercises bullet preview */}
        <div className="bg-slate-950/60 border border-slate-800/40 rounded-xl p-3.5 space-y-2">
          <p className="text-xs text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
            <span>Exercícios planejados:</span>
            <span className="text-neon-green text-xs font-mono font-bold bg-neon-green/10 px-1.5 py-0.5 rounded">
              {recommendedTemplate.exercises.length} total
            </span>
          </p>
          <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
            {recommendedTemplate.exercises.map((we, idx) => (
              <div key={we.id} className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium truncate max-w-[200px]">
                  {idx + 1}. {we.exercise.name}
                </span>
                <span className="text-slate-500 font-mono text-[10px] shrink-0">
                  {we.sets.length} séries
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Start Workout Button */}
        <button
          onClick={() => onStartWorkout(recommendedTemplate.id)}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-neon-green to-lime-500 text-slate-950 font-bold font-display rounded-xl py-3 px-4 hover:shadow-[0_0_15px_rgba(163,230,53,0.3)] hover:scale-[1.01] transition-all cursor-pointer select-none text-sm"
          id="btn-start-today-workout"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>Iniciar Treino de Hoje</span>
        </button>

        {/* Routine selection if they don't want the recommended one */}
        <div className="pt-2">
          <p className="text-[10px] text-center text-gray-500 font-semibold mb-2">OU SELECIONE OUTRA ROTINA DE TREINO:</p>
          <div className="grid grid-cols-2 gap-2">
            {workoutTemplates
              .filter(w => w.id !== recommendedTemplate.id)
              .map((w) => (
                <button
                  key={w.id}
                  onClick={() => onStartWorkout(w.id)}
                  className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium py-2 px-3 rounded-lg text-left truncate transition-colors cursor-pointer"
                >
                  ⚡ {w.name.split(' - ')[1] || w.name}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Constancy Tracker (Checks of the week) */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-md">
        <h3 className="text-sm font-display font-bold text-white mb-3 flex items-center justify-between">
          <span>Constância Semanal</span>
          <span className="text-[10px] text-gray-400 font-normal">Meta: 5 treinos/semana</span>
        </h3>
        <div className="grid grid-cols-7 gap-1.5 pt-1">
          {weekDays.map((day) => (
            <div key={day.key} className="flex flex-col items-center gap-2">
              <span className="text-[10px] text-slate-400 font-medium">{day.label}</span>
              <div 
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  day.done 
                    ? 'bg-neon-green/20 border-2 border-neon-green text-neon-green font-bold shadow-[0_0_8px_rgba(163,230,53,0.1)]' 
                    : 'bg-slate-950 border border-slate-800 text-slate-600'
                }`}
              >
                {day.done ? (
                  <span className="text-[10px] font-bold font-mono">OK</span>
                ) : (
                  <span className="text-xs font-mono font-medium opacity-40">-</span>
                )}
              </div>
              <span className="text-[9px] text-slate-500 font-mono text-center truncate w-full hidden sm:block">
                {day.name}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 bg-slate-950/50 p-2.5 rounded-lg border border-slate-900">
          <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
          <p className="text-[11px] text-slate-400">
            Você treinou <strong>3 dias</strong> desta semana. Continue assim! 🔥
          </p>
        </div>
      </div>
    </div>
  );
}
