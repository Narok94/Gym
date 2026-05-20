import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Eye, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { WorkoutExercise, ExerciseSet, Exercise } from '../types';
import ExerciseGifPlayer from './ExerciseGifPlayer';

interface InlineActiveRestTimerProps {
  setId: string;
  onSkip: () => void;
  getTimerRemaining: (setId: string) => number;
  onUpdateTimer: (setId: string, seconds: number) => void;
}

const InlineActiveRestTimer: React.FC<InlineActiveRestTimerProps> = ({ 
  setId,
  onSkip,
  getTimerRemaining,
  onUpdateTimer
}) => {
  const [seconds, setSeconds] = useState(() => getTimerRemaining(setId));

  // Sync with background ticking or visibility changes
  useEffect(() => {
    // Read fresh state initially
    const initial = getTimerRemaining(setId);
    setSeconds(initial);

    const timer = setInterval(() => {
      const currentRemaining = getTimerRemaining(setId);
      if (currentRemaining <= 0) {
        clearInterval(timer);
        setSeconds(0);
        onSkip(); // auto dismiss when timer hits 0
        return;
      }
      const nextSecs = currentRemaining - 1;
      onUpdateTimer(setId, nextSecs);
      setSeconds(nextSecs);
    }, 1000);

    return () => clearInterval(timer);
  }, [setId]);

  // Handle visibility changes directly as a safety listener
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        setSeconds(getTimerRemaining(setId));
      }
    };
    window.addEventListener('visibilitychange', handleVisibility);
    return () => window.removeEventListener('visibilitychange', handleVisibility);
  }, [setId]);

  const adjustTime = (e: React.MouseEvent, amount: number) => {
    e.stopPropagation();
    const currentRemaining = getTimerRemaining(setId);
    const updated = Math.max(0, currentRemaining + amount);
    onUpdateTimer(setId, updated);
    setSeconds(updated);
  };

  const handleSkipClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSkip();
  };

  return (
    <div className="bg-[#101b2f] border border-[#1d3251] rounded-2xl p-4 my-2.5 flex items-center justify-between gap-3 animate-fade-in shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-default" onClick={e => e.stopPropagation()}>
      <div className="flex items-center gap-3">
        {/* Circular Countdown clock displaying current seconds */}
        <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-[#18263f] border-2 border-neon-green/70 shadow-[0_0_12px_rgba(163,230,53,0.3)] select-none shrink-0" key={seconds}>
          <span className="text-sm font-mono font-black text-neon-green animate-pulse">{seconds}</span>
        </div>
        <div className="text-left">
          <span className="text-[10px] font-mono font-black text-neon-green uppercase tracking-widest block font-extrabold">DESCANSO ATIVO</span>
          <span className="text-xs font-display font-medium text-slate-355">Prepare-se para a próxima</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button 
          type="button"
          onClick={(e) => adjustTime(e, -15)}
          className="bg-[#18273f] hover:bg-[#1f3150] border border-[#233554] text-slate-300 text-[10px] font-mono font-black py-2 px-2.5 rounded-xl cursor-pointer transition-all active:scale-95"
        >
          -15s
        </button>
        <button 
          type="button"
          onClick={(e) => adjustTime(e, 15)}
          className="bg-[#18273f] hover:bg-[#1f3150] border border-[#233554] text-slate-300 text-[10px] font-mono font-black py-2 px-2.5 rounded-xl cursor-pointer transition-all active:scale-95"
        >
          +15s
        </button>
        <button 
          type="button"
          onClick={handleSkipClick}
          className="bg-neon-green hover:bg-lime-400 text-slate-950 text-[10px] font-display font-black py-2 px-3 rounded-xl cursor-pointer transition-all active:scale-95 shadow-[0_0_10px_rgba(163,230,53,0.3)]"
        >
          Pular
        </button>
      </div>
    </div>
  );
};

interface ActiveExerciseCardProps {
  we: WorkoutExercise;
  exIdx: number;
  onUpdateSet: (exerciseId: string, setId: string, weight: number, reps: number, isCompleted: boolean) => void;
  onDeleteSet: (exerciseId: string, setId: string) => void;
  onAddSet: (exerciseId: string) => void;
  handleSetCheckChange: (weId: string, setId: string, weight: number, reps: number, currentlyCompleted: boolean) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  getTimerRemaining: (setId: string) => number;
  onUpdateTimer: (setId: string, seconds: number) => void;
}

