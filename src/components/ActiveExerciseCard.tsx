import React, { useState } from 'react';
import { Trash2, Plus, Eye, Check } from 'lucide-react';
import { WorkoutExercise, ExerciseSet, Exercise } from '../types';
import ExerciseGifPlayer from './ExerciseGifPlayer';

interface ActiveExerciseCardProps {
  we: WorkoutExercise;
  exIdx: number;
  onUpdateSet: (exerciseId: string, setId: string, weight: number, reps: number, isCompleted: boolean) => void;
  onDeleteSet: (exerciseId: string, setId: string) => void;
  onAddSet: (exerciseId: string) => void;
  handleSetCheckChange: (weId: string, setId: string, weight: number, reps: number, currentlyCompleted: boolean) => void;
}

const ActiveExerciseCard: React.FC<ActiveExerciseCardProps> = ({
  we,
  exIdx,
  onUpdateSet,
  onDeleteSet,
  onAddSet,
  handleSetCheckChange
}) => {
  // Local state for gif visibility to avoid any parent latency or refresh wipes!
  const [isGifExpanded, setIsGifExpanded] = useState(false);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-4 hover:border-slate-700 transition-colors w-full overflow-hidden">
      {/* Exercise Details Header */}
      <div className="flex justify-between items-start gap-2 w-full">
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-950 border border-slate-800 text-neon-green rounded-full font-bold">
            {we.exercise.category}
          </span>
          <h3 className="text-sm font-display font-bold text-white mt-1 leading-tight break-words">
            {exIdx + 1}. {we.exercise.name}
          </h3>
          {we.exercise.description && (
            <p className="text-gray-400 text-[11px] leading-relaxed mt-1 max-w-sm break-words">
              {we.exercise.description}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsGifExpanded((prev) => !prev)}
          className={`flex items-center gap-1.5 text-[10px] font-bold py-1.5 px-3 rounded-lg transition-all whitespace-nowrap cursor-pointer shrink-0 ${
            isGifExpanded
              ? 'bg-neon-green text-slate-950 shadow-[0_0_10px_rgba(163,230,53,0.3)] font-black'
              : 'bg-slate-950 hover:bg-slate-850 border border-slate-800 text-neon-green hover:border-neon-green/45'
          }`}
          title="Ver execução em GIF"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{isGifExpanded ? 'Fechar GIF' : 'Ver GIF'}</span>
        </button>
      </div>

      {/* Show GIF / Explanation container if clicked with strict boundaries */}
      {isGifExpanded && (
        <div className="pt-1.5 animate-fade-in w-full overflow-hidden">
          <ExerciseGifPlayer exercise={we.exercise} />
        </div>
      )}

      {/* Workout Set lines table */}
      <div className="space-y-2.5 w-full overflow-hidden">
        <div className="grid grid-cols-12 gap-1.5 text-center text-slate-500 text-[10px] font-bold uppercase tracking-wider select-none px-1">
          <div className="col-span-3 text-left">Série</div>
          <div className="col-span-4">Carga (kg)</div>
          <div className="col-span-3 text-center">Reps</div>
          <div className="col-span-2 text-right pr-1">Feito</div>
        </div>

        <div className="space-y-2 w-full">
          {we.sets.map((set, set_idx) => (
            <div 
              key={set.id}
              className={`grid grid-cols-12 items-center gap-1.5 px-2 py-1.5 rounded-xl transition-all ${
                set.isCompleted 
                  ? 'bg-neon-green/5 border border-neon-green/20' 
                  : 'bg-slate-950/60 border border-slate-800/40'
              }`}
            >
              {/* Set Number & Trash helper */}
              <div className="col-span-3 flex items-center justify-between min-w-0 pr-1">
                <span className="text-xs font-mono font-extrabold text-slate-300 pl-0.5 shrink-0">
                  {set_idx + 1}
                </span>
                {we.sets.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onDeleteSet(we.id, set.id)}
                    className="text-slate-650 hover:text-red-400 transition-colors p-1 rounded hover:bg-slate-905 cursor-pointer ml-1"
                    title="Excluir série"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Weight Input */}
              <div className="col-span-4 flex items-center justify-center">
                <div className="relative w-full">
                  <input
                    type="number"
                    inputMode="decimal"
                    value={set.weight === 0 ? '' : set.weight}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      onUpdateSet(we.id, set.id, val, set.reps, set.isCompleted);
                    }}
                    placeholder="0"
                    disabled={set.isCompleted}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-neon-green rounded-lg py-1 px-1.5 text-center font-mono text-xs sm:text-sm text-white focus:outline-none transition-colors disabled:opacity-50 min-w-0"
                  />
                </div>
              </div>

              {/* Reps Input */}
              <div className="col-span-3 flex items-center justify-center">
                <div className="relative w-full">
                  <input
                    type="number"
                    inputMode="numeric"
                    value={set.reps === 0 ? '' : set.reps}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 0;
                      onUpdateSet(we.id, set.id, set.weight, val, set.isCompleted);
                    }}
                    placeholder="0"
                    disabled={set.isCompleted}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-neon-green rounded-lg py-1 px-1.5 text-center font-mono text-xs sm:text-sm text-white focus:outline-none transition-colors disabled:opacity-50 min-w-0"
                  />
                </div>
              </div>

              {/* Checkbox item */}
              <div className="col-span-2 flex items-center justify-end pr-0.5">
                <button
                  type="button"
                  onClick={() => handleSetCheckChange(we.id, set.id, set.weight, set.reps, set.isCompleted)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                    set.isCompleted
                      ? 'bg-neon-green text-slate-950 scale-110 shadow-[0_0_8px_rgba(163,230,53,0.3)]'
                      : 'bg-slate-900 border border-slate-700 text-slate-400 hover:border-neon-green/60'
                  }`}
                >
                  {set.isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-sm bg-transparent"></span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Set button */}
      <button
        type="button"
        onClick={() => onAddSet(we.id)}
        className="w-full flex items-center justify-center gap-1.5 border border-dashed border-slate-800 hover:border-neon-green/40 bg-slate-950/20 hover:bg-slate-950 text-xs font-semibold font-mono p-2 rounded-xl text-slate-400 hover:text-neon-green tracking-wide transition-all cursor-pointer select-none"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Adicionar Série</span>
      </button>
    </div>
  );
};

export default ActiveExerciseCard;
