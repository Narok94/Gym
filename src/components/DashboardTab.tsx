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
    trainingFocus = 'Foco em Performance Total';
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
    <div className="space-y-6 animate-fade-in px-1 max-w-sm mx-auto flex flex-col justify-center pt-8 pb-4">
      {/* 1. Header (Centered pure greeting, elegant and direct) */}
      <div className="text-center py-2">
        <h1 className="text-3xl font-display font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
          Olá, {firstName}! <span className="animate-bounce">👋</span>
        </h1>
      </div>

      {/* 2. Central Hero Card: Recommended Workout of Today */}
      <div className="relative bg-[#0d1527] border border-[#1b2c45] rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.6)] flex flex-col items-center text-center overflow-hidden">
        {/* Desaturated black and white photo background texture */}
        <div className="absolute inset-0 w-full h-full select-none pointer-events-none z-0">
          <img 
            src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600&auto=format&fit=crop" 
            alt="Gym Raw Background" 
            className="w-full h-full object-cover opacity-45 grayscale brightness-[0.45]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0d1527]/70 to-[#0d1527]/95"></div>
        </div>

        {/* Overlapping Streak Flame badge at the top edge */}
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-[#0d1527] border border-[#1b2c45] p-3 rounded-full shadow-lg">
          <Flame className="w-5 h-5 text-neon-green fill-neon-green" />
        </div>

        {/* Content stacked neatly */}
        <div className="relative z-10 w-full flex flex-col items-center space-y-4 pt-3">
          {/* Recommended Badge Tag */}
          <div className="bg-[#14261f] border border-[#204938] rounded-full px-4 py-1">
            <span className="text-[10px] font-mono tracking-wider text-neon-green font-black">
              RECOMENDADO DE HOJE
            </span>
          </div>

          {/* Central Rounded Square with Glowing Green Dumbbell */}
          <div className="w-14 h-14 bg-[#0a101d] border border-[#16253c] rounded-2xl flex items-center justify-center text-neon-green shadow-xl">
            <Dumbbell className="w-7 h-7" />
          </div>

          {/* Workout Header Info */}
          <div className="space-y-1">
            <h2 className="text-2xl font-display font-black text-white tracking-tight">
              {recommendedTemplate.name}
            </h2>
            <p className="text-xs text-slate-300 font-sans max-w-[260px] leading-relaxed mx-auto font-medium">
              {trainingFocus} • <span className="text-neon-green font-bold">{recommendedTemplate.exercises.length} Exercícios</span>
            </p>
          </div>

          {/* Large Neon Green Button */}
          <button
            onClick={() => onStartWorkout(recommendedTemplate.id)}
            className="w-full flex items-center justify-center gap-2.5 bg-neon-green hover:bg-lime-400 active:scale-[0.98] text-slate-950 font-display font-black text-xs py-4 px-6 rounded-2xl shadow-[0_4px_25px_rgba(163,230,53,0.35)] transition-all cursor-pointer select-none tracking-widest uppercase mt-2"
            id="btn-start-today-workout"
          >
            <Dumbbell className="w-4 h-4 fill-slate-950 stroke-[2.5]" />
            <span>ESMAGAR TREINO</span>
            <span className="text-slate-950 font-sans font-bold">⚡</span>
          </button>
        </div>
      </div>

      {/* 3. Consistency Tracker Card below */}
      <div className="bg-[#0c1221]/90 border border-[#142035] rounded-[24px] p-5 shadow-lg space-y-4">
        <h3 className="text-xs font-display font-black text-slate-350 tracking-wider uppercase text-center">
          Constância Semanal
        </h3>
        
        {/* Grid matching the gorgeous image exactly */}
        <div className="grid grid-cols-7 gap-1 px-1">
          {weekDays.map((day) => (
            <div key={day.key} className="flex flex-col items-center gap-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">{day.label}</span>
              <div 
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  day.done 
                    ? 'bg-[#1b2f21] border border-[#305e3a] text-neon-green' 
                    : 'bg-[#080d19]/40 border border-[#1c2e4a] text-slate-600'
                }`}
              >
                <Dumbbell className={`w-4 h-4 ${day.done ? 'stroke-[2.5]' : 'opacity-30'}`} />
              </div>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-slate-450 font-mono text-center font-bold">
          Meta: 5 treinos/semana
        </p>
      </div>
    </div>
  );
}
