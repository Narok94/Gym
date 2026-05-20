import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trash2, Plus, Eye, ChevronDown, ChevronUp, Check, Flame, Trophy, Sparkles, Dumbbell, Zap } from 'lucide-react';
import { WorkoutExercise } from '../types';
import { useWorkout } from '../WorkoutContext';

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

// Triumphant rising digital chord for full exercise completion
const playTriumphantSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    
    const playTone = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle'; // triangle has a softer, warmer retro game chime tone
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.09, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    playTone(523.25, now, 0.15);         // C5
    playTone(659.25, now + 0.12, 0.15);  // E5
    playTone(783.99, now + 0.24, 0.15);  // G5
    playTone(1046.50, now + 0.36, 0.35); // C6
  } catch (error) {
    console.error('Failed to play triumphant feedback sound:', error);
  }
};

// Synthesize a high-tech/metallic iron plate clink when matching sets are completed
const playIronPlateClink = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    const oscHigh = ctx.createOscillator();
    const oscBody = ctx.createOscillator();
    const gainHigh = ctx.createGain();
    const gainBody = ctx.createGain();

    oscHigh.type = 'sine';
    oscHigh.frequency.setValueAtTime(1400, now); // high ping frequency
    gainHigh.gain.setValueAtTime(0.04, now);
    gainHigh.gain.exponentialRampToValueAtTime(0.001, now + 0.12); // fast decay

    oscBody.type = 'triangle';
    oscBody.frequency.setValueAtTime(800, now); // iron plate clack body resonance
    gainBody.gain.setValueAtTime(0.03, now);
    gainBody.gain.exponentialRampToValueAtTime(0.001, now + 0.08); // even faster decay

    oscHigh.connect(gainHigh);
    gainHigh.connect(ctx.destination);

    oscBody.connect(gainBody);
    gainBody.connect(ctx.destination);

    oscHigh.start(now);
    oscHigh.stop(now + 0.15);
    oscBody.start(now);
    oscBody.stop(now + 0.15);
  } catch (error) {
    console.warn(error);
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

  return (
    <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 my-2.5 flex items-center justify-between gap-3 animate-fade-in shadow-sm cursor-default" onClick={e => e.stopPropagation()}>
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-white border-2 border-[#0055ff] shadow-sm select-none shrink-0" key={seconds}>
          <span className="text-sm font-mono font-black text-[#0055ff] animate-pulse">{seconds}</span>
        </div>
        <div className="text-left">
          <span className="text-[10px] font-mono tracking-widest text-[#0055ff] block uppercase font-bold">DESCANSO ATIVO</span>
          <span className="text-xs font-sans font-medium text-gray-700">Respire, concentre e prepare-se!</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button 
          type="button"
          onClick={(e) => adjustTime(e, -15)}
          className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-[10px] font-mono font-black py-2 px-2.5 rounded-xl cursor-pointer transition-all active:scale-95"
        >
          -15s
        </button>
        <button 
          type="button"
          onClick={(e) => adjustTime(e, 15)}
          className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-[10px] font-mono font-black py-2 px-2.5 rounded-xl cursor-pointer transition-all active:scale-95"
        >
          +15s
        </button>
        <button 
          type="button"
          onClick={handleSkipClick}
          className="bg-[#0055ff] hover:bg-[#0044ee] text-white text-[10px] font-display font-black py-2.5 px-3 rounded-xl cursor-pointer transition-all active:scale-95 shadow-md"
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
  isLight?: boolean;
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
  // Local accordion state for render optimization
  const [isOpen, setIsOpen] = useState(() => {
    // Starts true if first exercise of the routine
    return exIdx === 0;
  });

  // Local state for gif visibility
  const [isGifExpanded, setIsGifExpanded] = useState(false);
  
  // Track active rest timer set id
  const [activeTimerSetId, setActiveTimerSetId] = useState<string | null>(null);

  // New state for showing a brief victory glow and particle animation before auto-minimizing
  const [showCelebration, setShowCelebration] = useState(false);

  // Calculate if ALL sets of this exercise are finished
  const allSetsDone = we.sets.length > 0 && we.sets.every(s => s.isCompleted);
  // Calculate if SOME but not all sets are finished
  const partiallyDone = we.sets.some(s => s.isCompleted) && !allSetsDone;

  const methodLabel = we.method || `Método: Padrão (${we.sets.length} séries)`;
  const intervalLabel = we.interval ? (we.interval.includes('Intervalo') ? we.interval : `Intervalo ${we.interval}`) : `Intervalo 45s`;
  const loadLabel = we.loadText || `Carga: ${we.sets[0]?.weight ? `${we.sets[0].weight}kg` : 'Livre'}`;

  // Read gitUrl dynamically from repository data, fallback to image_30 or Unsplash illustrative gifs
  const displayGifUrl = we.exercise.gifUrl || we.exercise.imageUrl || 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=150';

  if (!isOpen) {
    return (
      <motion.div 
        layout
        layoutId={`ex-card-layout-${we.id}`}
        onClick={() => setIsOpen(true)}
        className="bg-white border border-gray-150 rounded-2xl p-4 flex items-center justify-between transition-all select-none cursor-pointer group active:scale-[0.99] duration-150 shadow-[0_2px_8px_rgba(0,0,0,0.02)] relative overflow-hidden"
      >
        {/* Vibrant electric blue left strip */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0055ff] shadow-[1px_0_8px_rgba(0,85,255,0.4)]"></div>

        <div className="flex items-center gap-3.5 min-w-0 pr-3 pl-2">
          {/* Gem-like indicator reflecting status */}
          <div className="relative shrink-0 flex items-center justify-center">
            {allSetsDone ? (
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgb(16,185,129)] border border-emerald-400 z-10"></span>
            ) : partiallyDone ? (
              <span className="w-3.5 h-3.5 rounded-full bg-[#0055ff] shadow-[0_0_10px_rgba(0,85,255,0.7)] animate-pulse border border-blue-200 z-10"></span>
            ) : (
              <span className="w-3.5 h-3.5 rounded-full bg-gray-300 border border-gray-200 z-10"></span>
            )}
            {partiallyDone && (
              <span className="absolute w-5 h-5 rounded-full bg-[#0055ff]/20 animate-ping -z-10"></span>
            )}
          </div>

          <div className="min-w-0">
            <span className="text-sm font-bold text-black group-hover:text-[#0055ff] transition-colors block leading-tight">
              {exIdx + 1}. {we.exercise.name}
            </span>
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mt-0.5 font-bold">
              {we.exercise.category} • {methodLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-[10px] font-mono bg-gray-50 border border-gray-150 px-2 py-0.5 rounded-lg text-gray-500 font-extrabold shadow-sm">
            {we.sets.filter(s => s.isCompleted).length}/{we.sets.length} séries
          </span>
          <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-150 text-gray-600 flex items-center justify-center transition-all shadow-sm">
            <ChevronDown className="w-4.5 h-4.5 stroke-[2.5]" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      layout
      layoutId={`ex-card-layout-${we.id}`}
      className={`bg-white border rounded-2xl p-4.5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-4 transition-all w-full overflow-hidden select-none animate-fade-in relative ${
        showCelebration 
          ? 'border-emerald-400 ring-4 ring-emerald-500/20 shadow-[0_0_25px_rgba(16,185,129,0.25)]' 
          : 'border-gray-150'
      }`}
    >
      {/* Left blue/green strip */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-300 ${
        showCelebration 
          ? 'bg-emerald-500 shadow-[1px_0_8px_rgba(16,185,129,0.5)]' 
          : 'bg-[#0055ff] shadow-[1px_0_8px_rgba(0,85,255,0.4)]'
      }`}></div>

      {/* Celebration overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center z-30 animate-fade-in px-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-2.5 max-w-[220px] shadow-xl transform scale-102 transition-transform">
            <div className="w-12 h-12 rounded-full bg-[#0055ff] flex items-center justify-center text-white shadow-[0_0_12px_rgba(0,85,255,0.6)] animate-bounce">
              <Dumbbell className="w-6 h-6 stroke-[3] rotate-45" />
            </div>
            <div>
              <p className="text-xs font-mono tracking-widest text-blue-400 font-black uppercase flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse" /> TREINO CONCLUÍDO
              </p>
              <p className="text-xs text-white font-extrabold leading-relaxed mt-1">Esmagado com sucesso! 💪🔥</p>
            </div>
          </div>
          
          {/* Floating tiny particles simulating simple lightweight confetti */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(14)].map((_, i) => {
              const randX = Math.random() * 100;
              const randY = Math.random() * 100;
              const delay = Math.random() * 0.4;
              const scale = 0.4 + Math.random() * 0.8;
              const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#84cc16'];
              const randomColor = colors[i % colors.length];
              return (
                <span 
                  key={i}
                  className="absolute rounded-full animate-ping z-20"
                  style={{
                    left: `${randX}%`,
                    top: `${randY}%`,
                    width: `${6 * scale}px`,
                    height: `${6 * scale}px`,
                    backgroundColor: randomColor,
                    animationDelay: `${delay}s`,
                    animationDuration: '1s'
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Collapsible trigger header */}
      <div 
        onClick={() => setIsOpen(false)}
        className="flex justify-between items-start gap-3 w-full border-b border-gray-100 pb-3 cursor-pointer group select-none active:opacity-95 pl-2"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[9px] uppercase font-mono px-2 py-0.5 bg-gray-100 border border-gray-200 text-[#0055ff] font-extrabold rounded-lg">
              {we.exercise.category}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsGifExpanded((prev) => !prev);
              }}
              className={`flex items-center gap-1 text-[9px] font-mono font-black px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                isGifExpanded
                  ? 'bg-[#0055ff] text-white'
                  : 'bg-gray-100 text-gray-500 border border-gray-200 hover:text-black'
              }`}
            >
              <Eye className="w-3" />
              <span>{isGifExpanded ? 'FECHAR' : 'VER GIF'}</span>
            </button>
          </div>
          
          <div className="flex items-center gap-2 justify-between w-full mt-2">
            <h3 className="text-base font-bold text-shadow text-black leading-tight break-words group-hover:text-[#0055ff] transition-all">
              {exIdx + 1}. {we.exercise.name}
            </h3>
            <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-150 text-gray-600 flex items-center justify-center transition-all grow-0 shrink-0 shadow-sm">
              <ChevronUp className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
          </div>

          {/* Dynamic Exercise prescription rules display */}
          <div className="mt-2 space-y-1 bg-gray-50/50 rounded-xl p-2.5 border border-gray-100/80">
            <p className="text-[11px] font-semibold text-gray-700 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0055ff]"></span>
              <strong>Método:</strong> {methodLabel}
            </p>
            <p className="text-[11px] font-semibold text-gray-700 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0055ff]"></span>
              <strong>Intervalo:</strong> {intervalLabel}
            </p>
            <p className="text-[11px] font-semibold text-gray-700 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0055ff]"></span>
              <strong>Carga Inicial:</strong> {loadLabel}
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic GIF expansion */}
      {isGifExpanded && (
        <div className="pt-1 animate-fade-in w-full overflow-hidden border-b border-gray-100 pb-3" onClick={e => e.stopPropagation()}>
          <div className="rounded-xl overflow-hidden bg-gray-50 border border-gray-150 p-1 relative">
            <img 
              src={displayGifUrl} 
              alt={we.exercise.name} 
              className="w-full h-44 object-cover rounded-lg"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-2 left-2 bg-black/75 px-2.5 py-1 rounded text-[10px] font-mono text-white tracking-widest uppercase">
              REPOSITÓRIO (GITHUB)
            </div>
          </div>
          {we.exercise.description && (
            <p className="text-gray-500 text-xs mt-2 leading-relaxed px-1">
              {we.exercise.description}
            </p>
          )}
        </div>
      )}

      {/* Workout interactive table */}
      <div className="space-y-3 w-full overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="grid grid-cols-12 gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest font-mono select-none px-2 mb-1.5 border-b border-gray-100 pb-1.5">
          <div className="col-span-2 text-left pl-1">SÉRIE</div>
          <div className="col-span-4 text-center">CARGA (KG)</div>
          <div className="col-span-3 text-center">REPS</div>
          <div className="col-span-2 text-center text-[9px]">STATUS</div>
          <div className="col-span-1"></div>
        </div>

        <div className="space-y-2 w-full">
          {we.sets.map((set, set_idx) => {
            return (
              <React.Fragment key={set.id}>
                <div 
                  className={`grid grid-cols-12 items-center gap-2 px-2 py-1.5 rounded-xl transition-all duration-200 border group/row ${
                    set.isCompleted 
                      ? 'bg-blue-50/40 border-blue-105 shadow-[0_2px_8px_rgba(0,85,255,0.01)]'
                      : 'bg-white border-gray-150 hover:border-gray-300'
                  }`}
                >
                  {/* Set Number */}
                  <div className="col-span-2 flex items-center pl-2">
                    <span className={`text-sm font-mono font-black ${set.isCompleted ? 'text-[#0055ff]' : 'text-gray-600'}`}>
                      {set_idx + 1}
                    </span>
                  </div>

                  {/* Weight Input */}
                  <div className="col-span-4 px-0.5">
                    <div className={`relative flex items-center bg-gray-50 border ${set.isCompleted ? 'border-transparent opacity-60' : 'border-gray-200 focus-within:border-[#0055ff] focus-within:ring-1 focus-within:ring-[#0055ff]'} rounded-xl transition-all shadow-sm px-2`}>
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
                        className="w-full bg-transparent text-center font-mono text-sm text-black focus:outline-none font-bold py-1.5"
                      />
                    </div>
                  </div>

                  {/* Reps Input */}
                  <div className="col-span-3 px-0.5">
                    <div className={`relative flex items-center bg-gray-50 border ${set.isCompleted ? 'border-transparent opacity-60' : 'border-gray-200 focus-within:border-[#0055ff] focus-within:ring-1 focus-within:ring-[#0055ff]'} rounded-xl transition-all shadow-sm px-2`}>
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
                        className="w-full bg-transparent text-center font-mono text-sm text-black focus:outline-none font-bold py-1.5"
                      />
                    </div>
                  </div>

                  {/* Gem-like interactive checkbox */}
                  <div className="col-span-2 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        const nextCompleted = !set.isCompleted;
                        
                        // Check if checking this set completes the rest of the workout exercise
                        const otherSetsAllDone = we.sets
                          .filter(s => s.id !== set.id)
                          .every(s => s.isCompleted);
                        
                        const isCompletingLastSetOfExercise = nextCompleted && otherSetsAllDone;

                        handleSetCheckChange(we.id, set.id, set.weight, set.reps, set.isCompleted);
                        
                        if (isCompletingLastSetOfExercise) {
                          // Play triumphant chord chime!
                          playTriumphantSound();
                          // Set local state to show a beautiful particle overlay
                          setShowCelebration(true);
                          // Clear active timer for this set because we completed the exercise
                          setActiveTimerSetId(null);
                          
                          // Wait 1.3 seconds, then minimize the card
                          setTimeout(() => {
                            setIsOpen(false);
                            setShowCelebration(false);
                          }, 1300);
                        } else {
                          // Standard timer/state transition
                          if (nextCompleted) {
                            playIronPlateClink();
                            setActiveTimerSetId(set.id);
                          } else {
                            if (activeTimerSetId === set.id) {
                              setActiveTimerSetId(null);
                            }
                          }
                        }
                      }}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-all border duration-205 ${
                        set.isCompleted
                          ? 'bg-[#0055ff] border-[#0055ff] text-white scale-102 shadow-[0_2px_8px_rgba(0,85,255,0.35)]'
                          : 'bg-white border-gray-200 hover:border-gray-300 text-transparent'
                      }`}
                    >
                      {set.isCompleted ? (
                        <Check className="w-3.5 h-3.5 stroke-[4.5] text-white" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                      )}
                    </button>
                  </div>

                  {/* Delete action */}
                  <div className="col-span-1 flex items-center justify-end pr-1">
                    {we.sets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onDeleteSet(we.id, set.id)}
                        className="text-gray-400 hover:text-red-500 p-1 rounded cursor-pointer transition-colors opacity-0 group-hover/row:opacity-100 focus:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* REST TIMER (LIGHT THEME) - DYNAMIC BELOW SET ROW */}
                {activeTimerSetId === set.id && (
                  <InlineActiveRestTimer 
                    setId={set.id}
                    onSkip={() => setActiveTimerSetId(null)}
                    getTimerRemaining={getTimerRemaining}
                    onUpdateTimer={onUpdateTimer}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Adicionar Série Button */}
      <button
        type="button"
        onClick={() => onAddSet(we.id)}
        className="w-full flex items-center justify-center gap-1.5 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-xl text-[10px] font-black font-mono text-[#0055ff] tracking-widest transition-all cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>+ ADICIONAR SÉRIE</span>
      </button>
    </motion.div>
  );
};

export default ActiveExerciseCard;
