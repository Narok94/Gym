import React from 'react';
import { Flame, Dumbbell } from 'lucide-react';
import { useWorkout } from '../WorkoutContext';

export default function DashboardTab() {
  const { 
    userProfile, 
    workoutTemplates, 
    workoutHistory, 
    handleStartWorkout,
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

  // Dynamic weekly constancy logic from history
  const getWeekDays = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday...
    const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);

    const weekdayKeys = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'] as const;
    const labels = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'] as const;
    const names = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'] as const;

    return weekdayKeys.map((key, index) => {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + index);
      const dayStart = new Date(dayDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayDate);
      dayEnd.setHours(23, 59, 59, 999);

      const hasWorkout = workoutHistory.some((historyItem) => {
        const completedDate = new Date(historyItem.completedAt);
        return completedDate >= dayStart && completedDate <= dayEnd;
      });

      return {
        key,
        label: labels[index],
        name: names[index],
        done: hasWorkout
      };
    });
  };

  const weekDays = getWeekDays();
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
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-[#0c1221] border border-[#1b2c45] py-1.5 px-3 rounded-full shadow-lg flex items-center gap-1">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-white leading-none">{userProfile.streakDays || 0} Dias</span>
        </div>

        {/* Content stacked neatly */}
        <div className="relative z-10 w-full flex flex-col items-center space-y-4 pt-3">
          {/* Recommended Badge Tag */}
          <div className={`border rounded-full px-4 py-1 bg-slate-950/80 ${isFemale ? 'border-pink-500/20 text-pink-400' : 'border-blue-500/20 text-blue-400 font-extrabold'}`}>
            <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase">
              RECOMENDADO DE HOJE
            </span>
          </div>

          {/* Central Rounded Square with Glowing Dynamic Dumbbell */}
          <div className={`w-14 h-14 bg-[#0a101d] border border-[#16253c] rounded-2xl flex items-center justify-center ${isFemale ? 'text-pink-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]' : 'text-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.15)]'} shadow-xl`}>
            <Dumbbell className="w-7 h-7" />
          </div>

          {/* Workout Header Info */}
          <div className="space-y-1">
            <h2 className="text-2xl font-display font-black text-white tracking-tight">
              {recommendedTemplate.name}
            </h2>
            <p className="text-xs text-slate-300 font-sans max-w-[260px] leading-relaxed mx-auto font-medium">
              {trainingFocus} • <span className={`${isFemale ? 'text-pink-400' : 'text-blue-400 font-extrabold'} font-bold`}>{recommendedTemplate.exercises.length} Exercícios</span>
            </p>
          </div>

          {/* Large dynamic CTA Button */}
          <button
            onClick={() => handleStartWorkout(recommendedTemplate.id)}
            className={`w-full flex items-center justify-center gap-2.5 ${accentBg} ${accentBgHover} active:scale-[0.98] text-white font-display font-black text-xs py-4 px-6 rounded-2xl shadow-lg transition-all cursor-pointer select-none tracking-widest uppercase mt-2`}
            id="btn-start-today-workout"
          >
            <Dumbbell className="w-4 h-4 fill-white stroke-[2.5]" />
            <span>ESMAGAR TREINO</span>
            <span className="text-white font-sans font-bold">⚡</span>
          </button>
        </div>
      </div>

      {/* 3. Consistency Tracker Card below */}
      <div className="bg-[#0c1221]/90 border border-[#142035] rounded-[24px] p-5 shadow-lg space-y-4">
        <h3 className="text-xs font-display font-bold text-slate-300 tracking-wider uppercase text-center">
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
                    ? (isFemale ? 'bg-pink-950 border border-pink-500/20 text-pink-400 font-bold' : 'bg-blue-950 border border-blue-550 text-blue-400 font-bold') 
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
