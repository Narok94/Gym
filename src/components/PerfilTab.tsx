import React, { useState, useRef, useEffect } from 'react';
import { 
  TrendingUp, Award, Calendar, Ruler, AlertCircle, Plus, 
  ChevronRight, History, Heart, User, Sparkles, Scale,
  Edit2, Camera, Trash2, X, Check, Upload, ZoomIn, RefreshCw,
  Bell, BellOff, Clock
} from 'lucide-react';
import { UserProfile, HistorySession, WeightRecord, WorkoutReminder } from '../types';

// Let's provide some cool athletic avatar fast-packs
const COOL_AVATARS = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1605296867304-46d5465a25f1?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=200',
];

interface PerfilTabProps {
  userProfile: UserProfile;
  workoutHistory: HistorySession[];
  onAddWeightRecord: (weight: number) => void;
  onClearHistory: () => void;
  onUpdateProfile: (updatedData: {
    name: string;
    avatarUrl: string;
    height: number;
    currentWeight: number;
    level: 'Iniciante' | 'Intermediário' | 'Avançado';
  }) => void;
  onAddGalleryPhoto: (photoBase64OrUrl: string) => void;
  onDeleteGalleryPhoto: (photoUrl: string) => void;
  onResetAllData: () => void;
  onAddReminder: (dayOfWeek: string, time: string, label: string) => void;
  onDeleteReminder: (id: string) => void;
  onToggleReminder: (id: string) => void;
  onLogout: () => void;
}

