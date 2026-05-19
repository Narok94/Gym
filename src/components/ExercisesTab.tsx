import React, { useState } from 'react';
import { Search, Dumbbell, Play, Info, Award, PlusCircle, Check } from 'lucide-react';
import { Exercise, MuscleGroup, WorkoutSession } from '../types';
import { COMPREHENSIVE_EXERCISES } from '../data';
import ExerciseGifPlayer from './ExerciseGifPlayer';

interface ExercisesTabProps {
  activeWorkout: WorkoutSession | null;
  onAddExerciseToActive: (exercise: Exercise) => void;
}

export default function ExercisesTab({
  activeWorkout,
  onAddExerciseToActive
}: ExercisesTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'Todos'>('Todos');
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // List of available categories
  const categories: (MuscleGroup | 'Todos')[] = [
    'Todos', 'Peito', 'Costas', 'Pernas', 'Ombros', 'Braços', 'Abdômen', 'Cardio'
  ];

  // Filters logic
  const filteredExercises = COMPREHENSIVE_EXERCISES.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (ex.description && ex.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesMuscle = selectedMuscle === 'Todos' || ex.category === selectedMuscle;
    return matchesSearch && matchesMuscle;
  });

  const handleToggleExpand = (id: string) => {
    setExpandedExerciseId((prev) => (prev === id ? null : id));
  };

  // Trigger quick add with feedback
  const handleQuickAdd = (ex: Exercise) => {
    onAddExerciseToActive(ex);
    setJustAddedId(ex.id);
    setTimeout(() => {
      setJustAddedId(null);
    }, 1500);
  };

  return (
    <div className="space-y-4 animate-fade-in px-1 pb-16">
      {/* Title */}
      <div>
        <h2 className="text-xl font-display font-extrabold text-white">Biblioteca de Exercícios</h2>
        <p className="text-gray-400 text-xs">Examine execuções e adicione movimentos rápidos à sua planilha.</p>
      </div>

      {/* Styled Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Pesquise por Rosca, Supino, Agachamento..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm rounded-xl py-3 pl-10 pr-4 outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green transition-all"
        />
        {searchQuery && (
          <button 
            type="button" 
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white text-xs bg-slate-800 px-2 py-0.5 rounded"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Horizontal Filter Chips Carousel */}
      <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none -mx-4 px-4 mask-right">
        {categories.map((muscle) => {
          const isActive = selectedMuscle === muscle;
          return (
            <button
              key={muscle}
              onClick={() => setSelectedMuscle(muscle)}
              className={`px-4 py-2 text-xs font-semibold rounded-full shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-neon-green text-slate-950 px-5 shadow-[0_0_12px_rgba(163,230,53,0.25)] font-bold'
                  : 'bg-slate-900/80 hover:bg-slate-850 text-gray-400 border border-slate-850 hover:text-white'
              }`}
            >
              {muscle}
            </button>
          );
        })}
      </div>

      {/* Exercises List items */}
      <div className="space-y-2.5">
        {filteredExercises.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-8 text-center text-gray-500">
            <span className="text-sm block">Nenhum exercício encontrado.</span>
            <span className="text-xs text-gray-600">Tente ajustar seus termos de pesquisa para outro filtro muscular.</span>
          </div>
        ) : (
          filteredExercises.map((ex) => {
            const isExpanded = expandedExerciseId === ex.id;
            const isAddedFeedback = justAddedId === ex.id;

            return (
              <div 
                key={ex.id}
                className={`bg-slate-900 border transition-all rounded-xl overflow-hidden ${
                  isExpanded 
                    ? 'border-slate-700 bg-slate-850/80 shadow-md' 
                    : 'border-slate-800/80 hover:border-slate-800/60'
                }`}
              >
                {/* Header click triggers collapse toggle */}
                <div 
                  className="p-3 px-4 flex items-center justify-between gap-3 cursor-pointer select-none"
                  onClick={() => handleToggleExpand(ex.id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-neon-green/80">
                      <Dumbbell className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white font-sans truncate">{ex.name}</h4>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-semibold">{ex.category}</span>
                    </div>
                  </div>

                  {/* Right Controls */}
                  <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {activeWorkout && (
                      <button
                        type="button"
                        onClick={() => handleQuickAdd(ex)}
                        className={`text-[11px] font-bold py-1 px-2.5 rounded-lg flex items-center gap-1 transition-all ${
                          isAddedFeedback 
                            ? 'bg-neon-green text-slate-950 animate-pulse' 
                            : 'bg-slate-950 hover:bg-slate-850 border border-slate-800 text-neon-green hover:border-neon-green/45'
                        }`}
                        title="Adicionar ao treino atual"
                      >
                        {isAddedFeedback ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Adicionado!</span>
                          </>
                        ) : (
                          <>
                            <PlusCircle className="w-3.5 h-3.5 text-neon-green" />
                            <span>Adicionar</span>
                          </>
                        )}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleToggleExpand(ex.id)}
                      className={`text-slate-500 hover:text-white p-1 rounded-full transition-transform ${isExpanded ? 'rotate-180 text-neon-green' : ''}`}
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-800/40 bg-slate-950/40 text-xs text-gray-300 space-y-3">
                    {ex.description ? (
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-wider font-mono text-slate-500">Instruções de Execução</span>
                        <p className="leading-relaxed text-slate-300">{ex.description}</p>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">Nenhum detalhe adicional cadastrado para este exercício.</p>
                    )}

                    {/* Explanatory Simulated GIF Player */}
                    <ExerciseGifPlayer exercise={ex} />

                    {/* Quick Info Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="px-2 py-0.5 bg-slate-900 border border-slate-850 rounded text-[10px] text-slate-400">
                        Equipamento: Padrão Academia
                      </span>
                      <span className="px-2 py-0.5 bg-slate-900 border border-slate-850 rounded text-[10px] text-slate-400">
                        Foco: {ex.category}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-900 border border-slate-850 rounded text-[10px] text-slate-400">
                        Nível: Todos os níveis
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
