import React, { useState } from 'react';
import { 
  TrendingUp, Award, Calendar, Ruler, AlertCircle, Plus, 
  ChevronRight, History, Heart, User, Sparkles, Scale 
} from 'lucide-react';
import { UserProfile, HistorySession, WeightRecord } from '../types';

interface PerfilTabProps {
  userProfile: UserProfile;
  workoutHistory: HistorySession[];
  onAddWeightRecord: (weight: number) => void;
  onClearHistory: () => void;
}

export default function PerfilTab({
  userProfile,
  workoutHistory,
  onAddWeightRecord,
  onClearHistory
}: PerfilTabProps) {
  const [newWeight, setNewWeight] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Weight Submission
  const handleScaleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const weightVal = parseFloat(newWeight);
    if (!weightVal || isNaN(weightVal) || weightVal <= 20 || weightVal > 300) {
      setErrorMsg('Insira um peso válido entre 20kg e 300kg');
      return;
    }
    setErrorMsg('');
    onAddWeightRecord(weightVal);
    setNewWeight('');
  };

  // Build responsive coordinate systems for custom SVG weight progress curve
  const points = userProfile.weightHistory;
  const weightsArr = points.map(p => p.weight);
  const minWeight = Math.min(...weightsArr, 70) - 2;
  const maxWeight = Math.max(...weightsArr, 90) + 2;
  const weightDiff = maxWeight - minWeight || 1;

  // Custom SVG properties
  const svgWidth = 500;
  const svgHeight = 150;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 20;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Compute SVG Polyline points dynamically
  const polylineCoords = points.map((p, idx) => {
    const xRatio = points.length > 1 ? idx / (points.length - 1) : 0.5;
    const x = paddingLeft + xRatio * chartWidth;
    
    const yRatio = (p.weight - minWeight) / weightDiff;
    const y = paddingTop + chartHeight - (yRatio * chartHeight);
    return `${x},${y}`;
  }).join(' ');

  // Format date helper to Portuguese strings e.g. "18 de Mai"
  const formatHistoryDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      // Fallback for direct browser compatibility if International API acts weird
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const day = date.getUTCDate();
      const month = months[date.getUTCMonth()];
      return `${day} de ${month}`;
    } catch {
      return 'Há alguns dias';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in px-1 pb-20">
      {/* Profile Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-green/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

        {/* User Visual Card */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative">
            <img 
              src={userProfile.avatarUrl} 
              alt={userProfile.name} 
              className="w-20 h-20 rounded-full object-cover border-4 border-neon-green/90 shadow-lg shadow-neon-green/10"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-1 -right-1 bg-neon-green text-slate-950 p-1 rounded-full border-2 border-slate-900">
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-display font-extrabold text-white tracking-wide">{userProfile.name}</h2>
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-[10px] font-mono font-bold bg-neon-green/10 text-neon-green px-2.5 py-0.5 rounded-full border border-neon-green/20 uppercase">
                Atleta {userProfile.level}
              </span>
            </div>
          </div>
        </div>

        {/* Bio Physical Metrics Panel */}
        <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-slate-800/60 text-center">
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-850/40">
            <span className="text-[10px] text-gray-500 block uppercase font-mono">Altura</span>
            <span className="text-sm font-bold text-white font-mono">{userProfile.height} cm</span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-850/40">
            <span className="text-[10px] text-gray-500 block uppercase font-mono">Peso Atual</span>
            <span className="text-sm font-bold text-neon-green font-mono">{userProfile.currentWeight} kg</span>
          </div>
        </div>
      </div>

      {/* Weight History Graphic Canvas Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
        <div className="flex justify-between items-center pb-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-neon-green" />
            <h3 className="text-sm font-display font-bold text-white">Evolução de Peso</h3>
          </div>
          <span className="text-[10px] text-gray-400 font-mono">Últimas atualizações</span>
        </div>

        {/* Responsive custom vector SVG representation of weight logs */}
        <div className="bg-slate-950 border border-slate-900 rounded-xl p-2.5 overflow-x-auto">
          {points.length === 0 ? (
            <div className="h-28 flex items-center justify-center text-gray-600 text-xs">
              Nenhum dado para traçar gráfico.
            </div>
          ) : (
            <svg 
              viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
              className="w-full text-slate-400 font-mono text-[10px] select-none"
              style={{ minWidth: '400px' }}
            >
              {/* Grid Lines */}
              <line x1={paddingLeft} y1={paddingTop} x2={svgWidth - paddingRight} y2={paddingTop} stroke="#1e293b" strokeDasharray="3,3" />
              <line x1={paddingLeft} y1={paddingTop + chartHeight/2} x2={svgWidth - paddingRight} y2={paddingTop + chartHeight/2} stroke="#1e293b" strokeDasharray="3,3" />
              <line x1={paddingLeft} y1={paddingTop + chartHeight} x2={svgWidth - paddingRight} y2={paddingTop + chartHeight} stroke="#1e293b" strokeDasharray="3,3" />

              {/* Y Axis Labels (Weights) */}
              <text x={paddingLeft - 8} y={paddingTop + 4} textAnchor="end" fill="#64748b">{maxWeight.toFixed(1)}</text>
              <text x={paddingLeft - 8} y={paddingTop + chartHeight/2 + 4} textAnchor="end" fill="#64748b">{((maxWeight + minWeight)/2).toFixed(1)}</text>
              <text x={paddingLeft - 8} y={paddingTop + chartHeight + 4} textAnchor="end" fill="#64748b">{minWeight.toFixed(1)}</text>

              {/* Fill area underneath line */}
              {points.length > 1 && (
                <path
                  d={`
                    M ${paddingLeft} ${paddingTop + chartHeight} 
                    ${points.map((p, idx) => {
                      const xRatio = idx / (points.length - 1);
                      const x = paddingLeft + xRatio * chartWidth;
                      const yRatio = (p.weight - minWeight) / weightDiff;
                      const y = paddingTop + chartHeight - (yRatio * chartHeight);
                      return `L ${x} ${y}`;
                    }).join(' ')} 
                    L ${paddingLeft + chartWidth} ${paddingTop + chartHeight} Z
                  `}
                  fill="url(#neonGradient)"
                  opacity="0.1"
                />
              )}

              {/* Linear Curve Polyline */}
              {points.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#a3e635"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={polylineCoords}
                  className="drop-shadow-[0_0_6px_rgba(163,230,53,0.3)]"
                />
              )}

              {/* Interactive Dots for records */}
              {points.map((p, idx) => {
                const xRatio = points.length > 1 ? idx / (points.length - 1) : 0.5;
                const x = paddingLeft + xRatio * chartWidth;
                const yRatio = (p.weight - minWeight) / weightDiff;
                const y = paddingTop + chartHeight - (yRatio * chartHeight);

                return (
                  <g key={idx}>
                    <circle cx={x} cy={y} r="5" fill="#a3e635" className="animate-pulse" />
                    <circle cx={x} cy={y} r="2" fill="#0b111e" />
                    {/* Weight display value */}
                    <text x={x} y={y - 10} textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="9">{p.weight} kg</text>
                    {/* X axis tag label */}
                    <text x={x} y={paddingTop + chartHeight + 14} textAnchor="middle" fill="#64748b">{p.date}</text>
                  </g>
                );
              })}

              {/* Gradient defs */}
              <defs>
                <linearGradient id="neonGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a3e635" />
                  <stop offset="100%" stopColor="#a3e635" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          )}
        </div>

        {/* Dynamic Log Scale Input Form */}
        <form onSubmit={handleScaleSave} className="space-y-2 pt-1">
          <label className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Registrar Novo Peso de Hoje</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder="Exemplo: 81.5"
                className="w-full bg-slate-950 border border-slate-800 focus:border-neon-green rounded-xl py-2 px-3 pl-8 text-xs text-white outline-none font-mono"
              />
              <Scale className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 font-mono text-xs">Kg</span>
            </div>
            <button
              type="submit"
              className="bg-neon-green text-slate-950 font-bold text-xs py-2 px-4 rounded-xl hover:bg-lime-500 transition-colors cursor-pointer shrink-0 flex items-center gap-1"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Registrar</span>
            </button>
          </div>
          {errorMsg && (
            <p className="text-red-400 text-[10px] flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorMsg}</span>
            </p>
          )}
        </form>
      </div>

      {/* Historical List Content */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-white font-display font-bold text-sm">
            <History className="w-4 h-4 text-neon-green" />
            <h3>Histórico de Treinos</h3>
          </div>
          {workoutHistory.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-[10px] text-gray-500 hover:text-red-400 font-mono transition-colors cursor-pointer"
            >
              Limpar Tudo
            </button>
          )}
        </div>

        <div className="space-y-2.5">
          {workoutHistory.length === 0 ? (
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 text-center text-gray-500">
              <span className="text-xs block">Nenhum treino concluído ainda.</span>
              <span className="text-[10px] text-slate-600 block mt-1">Navegue até a aba "Treino Ativo" para fazer o check-in do dia!</span>
            </div>
          ) : (
            workoutHistory.map((item) => (
              <div 
                key={item.id}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-sm hover:border-slate-850 transition-colors"
              >
                <div className="space-y-1 min-w-0 pr-2">
                  <h4 className="text-xs font-bold text-white truncate max-w-[220px]">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                    <span className="text-[10px] text-slate-500 font-sans font-medium">📆 {formatHistoryDate(item.completedAt)}</span>
                    <span>⏱️ {item.durationMinutes} min</span>
                  </div>
                </div>

                {/* Performance stats right hand block */}
                <div className="shrink-0 flex gap-2">
                  <div className="bg-slate-950 px-2 py-1 rounded text-center border border-slate-850">
                    <span className="text-[9px] text-slate-500 block">Séries</span>
                    <span className="text-xs font-bold text-white font-mono">{item.totalSets}</span>
                  </div>
                  <div className="bg-slate-950 px-2.5 py-1 rounded text-center border border-slate-850">
                    <span className="text-[9px] text-slate-500 block">Volume</span>
                    <span className="text-xs font-bold text-neon-green font-mono">{item.totalWeightVolume} <span className="text-[8px] font-normal text-slate-400">kg</span></span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