const ActiveExerciseCard: React.FC<ActiveExerciseCardProps> = ({
  we,
  exIdx,
  onUpdateSet,
  onDeleteSet,
  onAddSet,
  handleSetCheckChange,
  isExpanded = true,
  onToggleExpand,
  getTimerRemaining,
  onUpdateTimer
}) => {
  // Local state for gif visibility to avoid any parent latency or refresh wipes!
  const [isGifExpanded, setIsGifExpanded] = useState(false);
  const [dismissedRestIds, setDismissedRestIds] = useState<string[]>([]);

  if (!isExpanded) {
    return (
      <div 
        className="bg-[#0b121f] border border-[#142238]/60 rounded-2xl p-4 flex items-center justify-between transition-all select-none"
      >
        <div className="flex-1 min-w-0 pr-3">
          <span className="text-base font-display font-black text-slate-300">
            {exIdx + 1}. {we.exercise.name}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[9px] uppercase font-mono px-2 py-0.5 bg-slate-950/60 border border-[#142238]/60 text-slate-450 rounded-md font-bold">
            {we.exercise.category}
          </span>
          <span className="text-[10px] font-mono bg-slate-950 px-2.5 py-1 rounded text-gray-400 font-bold">
            {we.sets.length} {we.sets.length === 1 ? 'série' : 'séries'}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleExpand) onToggleExpand();
            }}
            className="w-11 h-11 rounded-full bg-[#182337] border border-[#23334e] hover:border-slate-700 hover:text-white text-slate-300 flex items-center justify-center transition-all cursor-pointer select-none active:scale-[0.88]"
            title="Saber Mais"
          >
            <ChevronDown className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-[#0b121f] border border-[#142238] rounded-2xl p-5 shadow-sm space-y-4 hover:border-slate-800 transition-colors w-full overflow-hidden select-none"
    >
      {/* Exercise Details Header */}
      <div className="flex justify-between items-start gap-2 w-full border-b border-slate-900/60 pb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-slate-950/60 border border-slate-800 text-neon-green font-extrabold rounded-md">
              {we.exercise.category}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsGifExpanded((prev) => !prev);
              }}
              className={`flex items-center gap-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                isGifExpanded
                  ? 'bg-neon-green text-slate-950 font-extrabold'
                  : 'text-slate-500 hover:text-neon-green'
              }`}
              title="Ver execução (GIF)"
            >
              <Eye className="w-3 h-3" />
              <span>{isGifExpanded ? 'FECHAR' : 'GIF'}</span>
            </button>
          </div>
          <div className="flex items-center gap-2 justify-between w-full mt-2">
            <h3 className="text-xl font-display font-black text-white leading-tight break-words">
              {exIdx + 1}. {we.exercise.name}
            </h3>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleExpand) onToggleExpand();
              }}
              className="w-11 h-11 rounded-full bg-[#182337] border border-[#23334e] hover:border-slate-700 hover:text-white text-slate-300 flex items-center justify-center transition-all cursor-pointer grow-0 shrink-0 shadow-sm active:scale-90"
              title="Minimizar Exercício"
            >
              <ChevronUp className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>
          {we.exercise.description && (
            <p className="text-gray-400 text-xs leading-relaxed mt-1 max-w-sm break-words">
              {we.exercise.description}
            </p>
          )}
        </div>
      </div>

      {/* Show GIF / Explanation container if clicked with strict boundaries */}
      {isGifExpanded && (
        <div className="pt-1 animate-fade-in w-full overflow-hidden">
          <ExerciseGifPlayer exercise={we.exercise} />
        </div>
      )}

      {/* Workout Set lines table - Fluid Layout with scaled-up headers and interactive design */}
      <div className="space-y-2.5 w-full overflow-hidden">
        {/* Scaled up column headers */}
        <div className="grid grid-cols-12 gap-2 text-slate-400 text-xs font-black uppercase tracking-widest font-mono select-none px-2 mb-1.5 border-b border-[#142238]/40 pb-2">
          <div className="col-span-2 text-left pl-1">SÉRIE</div>
          <div className="col-span-4 text-center">CARGA (KG)</div>
          <div className="col-span-3 text-center">REPETIÇÕES</div>
          <div className="col-span-2 text-center">STATUS</div>
          <div className="col-span-1"></div>
        </div>

        <div className="space-y-2 w-full">
          {we.sets.map((set, set_idx) => {
            // Interactive local state for this indices rest timer.
            // Show inline rest timer below any completed set, as long as the next set in list is not yet completed.
            const isNextSetPending = (set_idx < we.sets.length - 1) && !we.sets[set_idx + 1].isCompleted;
            const isRestTimerShown = set.isCompleted && isNextSetPending;
            
            return (
              <React.Fragment key={set.id}>
                <div 
                  className={`grid grid-cols-12 items-center gap-2 px-2 py-2 rounded-2xl transition-all relative group ${
                    set.isCompleted 
                      ? 'bg-neon-green/5 border border-neon-green/10' 
                      : 'bg-transparent'
                  }`}
                >
                  {/* Set Number */}
                  <div className="col-span-2 flex items-center pl-1">
                    <span className={`text-sm font-mono font-black ${set.isCompleted ? 'text-neon-green font-extrabold' : 'text-slate-400'}`}>
                      {set_idx + 1}
                    </span>
                  </div>

                  {/* Weight Input (Sleek pill-shaped gray capsule with centered white text) */}
                  <div className="col-span-4 px-0.5">
                    <input
                      type="number"
                      inputMode="decimal"
                      value={set.weight === 0 ? '' : set.weight}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        onUpdateSet(we.id, set.id, val, set.reps, set.isCompleted);
                      }}
                      placeholder="—"
                      disabled={set.isCompleted}
                      className={`w-full bg-[#182337] border border-[#23334e]/50 text-center font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-neon-green/40 font-extrabold rounded-full py-2 transition-all ${
                        set.isCompleted 
                          ? 'opacity-65 bg-[#121c2c]/85 text-[#94a3b8]' 
                          : 'hover:border-slate-700'
                      }`}
                    />
                  </div>

                  {/* Reps Input (Sleek pill-shaped gray capsule with centered white text) */}
                  <div className="col-span-3 px-0.5">
                    <input
                      type="number"
                      inputMode="numeric"
                      value={set.reps === 0 ? '' : set.reps}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10) || 0;
                        onUpdateSet(we.id, set.id, set.weight, val, set.isCompleted);
                      }}
                      placeholder="—"
                      disabled={set.isCompleted}
                      className={`w-full bg-[#182337] border border-[#23334e]/50 text-center font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-neon-green/40 font-extrabold rounded-full py-2 transition-all ${
                        set.isCompleted 
                          ? 'opacity-65 bg-[#121c2c]/85 text-[#94a3b8]' 
                          : 'hover:border-slate-700'
                      }`}
                    />
                  </div>

                  {/* Checkbox item - Square with rounded corners, glowing neon-green with dark checkmark only when 'Feito' */}
                  <div className="col-span-2 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleSetCheckChange(we.id, set.id, set.weight, set.reps, set.isCompleted)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                        set.isCompleted
                          ? 'bg-neon-green text-slate-950 scale-[1.08] shadow-[0_0_12px_rgba(163,230,53,0.45)] border border-neon-green'
                          : 'bg-[#0d1527] border border-slate-800 text-slate-600 hover:border-neon-green/60'
                      }`}
                    >
                      {set.isCompleted ? (
                        <Check className="w-4 h-4 stroke-[3.5] text-slate-950" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded bg-transparent"></span>
                      )}
                    </button>
                  </div>

                  {/* Delete button (invisible by default, only showing on hover) */}
                  <div className="col-span-1 flex items-center justify-end pr-1">
                    {we.sets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onDeleteSet(we.id, set.id)}
                        className="text-slate-600 hover:text-red-500 p-1 rounded cursor-pointer transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Remover série"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline Rest Timer */}
                {isRestTimerShown && !dismissedRestIds.includes(set.id) && (
                  <InlineActiveRestTimer 
                    setId={set.id}
                    onSkip={() => setDismissedRestIds((prev) => [...prev, set.id])}
                    getTimerRemaining={getTimerRemaining}
                    onUpdateTimer={onUpdateTimer}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Add Set button - clean low opacity neon-green text shortcut */}
      <button
        type="button"
        onClick={() => onAddSet(we.id)}
        className="w-full flex items-center justify-center gap-1 py-2 bg-transparent text-[11px] font-black font-mono text-neon-green/60 hover:text-neon-green tracking-widest transition-all cursor-pointer select-none"
      >
        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>+ ADICIONAR SÉRIE</span>
      </button>
    </div>
  );
};

export default ActiveExerciseCard;