export default function PerfilTab({
  userProfile,
  workoutHistory,
  onAddWeightRecord,
  onClearHistory,
  onUpdateProfile,
  onAddGalleryPhoto,
  onDeleteGalleryPhoto,
  onResetAllData,
  onAddReminder,
  onDeleteReminder,
  onToggleReminder,
  onLogout
}: PerfilTabProps) {
  // Stats
  const [newWeight, setNewWeight] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Editing profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userProfile.name);
  const [editHeight, setEditHeight] = useState(String(userProfile.height));
  const [editWeight, setEditWeight] = useState(String(userProfile.currentWeight));
  const [editAvatarUrl, setEditAvatarUrl] = useState(userProfile.avatarUrl);
  const [editLevel, setEditLevel] = useState(userProfile.level);

  // Sync edits state with profile updates only when NOT actively editing to avoid text field resets
  useEffect(() => {
    if (!isEditing) {
      setEditName(userProfile.name);
      setEditHeight(String(userProfile.height));
      setEditWeight(String(userProfile.currentWeight));
      setEditAvatarUrl(userProfile.avatarUrl);
      setEditLevel(userProfile.level);
    }
  }, [userProfile, isEditing]);

  // Gallery view state
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [manualPhotoUrl, setManualPhotoUrl] = useState('');
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);

  // Reminders creation state
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [reminderDay, setReminderDay] = useState('Segunda');
  const [reminderTime, setReminderTime] = useState('19:00');
  const [reminderLabel, setReminderLabel] = useState('');
  const [simulatedNotification, setSimulatedNotification] = useState<{
    show: boolean;
    title: string;
    message: string;
  } | null>(null);

  const triggerSimulation = (label: string, day: string, time: string) => {
    setSimulatedNotification({
      show: true,
      title: label || 'Hora do Treino! 🔥',
      message: `Lembrete ativo para ${day} às ${time}. Garrafa cheia e foco no objetivo! Vamos esmagar! 🏋️⚡`
    });
    setTimeout(() => {
      setSimulatedNotification(null);
    }, 6000);
  };

  // Danger zone reset state
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Save the profile edits
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      setErrorMsg('Nome não pode estar vazio');
      return;
    }
    onUpdateProfile({
      name: editName,
      avatarUrl: editAvatarUrl,
      height: Number(editHeight) || 170,
      currentWeight: Number(editWeight) || 70,
      level: editLevel
    });
    setIsEditing(false);
    setErrorMsg('');
  };

  // Convert files to base64 immediately for local sandbox robustness
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: 'avatar' | 'gallery') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('Selecione uma imagem menor que 8MB para performance ideal.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          if (target === 'avatar') {
            setEditAvatarUrl(reader.result);
          } else {
            onAddGalleryPhoto(reader.result);
            setIsAddingPhoto(false);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Pasting photo link manually
  const handlePastePhotoUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualPhotoUrl.trim()) {
      onAddGalleryPhoto(manualPhotoUrl.trim());
      setManualPhotoUrl('');
      setIsAddingPhoto(false);
    }
  };

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
  const points = userProfile.weightHistory || [];
  const weightsArr = points.map(p => p.weight);
  const minWeight = points.length > 0 ? Math.min(...weightsArr) - 2 : 70;
  const maxWeight = points.length > 0 ? Math.max(...weightsArr) + 2 : 90;
  const weightDiff = maxWeight - minWeight || 1;

  // Custom SVG properties
  const svgWidth = 500;
  const svgHeight = 140;
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
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const day = date.getUTCDate();
      const month = months[date.getUTCMonth()];
      return `${day} de ${month}`;
    } catch {
      return 'Há alguns dias';
    }
  };

  const galleryList = userProfile.photos || [];

  return (
    <div className="space-y-6 animate-fade-in px-1 pb-20 w-full overflow-x-hidden">
      
      {/* 1. PROFILE HEADER CARD (TOGGLE EDITABLE) */}
      {!isEditing ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden w-full">
          {/* Accent decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-neon-green/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          
          <button
            onClick={() => {
              setIsEditing(true);
              setEditName(userProfile.name);
              setEditHeight(String(userProfile.height));
              setEditWeight(String(userProfile.currentWeight));
              setEditAvatarUrl(userProfile.avatarUrl);
              setEditLevel(userProfile.level);
            }}
            className="absolute top-4 right-4 flex items-center gap-1 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-neon-green/40 transition-all rounded-lg p-2 text-xs font-bold text-neon-green cursor-pointer select-none"
            title="Editar dados"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Editar</span>
          </button>

          {/* User Visual Information Card */}
          <div className="flex flex-col items-center text-center space-y-3 pt-2">
            <div className="relative">
              <img 
                src={userProfile.avatarUrl} 
                alt={userProfile.name} 
                className="w-20 h-20 rounded-full object-cover border-4 border-neon-green/90 shadow-lg shadow-neon-green/10"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-1 -right-1 bg-neon-green text-slate-950 p-1.5 rounded-full border-2 border-slate-900">
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
          <div className="grid grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-slate-800/60 text-center">
            <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-850/40">
              <span className="text-[9px] text-gray-500 block uppercase font-mono">Altura</span>
              <span className="text-xs font-bold text-white font-mono">{userProfile.height} cm</span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-850/40">
              <span className="text-[9px] text-gray-500 block uppercase font-mono">Peso Atual</span>
              <span className="text-xs font-bold text-neon-green font-mono">{userProfile.currentWeight} kg</span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-850/40">
              <span className="text-[9px] text-gray-500 block uppercase font-mono">Realizados</span>
              <span className="text-xs font-bold text-white font-mono">{workoutHistory.length}</span>
            </div>
          </div>
        </div>
      ) : (
        /* EDIT PROFILE FORM INTERACTIVE CARD */
        <form onSubmit={handleProfileSave} className="bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-xl relative animate-fade-in space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h3 className="text-sm font-display font-bold text-white flex items-center gap-1.5">
              <Edit2 className="w-4 h-4 text-neon-green" />
              <span>Modificar Perfil</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Real-time photo preview and editing */}
            <div className="flex flex-col items-center gap-2 pb-2">
              <div className="relative group">
                <img 
                  src={editAvatarUrl} 
                  alt="Previa" 
                  className="w-16 h-16 rounded-full object-cover border-2 border-neon-green"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-neon-green hover:bg-lime-500 text-slate-950 p-1.5 rounded-full border border-slate-900 shadow-md transition-colors cursor-pointer"
                  title="Selecionar foto local"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>
              <input 
                type="file"
                ref={avatarInputRef}
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'avatar')}
                className="hidden"
              />
              <span className="text-[10px] text-slate-400">Envie uma foto ou escolha abaixo:</span>
              
              {/* Ready-to-go gym avatar selector */}
              <div className="flex gap-2">
                {COOL_AVATARS.map((avUrl, adIdx) => (
                  <button
                    key={adIdx}
                    type="button"
                    onClick={() => setEditAvatarUrl(avUrl)}
                    className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all ${
                      editAvatarUrl === avUrl ? 'border-neon-green scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={avUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
              
              {/* Text Link Photo input */}
              <div className="w-full">
                <input
                  type="text"
                  placeholder="Ou cole uma URL de imagem externa"
                  value={editAvatarUrl.startsWith('data:') ? '' : editAvatarUrl}
                  onChange={(e) => setEditAvatarUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-neon-green rounded-lg py-1 px-2.5 text-center text-[10px] text-slate-350 outline-none font-mono"
                />
              </div>
            </div>

            {/* Inputs list */}
            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1">Nome Completo</label>
                <input 
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-neon-green text-white rounded-xl py-2 px-3 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1">Altura (cm)</label>
                  <input 
                    type="number"
                    required
                    value={editHeight}
                    onChange={(e) => setEditHeight(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-neon-green text-white rounded-xl py-2 px-3 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1">Peso (kg)</label>
                  <input 
                    type="number"
                    step="0.1"
                    required
                    value={editWeight}
                    onChange={(e) => setEditWeight(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-neon-green text-white rounded-xl py-2 px-3 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1">Nível de Performance</label>
                <select
                  value={editLevel}
                  onChange={(e) => setEditLevel(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-neon-green text-white rounded-xl py-2 px-3 outline-none"
                >
                  <option value="Iniciante">Iniciante</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-1.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-slate-950 hover:bg-slate-850 border border-slate-800 py-2.5 rounded-xl text-slate-300 transition-colors cursor-pointer text-center select-none"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-neon-green hover:bg-lime-500 text-slate-950 py-2.5 rounded-xl transition-colors cursor-pointer text-center select-none flex items-center justify-center gap-1"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Salvar</span>
            </button>
          </div>
        </form>
      )}

      {/* 2. EVOLUTION PHOTOS GALLERY SECTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
        <div className="flex justify-between items-center pb-1">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-neon-green" />
            <h3 className="text-sm font-display font-bold text-white">Galeria de Evolução</h3>
            <span className="text-[10px] font-mono bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-gray-400">
              {galleryList.length}
            </span>
          </div>

          <button
            onClick={() => setIsAddingPhoto(!isAddingPhoto)}
            className="text-xs text-neon-green font-bold flex items-center gap-1 bg-slate-950/80 hover:bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-850 cursor-pointer select-none"
          >
            {isAddingPhoto ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 stroke-[3]" />}
            <span>Add Foto</span>
          </button>
        </div>

        {/* Adding inline options */}
        {isAddingPhoto && (
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-3 space-y-3 animate-fade-in text-xs">
            <span className="text-[10px] text-slate-400 block">Dica: Selecione fotos tiradas antes ou pós-treino para ver seus ganhos!</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-neon-green text-slate-950 font-bold rounded-lg hover:bg-lime-500 transition-colors cursor-pointer font-sans"
              >
                <Upload className="w-4 h-4" />
                <span>Escolher do Celular</span>
              </button>
              <input 
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'gallery')}
                className="hidden"
              />
            </div>
            
            <form onSubmit={handlePastePhotoUrl} className="flex gap-2">
              <input
                type="text"
                placeholder="Ou digite/cole link da foto"
                value={manualPhotoUrl}
                onChange={(e) => setManualPhotoUrl(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 outline-none outline-none font-mono"
              />
              <button
                type="submit"
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold p-1.5 px-3 rounded-lg cursor-pointer"
              >
                Ok
              </button>
            </form>
          </div>
        )}

        {/* Photos Grid display (3 columns, responsive aspect ratio) */}
        {galleryList.length === 0 ? (
          <div className="h-24 flex flex-col items-center justify-center text-center text-gray-500 bg-slate-950 border border-slate-950 rounded-xl p-3 select-none">
            <Camera className="w-6 h-6 text-slate-700 mb-1" />
            <span className="text-[11px]">Nenhuma foto registrada na galeria de treinos.</span>
            <span className="text-[9px] text-slate-600 block mt-0.5">Selecione fotos para traçar seu pump e mudanças no corpo!</span>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 pt-1">
            {galleryList.map((photo, pIdx) => (
              <div 
                key={pIdx}
                onClick={() => setLightboxPhoto(photo)}
                className="relative aspect-square rounded-xl overflow-hidden bg-slate-950 border border-slate-850 cursor-pointer group active:scale-95 transition-all shadow-sm flex items-center justify-center"
              >
                <img 
                  src={photo} 
                  alt={`Progresso ${pIdx + 1}`} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {/* Hover magnifier icon overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                  <ZoomIn className="w-5 h-5 text-neon-green" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. WEIGHT HISTORY GRAPHIC CANVAS CARD */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
        <div className="flex justify-between items-center pb-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-neon-green" />
            <h3 className="text-sm font-display font-bold text-white">Evolução de Peso</h3>
          </div>
          <span className="text-[10px] text-gray-400 font-mono">Últimas 6 atualizações</span>
        </div>

        {/* Responsive custom vector SVG representation of weight logs */}
        <div className="bg-slate-950 border border-slate-900/60 rounded-xl p-2.5 overflow-x-auto select-none">
          {points.length === 0 ? (
            <div className="h-28 flex items-center justify-center text-gray-600 text-xs">
              Nenhum dado registrado para traçar gráfico.
            </div>
          ) : (
            <svg 
              viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
              className="w-full text-slate-400 font-mono text-[9px]"
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
                    <circle cx={x} cy={y} r="4.5" fill="#a3e635" />
                    <circle cx={x} cy={y} r="1.5" fill="#0b111e" />
                    <text x={x} y={y - 9} textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="8">{p.weight} kg</text>
                    <text x={x} y={paddingTop + chartHeight + 13} textAnchor="middle" fill="#64748b">{p.date}</text>
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
          <label className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Registar Novo Peso Hoje</label>
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
              <span>Registar</span>
            </button>
          </div>
        </form>
      </div>

      {/* 4. HISTORICAL LIST CONTENT */}
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
              <span className="text-[10px] text-slate-600 block mt-1">Conclua um treino na aba de "Treino Ativo" para ver o histórico!</span>
            </div>
          ) : (
            workoutHistory.map((item) => (
              <div 
                key={item.id}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-sm hover:border-slate-850 transition-colors"
              >
                <div className="space-y-1 min-w-0 pr-2">
                  <h4 className="text-xs font-bold text-white truncate max-w-[200px]">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                    <span className="text-[10px] text-slate-500 font-sans font-medium">📆 {formatHistoryDate(item.completedAt)}</span>
                    <span>⏱️ {item.durationMinutes} min</span>
                  </div>
                </div>

                {/* Performance stats right hand block */}
                <div className="shrink-0 flex gap-1.5">
                  <div className="bg-slate-950 px-2 py-1 rounded text-center border border-slate-850">
                    <span className="text-[9px] text-slate-550 block">Séries</span>
                    <span className="text-xs font-bold text-white font-mono">{item.totalSets}</span>
                  </div>
                  <div className="bg-slate-950 px-2 py-1 rounded text-center border border-slate-850">
                    <span className="text-[9px] text-slate-550 block">Volume</span>
                    <span className="text-xs font-bold text-neon-green font-mono">{item.totalWeightVolume}<span className="text-[8px] font-normal text-slate-400">g</span></span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 4b. WORKOUT REMINDERS NOTIFICATION PREFERENCES SECTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-4">
        <div className="flex justify-between items-center pb-1">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-neon-green" />
            <h3 className="text-sm font-display font-bold text-white">Lembretes de Treino</h3>
            <span className="text-[10px] font-mono bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-gray-400">
              {(userProfile.reminders || []).length}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingReminder(!isAddingReminder)}
            className="text-xs text-neon-green font-bold flex items-center gap-1 bg-slate-950/80 hover:bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-850 cursor-pointer select-none"
          >
            {isAddingReminder ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 stroke-[3]" />}
            <span>Definir Dia/Hora</span>
          </button>
        </div>

        {/* Real-time Simulated Alert Banner */}
        {simulatedNotification && (
          <div className="bg-neon-green/10 border border-neon-green/35 text-white rounded-xl p-3 px-3.5 animate-bounce space-y-1 relative">
            <span className="absolute top-2 right-2 text-neon-green text-[9px] uppercase font-mono font-bold tracking-wider">Notificação</span>
            <div className="flex items-center gap-1.5 font-bold text-neon-green text-xs">
              <Bell className="w-4 h-4 text-neon-green" />
              <span>{simulatedNotification.title}</span>
            </div>
            <p className="text-[10px] text-slate-350 leading-snug">{simulatedNotification.message}</p>
          </div>
        )}

        {/* Form state for schedule selection */}
        {isAddingReminder && (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              onAddReminder(reminderDay, reminderTime, reminderLabel);
              setReminderLabel('');
              setIsAddingReminder(false);
            }}
            className="bg-slate-950 border border-slate-850 rounded-xl p-3 space-y-3 animate-fade-in text-xs"
          >
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] uppercase font-mono font-bold text-slate-500 block mb-1">Dia do Treino</label>
                <select
                  value={reminderDay}
                  onChange={(e) => setReminderDay(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-850 text-white rounded-lg py-1.5 px-2.5 outline-none font-sans"
                >
                  {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map(d => (
                    <option key={d} value={d}>{d}-feira</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono font-bold text-slate-500 block mb-1">Hora Preferida</label>
                <input
                  type="time"
                  required
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-850 text-white rounded-lg py-1.5 px-2.5 outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono font-bold text-slate-500 block mb-1">Nome do Lembrete (Opcional)</label>
              <input
                type="text"
                value={reminderLabel}
                onChange={(e) => setReminderLabel(e.target.value)}
                placeholder="Ex: Treino de Peito, Corrida na esteira"
                className="w-full bg-slate-900 border border-slate-850 text-white rounded-lg py-1.5 px-2.5 outline-none text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-neon-green hover:bg-lime-500 text-slate-950 font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer select-none"
            >
              <Check className="w-4 h-4 stroke-[2]" />
              <span>Agendar Notificação</span>
            </button>
          </form>
        )}

        {/* Existing schedules list */}
        {(!userProfile.reminders || userProfile.reminders.length === 0) ? (
          <div className="h-20 flex flex-col items-center justify-center text-center text-gray-500 bg-slate-950 border border-slate-950 rounded-xl p-3 select-none">
            <BellOff className="w-5 h-5 text-slate-700 mb-1" />
            <span className="text-[11px]">Nenhum lembrete ativado.</span>
            <span className="text-[9px] text-slate-600 block mt-0.5">Defina dias e horários para receber alertas de treino periódicos!</span>
          </div>
        ) : (
          <div className="space-y-2">
            {(userProfile.reminders || []).map((rem) => (
              <div 
                key={rem.id}
                className="bg-slate-950 border border-slate-850 rounded-xl p-2.5 flex items-center justify-between gap-2.5"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    type="button"
                    onClick={() => onToggleReminder(rem.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                      rem.isActive 
                        ? 'bg-neon-green/10 border-neon-green/30 text-neon-green' 
                        : 'bg-slate-900 border-slate-800 text-slate-600'
                    }`}
                    title={rem.isActive ? 'Desativar Alerta' : 'Ativar Alerta'}
                  >
                    <Bell className="w-3.5 h-3.5 animate-pulse" />
                  </button>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white font-mono">{rem.time}</span>
                      <span className="text-[9px] font-medium bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
                        {rem.dayOfWeek}-feira
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate max-w-[170px] mt-0.5">
                      {rem.label || 'Sem descrição'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* Test alert builder */}
                  {rem.isActive && (
                    <button
                      type="button"
                      onClick={() => triggerSimulation(rem.label, rem.dayOfWeek, rem.time)}
                      className="text-[9px] font-bold text-slate-400 hover:text-neon-green bg-slate-900 hover:bg-slate-850 px-2 py-1 rounded border border-slate-800 hover:border-neon-green/30 transition-all font-mono cursor-pointer"
                      title="Simular disparo de lembrete"
                    >
                      Testar
                    </button>
                  )}
                  
                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => onDeleteReminder(rem.id)}
                    className="text-slate-500 hover:text-red-400 p-1.5 rounded hover:bg-slate-900 transition-colors cursor-pointer"
                    title="Excluir lembrete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. SESSÃO / SAIR DA CONTA */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-white">Sair do Tatu Gym</h4>
            <p className="text-[10px] text-slate-400">Salvo no seu navegador de forma segura</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-red-400 text-[10px] font-bold font-mono rounded-xl border border-slate-800 hover:border-red-900/40 transition-all cursor-pointer select-none"
          >
            Sair da Conta 👋
          </button>
        </div>
      </div>

      {/* 6. CONFIGS & START-FROM-SCRATCH DANGER ZONE */}
      <div className="bg-slate-900 border border-red-500/15 rounded-2xl p-4 shadow-sm bg-red-500/5 space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4.5 h-4.5 text-red-400" />
          <h3 className="text-sm font-display font-semibold text-red-200">Área de Perigo</h3>
        </div>

        <p className="text-[11px] text-slate-400 leading-snug">
          Tem a opção de resetar os dias treinados, o histórico de exercícios registrados e as fotos enviadas para começar do absoluto zero. Esta operação não pode ser desfeita.
        </p>

        {!showResetConfirm ? (
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-2.5 px-4 bg-red-950/40 hover:bg-red-900/40 text-red-400 border border-red-900/35 hover:border-red-500 transition-colors text-xs font-bold font-mono rounded-xl cursor-pointer text-center select-none"
          >
            ❌ ZERAR DIAS TREINADOS E REINICIAR
          </button>
        ) : (
          <div className="bg-slate-950/80 border border-red-500/30 rounded-xl p-3 space-y-3 animate-fade-in text-xs">
            <span className="text-[11px] text-red-200 block font-semibold text-center">❓ Tem certeza que deseja zerar seus dias para começar do zero?</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-lg font-bold border border-slate-800"
              >
                Não, cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetAllData();
                  setShowResetConfirm(false);
                }}
                className="flex-1 bg-red-650 hover:bg-red-600 text-white py-2 rounded-lg font-extrabold shadow-lg shadow-red-900/30"
              >
                Sim, Zerar Tudo ⚡
              </button>
            </div>
          </div>
        )}
      </div>

      {/* LUXURIOUS LIGHTBOX MULTIMEDIA ZOOM MODAL */}
      {lightboxPhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 animate-fade-in"
          onClick={() => setLightboxPhoto(null)}
        >
          <div 
            className="relative max-w-sm w-full flex flex-col space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Expanded image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
              <img 
                src={lightboxPhoto} 
                alt="Zoom Progresso" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {/* Close Button top-right */}
              <button
                type="button"
                onClick={() => setLightboxPhoto(null)}
                className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white hover:text-red-400 hover:bg-slate-900 p-2.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Quick action bar */}
            <div className="flex justify-between items-center bg-slate-900/80 backdrop-blur-md border border-slate-800 p-3 rounded-2xl text-xs">
              <span className="text-gray-400 font-mono">Pump Record 📸</span>
              <button
                type="button"
                onClick={() => {
                  onDeleteGalleryPhoto(lightboxPhoto);
                  setLightboxPhoto(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 rounded-xl transition-all cursor-pointer font-bold"
                title="Excluir foto permanentemente"
              >
                <Trash2 className="w-4 h-4" />
                <span>Excluir Foto</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
