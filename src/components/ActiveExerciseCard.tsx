import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Eye, ChevronDown, ChevronUp, Check, Scale, Flame, Dumbbell } from 'lucide-react';
import { WorkoutExercise } from '../types';
import { useWorkout } from '../WorkoutContext';
import ExerciseGifPlayer from './ExerciseGifPlayer';

// Synthesize a beautiful, polite upward electronic chime using the Web Audio API
const playCompletionSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    const playTone = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0.08, startTime); // Subtle volume
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration); // Smooth decay
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    playTone(587.33, now, 0.12);       // D5 (Tone 1)
    playTone(783.99, now + 0.09, 0.22);  // G5 (Tone 2 - bright, triumphant chimes)
  } catch (error) {
    console.error('Failed to trigger audio feedback chimes:', error);
  }
};

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
  const { isFemale } = useWorkout();
  const [seconds, setSeconds] = useState(() => getTimerRemaining(setId));

  // Sync with background ticking or visibility changes
  useEffect(() => {
    const initial = getTimerRemaining(setId);
    setSeconds(initial);

    const timer = setInterval(() => {
      const currentRemaining = getTimerRemaining(setId);
      if (currentRemaining <= 0) {
        clearInterval(timer);
        setSeconds(0);
        playCompletionSound(); // Play chime when countdown reaches 0!
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
    playCompletionSound(); // Play chime when manual skip click feedback triggers!
    onSkip();
  };

  // Theme-aware local properties
  const timerCircleBorder = isFemale ? 'border-pink-500/75 shadow-[0_0_12px_rgba(244,63,94,0.3)]' : 'border-blue-500/80 shadow-[0_0_12px_rgba(59,130,246,0.3)]';
  const timerTextColor = isFemale ? 'text-pink-400' : 'text-blue-400 font-extrabold';
  const timerTitleClass = isFemale ? 'text-pink-400' : 'text-blue-400 font-black';
  const skipButtonBg = isFemale ? 'bg-pink-650 hover:bg-pink-550 shadow-pink-900/30' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/30';

  return (
    <div className="bg-[#101b2f] border border-[#1d3251] rounded-2xl p-4 my-2.5 flex items-center justify-between gap-3 animate-fade-in shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-default" onClick={e => e.stopPropagation()}>
      <div className="flex items-center gap-3">
        {/* Circular Countdown clock displaying current seconds */}
        <div className={`relative w-12 h-12 flex items-center justify-center rounded-full bg-[#18263f] border-2 ${timerCircleBorder} select-none shrink-0`} key={seconds}>
          <span className={`text-sm font-mono font-black ${timerTextColor} animate-pulse`}>{seconds}</span>
        </div>
        <div className="text-left">
          <span className={`text-[10px] font-mono tracking-widest ${timerTitleClass} block uppercase`}>DESCANSO ATIVO</span>
          <span className="text-xs font-display font-medium text-slate-300">Respire, concentre e prepare-se!</span>
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
          className={`${skipButtonBg} text-white text-[10px] font-display font-black py-2.5 px-3 rounded-xl cursor-pointer transition-all active:scale-95 shadow-md`}
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
  getTimerRemaining,
  onUpdateTimer
}) => {
  const {
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

  // Local accordion state for render optimization
  const [isOpen, setIsOpen] = useState(() => {
    // Starts true if first exercise of the routine OR if there are partially completed sets but some incomplete sets
    const hasCompleted = we.sets.some(s => s.isCompleted);
    const hasIncomplete = we.sets.some(s => !s.isCompleted);
    const isCurrentActive = hasCompleted && hasIncomplete;
    return exIdx === 0 || isCurrentActive;
  });

  // Local state for gif visibility to avoid any parent latency or refresh wipes!
  const [isGifExpanded, setIsGifExpanded] = useState(false);
  const [dismissedRestIds, setDismissedRestIds] = useState<string[]>([]);

  // Calculate if ALL sets of this exercise are finished
  const allSetsDone = we.sets.length > 0 && we.sets.every(s => s.isCompleted);
  // Calculate if SOME but not all sets are finished
  const partiallyDone = we.sets.some(s => s.isCompleted) && !allSetsDone;

  // Closed View - Single large clickable clean tactical button
  if (!isOpen) {
    return (
      <div 
        onClick={() => setIsOpen(true)}
        className="bg-[#0b121f] border border-[#142238]/65 hover:border-slate-800 rounded-3xl p-4.5 flex items-center justify-between transition-all select-none cursor-pointer group active:scale-[0.99] duration-150 shadow-md relative overflow-hidden"
      >
        <div className="flex items-center gap-3.5 min-w-0 pr-3">
          {/* Gem-like indicator reflecting status */}
          <div className="relative shrink-0 flex items-center justify-center">
            {allSetsDone ? (
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgb(16,185,129)] border border-emerald-450 z-10"></span>
            ) : partiallyDone ? (
              <span className={`w-3.5 h-3.5 rounded-full ${isFemale ? 'bg-pink-500 shadow-[0_0_10px_rgba(244,63,94,0.7)]' : 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.7)]'} animate-pulse border border-slate-700 z-10`}></span>
            ) : (
              <span className="w-3.5 h-3.5 rounded-full bg-slate-700 border border-slate-800 z-10"></span>
            )}
            {partiallyDone && (
              <span className={`absolute w-5 h-5 rounded-full ${isFemale ? 'bg-pink-500/20' : 'bg-blue-400/20'} animate-ping -z-10`}></span>
            )}
          </div>

          <div className="min-w-0">
            <span className={`text-base font-display font-black text-slate-200 group-hover:${isFemale ? 'text-pink-400' : 'text-blue-400'} transition-colors block leading-snug`}>
              {exIdx + 1}. {we.exercise.name}
            </span>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black block mt-0.5">
              {we.exercise.category}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-[10px] font-mono bg-slate-950/80 border border-slate-900/60 px-2.5 py-1 rounded-xl text-gray-400 font-extrabold shadow-inner">
            {we.sets.filter(s => s.isCompleted).length}/{we.sets.length} séries
          </span>
          <div
            className="w-10 h-10 rounded-full bg-[#182337] border border-[#23334e] group-hover:border-slate-700 text-slate-300 flex items-center justify-center transition-all shadow-sm group-hover:bg-[#1a2b4b]"
            title="Expandir Exercício"
          >
            <ChevronDown className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>
      </div>
    );
  }

  // Open View - Entire top Area is still a collapsible trigger
  return (
    <div 
      className="bg-[#0b121f] border border-[#1d2d44]/70 rounded-3xl p-5 shadow-lg space-y-4 transition-all w-full overflow-hidden select-none animate-fade-in relative"
    >
      {/* Dynamic ambient highlight glow in background if active */}
      {partiallyDone && (
        <div className={`absolute top-0 right-0 w-32 h-32 ${isFemale ? 'bg-pink-500/3' : 'bg-blue-500/3'} rounded-full filter blur-2xl pointer-events-none`}></div>
      )}

      {/* Exercise Details Header - Clickable upper container to collapse */}
      <div 
        onClick={() => setIsOpen(false)}
        className="flex justify-between items-start gap-3 w-full border-b border-slate-900 pb-3.5 cursor-pointer group select-none active:opacity-95"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Category tag */}
            <span className={`text-[9px] uppercase font-mono px-2.5 py-0.5 bg-slate-950/80 border border-slate-900 ${isFemale ? 'text-pink-400' : 'text-blue-400'} font-extrabold rounded-lg`}>
              {we.exercise.category}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // Stop propagation to avoid collapsing the card
                setIsGifExpanded((prev) => !prev);
              }}
              className={`flex items-center gap-1 text-[9px] font-mono font-black px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                isGifExpanded
                  ? (isFemale ? 'bg-pink-500 text-white font-extrabold' : 'bg-blue-600 text-white font-extrabold')
                  : 'bg-slate-950/40 text-slate-500 border border-slate-900 hover:text-white'
              }`}
              title="Ver execução (GIF)"
            >
              <Eye className="w-3" />
              <span>{isGifExpanded ? 'FECHAR' : 'VER GIF'}</span>
            </button>
          </div>
          
          <div className="flex items-center gap-2 justify-between w-full mt-2.5">
            <h3 className={`text-lg font-display font-black text-white leading-tight break-words group-hover:${isFemale ? 'text-pink-400' : 'text-blue-400'} transition-all duration-150`}>
              {exIdx + 1}. {we.exercise.name}
            </h3>
            <div
              className="w-10 h-10 rounded-full bg-[#182337] border border-[#23334e] group-hover:border-slate-700 text-slate-300 flex items-center justify-center transition-all grow-0 shrink-0 shadow-sm shrink-0"
              title="Minimizar Exercício"
            >
              <ChevronUp className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          {we.exercise.description && (
            <p className="text-gray-400 text-xs leading-relaxed mt-1.5 max-w-sm break-words pr-2">
              {we.exercise.description}
            </p>
          )}
        </div>
      </div>

      {/* Show GIF / Explanation container if clicked */}
      {isGifExpanded && (
        <div className="pt-1 animate-fade-in w-full overflow-hidden border-b border-slate-900/40 pb-3" onClick={e => e.stopPropagation()}>
          <ExerciseGifPlayer exercise={we.exercise} />
        </div>
      )}

      {/* Workout Set lines table - Armored dynamic columns */}
      <div className="space-y-3 w-full overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Scaled up column headers featuring thematic icons */}
        <div className="grid grid-cols-12 gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest font-mono select-none px-2 mb-1.5 border-b border-[#142238]/40 pb-2">
          <div className="col-span-2 text-left pl-1">SÉRIE</div>
          <div className="col-span-4 text-center flex items-center justify-center gap-1 pr-1.5">
            <Scale className="w-3 h-3 text-slate-500" />
            <span>CARGA (KG)</span>
          </div>
          <div className="col-span-3 text-center flex items-center justify-center gap-1">
            <Flame className="w-3 h-3 text-slate-500" />
            <span>REPS</span>
          </div>
          <div className="col-span-2 text-center text-[9px]">STATUS</div>
          <div className="col-span-1"></div>
        </div>

        <div className="space-y-2.5 w-full">
          {we.sets.map((set, set_idx) => {
            const isRestTimerShown = set.isCompleted;
            
            return (
              <React.Fragment key={set.id}>
                {/* Tactical input row, turns glowing when checked */}
                <div 
                  className={`grid grid-cols-12 items-center gap-2 px-2 py-2 rounded-2xl transition-all duration-200 relative group/row ${
                    set.isCompleted 
                      ? (isFemale 
                          ? 'bg-pink-500/5 border border-pink-500/15 shadow-[0_0_15px_rgba(244,63,94,0.02)]' 
                          : 'bg-blue-500/5 border border-blue-500/15 shadow-[0_0_15px_rgba(59,130,246,0.02)]')
                      : 'bg-[#121c2c]/40 border border-[#1b2b42]/40 hover:border-slate-800'
                  }`}
                >
                  {/* Set Number */}
                  <div className="col-span-2 flex items-center pl-2">
                    <span className={`text-base font-mono font-black ${set.isCompleted ? (isFemale ? 'text-pink-400 font-extrabold' : 'text-blue-400 font-extrabold') : 'text-slate-400'}`}>
                      {set_idx + 1}
                    </span>
                  </div>

                  {/* Weight Input Armored Cell (Subtle icon embedded inside pill container) */}
                  <div className="col-span-4 px-1">
                    <div className={`relative flex items-center bg-slate-950 border ${set.isCompleted ? 'border-transparent opacity-60' : 'border-slate-800/80 focus-within:' + accentBorder + ' focus-within:ring-1 focus-within:' + accentRing} rounded-2xl transition-all shadow-inner px-2.5`}>
                      <span className="text-slate-650 shrink-0 select-none mr-1">
                        <Dumbbell className="w-3 h-3 opacity-30" />
                      </span>
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
                        className={`w-full bg-transparent text-center font-mono text-base text-white focus:outline-none font-black py-2.5 px-0 select-all ${
                          set.isCompleted ? 'cursor-not-allowed opacity-80' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Reps Input Armored Cell (Subtle icon embedded inside pill container) */}
                  <div className="col-span-3 px-1">
                    <div className={`relative flex items-center bg-slate-950 border ${set.isCompleted ? 'border-transparent opacity-60' : 'border-slate-800/80 focus-within:' + accentBorder + ' focus-within:ring-1 focus-within:' + accentRing} rounded-2xl transition-all shadow-inner px-2.5`}>
                      <span className="text-slate-650 shrink-0 select-none mr-1">
                        <Flame className="w-3 h-3 opacity-30" />
                      </span>
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
                        className={`w-full bg-transparent text-center font-mono text-base text-white focus:outline-none font-black py-2.5 px-0 select-all ${
                          set.isCompleted ? 'cursor-not-allowed opacity-80' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Large tactile Status Checkbox */}
                  <div className="col-span-2 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleSetCheckChange(we.id, set.id, set.weight, set.reps, set.isCompleted)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all border duration-200 ${
                        set.isCompleted
                          ? (isFemale 
                              ? 'bg-pink-500 border-pink-400 text-slate-100 scale-102 shadow-[0_0_12px_rgba(244,63,94,0.4)]' 
                              : 'bg-blue-600 border-blue-550 text-slate-100 scale-102 shadow-[0_0_12px_rgba(96,165,250,0.4)]')
                          : 'bg-slate-950/90 border-[#1f304b] text-slate-600 hover:border-slate-500 hover:bg-slate-900/40'
                      }`}
                    >
                      {set.isCompleted ? (
                        <Check className="w-4 h-4 stroke-[4] text-white" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-850"></span>
                      )}
                    </button>
                  </div>

                  {/* Row Delete option – clean layout */}
                  <div className="col-span-1 flex items-center justify-end pr-1">
                    {we.sets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onDeleteSet(we.id, set.id)}
                        className="text-slate-650 hover:text-red-500 p-1 rounded cursor-pointer transition-colors opacity-0 group-hover/row:opacity-100 focus:opacity-100"
                        title="Remover série"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Contextual Integrated Rest countdown ticking screen */}
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

      {/* Add Set button - clean dynamic shortcut with premium borders */}
      <button
        type="button"
        onClick={() => onAddSet(we.id)}
        className={`w-full flex items-center justify-center gap-1.5 py-2.5 bg-slate-950/40 border border-slate-900 rounded-2xl text-[10px] font-black font-mono ${isFemale ? 'text-pink-400/70 hover:text-pink-400 hover:border-pink-500/10' : 'text-blue-400/70 hover:text-blue-400 hover:border-blue-500/10'} tracking-widest transition-all cursor-pointer`}
      >
        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>+ ADICIONAR SÉRIE</span>
      </button>
    </div>
  );
};

export default ActiveExerciseCard;
