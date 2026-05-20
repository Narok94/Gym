import { Exercise, WorkoutSession, UserProfile, HistorySession } from './types';

export const COMPREHENSIVE_EXERCISES: Exercise[] = [
  // Treino A - Empurre
  { id: 'ex-manguito', name: 'Aquecimento: Manguito Rotador na Polia', category: 'Ombros', description: 'Foco em ativação leve.' },
  { id: 'ex-supino-maq', name: 'Supino na Máquina (ou Articulado)', category: 'Peito', description: 'Proteger ombro, movimento controlado.' },
  { id: 'ex-crucifixo-reto', name: 'Crucifixo Reto com Halteres', category: 'Peito', description: 'Não descer os halteres além do tronco.' },
  { id: 'ex-elevacao-lat', name: 'Elevação Lateral (Halteres ou Polia)', category: 'Ombros', description: 'Braços levemente à frente (plano escapular).' },
  { id: 'ex-triceps-corda', name: 'Tríceps Corda na Polia', category: 'Braços', description: 'Extensão máxima mantendo cotovelos fixos.' },
  { id: 'ex-triceps-coice', name: 'Tríceps Coice (Cabo ou Halter)', category: 'Braços', description: 'Controle bem a fase de retorno.' },
  { id: 'ex-abdominal-supra', name: 'Abdominal Supra (Solo ou Máquina)', category: 'Abdômen', description: 'Contrair bem o abdômen no pico.' },

  // Treino B - Puxe
  { id: 'ex-puxada-alta', name: 'Puxada Alta (Lat Pulldown)', category: 'Costas', description: 'Puxar em direção ao peito (nunca por trás).' },
  { id: 'ex-remada-baixa', name: 'Remada Baixa Sentado (Triângulo)', category: 'Costas', description: 'Esmagar as escápulas, peito estufado.' },
  { id: 'ex-crucifixo-inv', name: 'Crucifixo Inverso na Máquina', category: 'Ombros', description: 'Fortalecimento essencial para postura.' },
  { id: 'ex-encolhimento', name: 'Encolhimento com Halteres (Trapézio)', category: 'Costas', description: 'Subir e descer controlado, SEM rotacionar.' },
  { id: 'ex-rosca-direta-w', name: 'Rosca Direta com Barra W', category: 'Braços', description: 'Mais anatômica para punhos e cotovelos.' },
  { id: 'ex-rosca-martelo', name: 'Rosca Martelo', category: 'Braços', description: 'Pegada neutra.' },

  // Treino C - Pernas e Core
  { id: 'ex-leg-press', name: 'Leg Press 45º ou Horizontal', category: 'Pernas', description: 'Empurrar com o meio do pé/calcanhar.' },
  { id: 'ex-extensora', name: 'Cadeira Extensora', category: 'Pernas', description: 'Controlar bem a descida (fase excêntrica).' },
  { id: 'ex-flexora', name: 'Mesa ou Cadeira Flexora', category: 'Pernas', description: 'Foco em posterior de coxa.' },
  { id: 'ex-panturrilha-cavalinho', name: 'Panturrilha Sentado (Cavalinho)', category: 'Pernas', description: 'Alongamento e contração máxima.' },
  { id: 'ex-abdominal-infra', name: 'Abdominal Infra (Solo)', category: 'Abdômen', description: 'Elevação de pernas controlada.' },
  { id: 'ex-prancha', name: 'Prancha Abdominal', category: 'Abdômen', description: 'Se incomodar o ombro, substituir pelo Inseto Morto (Dead Bug).' }
];

export const WORKOUT_TEMPLATES: WorkoutSession[] = [
  {
    id: 'workout-a',
    name: 'Treino A - Empurre',
    isCompleted: false,
    exercises: [
      {
        id: 'we-a1',
        exercise: COMPREHENSIVE_EXERCISES[0], // Manguito
        sets: [
          { id: 'sa1-1', setNumber: 1, weight: 5, reps: 15, isCompleted: false },
          { id: 'sa1-2', setNumber: 2, weight: 5, reps: 15, isCompleted: false }
        ],
        method: '2 séries x 15 repetições',
        interval: '60 segundos',
        loadText: 'Polia Leve (Foco Ativação)'
      },
      {
        id: 'we-a2',
        exercise: COMPREHENSIVE_EXERCISES[1], // Supino Máquina
        sets: [
          { id: 'sa2-1', setNumber: 1, weight: 30, reps: 12, isCompleted: false },
          { id: 'sa2-2', setNumber: 2, weight: 35, reps: 10, isCompleted: false },
          { id: 'sa2-3', setNumber: 3, weight: 40, reps: 10, isCompleted: false }
        ],
        method: '3 séries x 10-12 repetições',
        interval: '90 segundos',
        loadText: 'Placas (Moderada/Alta)'
      },
      {
        id: 'we-a3',
        exercise: COMPREHENSIVE_EXERCISES[2], // Crucifixo reto halteres
        sets: [
          { id: 'sa3-1', setNumber: 1, weight: 12, reps: 12, isCompleted: false },
          { id: 'sa3-2', setNumber: 2, weight: 14, reps: 12, isCompleted: false },
          { id: 'sa3-3', setNumber: 3, weight: 14, reps: 12, isCompleted: false }
        ],
        method: '3 séries x 12 repetições',
        interval: '90 segundos',
        loadText: 'Halteres (Movimento Controlado)'
      },
      {
        id: 'we-a4',
        exercise: COMPREHENSIVE_EXERCISES[3], // Elevação lateral
        sets: [
          { id: 'sa4-1', setNumber: 1, weight: 8, reps: 15, isCompleted: false },
          { id: 'sa4-2', setNumber: 2, weight: 10, reps: 12, isCompleted: false },
          { id: 'sa4-3', setNumber: 3, weight: 10, reps: 12, isCompleted: false }
        ],
        method: '3 séries x 12-15 repetições',
        interval: '60 segundos',
        loadText: 'Halteres/Polia (Carga Moderada)'
      },
      {
        id: 'we-a5',
        exercise: COMPREHENSIVE_EXERCISES[4], // Tríceps Corda
        sets: [
          { id: 'sa5-1', setNumber: 1, weight: 15, reps: 12, isCompleted: false },
          { id: 'sa5-2', setNumber: 2, weight: 20, reps: 12, isCompleted: false },
          { id: 'sa5-3', setNumber: 3, weight: 20, reps: 12, isCompleted: false },
          { id: 'sa5-4', setNumber: 4, weight: 25, reps: 12, isCompleted: false }
        ],
        method: '4 séries x 12 repetições',
        interval: '60 segundos',
        loadText: 'Polia (Foco Biomecânico)'
      },
      {
        id: 'we-a6',
        exercise: COMPREHENSIVE_EXERCISES[5], // Tríceps Coice
        sets: [
          { id: 'sa6-1', setNumber: 1, weight: 7, reps: 12, isCompleted: false },
          { id: 'sa6-2', setNumber: 2, weight: 7, reps: 12, isCompleted: false },
          { id: 'sa6-3', setNumber: 3, weight: 9, reps: 12, isCompleted: false }
        ],
        method: '3 séries x 12 repetições',
        interval: '60 segundos',
        loadText: 'Cabo ou Halter'
      },
      {
        id: 'we-a7',
        exercise: COMPREHENSIVE_EXERCISES[6], // Abdominal supra
        sets: [
          { id: 'sa7-1', setNumber: 1, weight: 0, reps: 20, isCompleted: false },
          { id: 'sa7-2', setNumber: 2, weight: 0, reps: 18, isCompleted: false },
          { id: 'sa7-3', setNumber: 3, weight: 0, reps: 15, isCompleted: false }
        ],
        method: '3 séries x 15-20 repetições',
        interval: '60 segundos',
        loadText: 'Peso Corporal / Solo'
      }
    ]
  },
  {
    id: 'workout-b',
    name: 'Treino B - Puxe',
    isCompleted: false,
    exercises: [
      {
        id: 'we-b1',
        exercise: COMPREHENSIVE_EXERCISES[0], // Manguito
        sets: [
          { id: 'sb1-1', setNumber: 1, weight: 5, reps: 15, isCompleted: false },
          { id: 'sb1-2', setNumber: 2, weight: 5, reps: 15, isCompleted: false }
        ],
        method: '2 séries x 15 repetições',
        interval: '60 segundos',
        loadText: 'Polia Leve (Foco Ativação)'
      },
      {
        id: 'we-b2',
        exercise: COMPREHENSIVE_EXERCISES[7], // Puxada alta
        sets: [
          { id: 'sb2-1', setNumber: 1, weight: 40, reps: 12, isCompleted: false },
          { id: 'sb2-2', setNumber: 2, weight: 45, reps: 10, isCompleted: false },
          { id: 'sb2-3', setNumber: 3, weight: 50, reps: 10, isCompleted: false }
        ],
        method: '3 séries x 10-12 repetições',
        interval: '90 segundos',
        loadText: 'Placas (Lat Pulldown)'
      },
      {
        id: 'we-b3',
        exercise: COMPREHENSIVE_EXERCISES[8], // Remada baixa sentada
        sets: [
          { id: 'sb3-1', setNumber: 1, weight: 35, reps: 12, isCompleted: false },
          { id: 'sb3-2', setNumber: 2, weight: 40, reps: 12, isCompleted: false },
          { id: 'sb3-3', setNumber: 3, weight: 45, reps: 12, isCompleted: false }
        ],
        method: '3 séries x 12 repetições',
        interval: '90 segundos',
        loadText: 'Triângulo (Esmagar Escápulas)'
      },
      {
        id: 'we-b4',
        exercise: COMPREHENSIVE_EXERCISES[9], // Crucifixo inverso
        sets: [
          { id: 'sb4-1', setNumber: 1, weight: 25, reps: 15, isCompleted: false },
          { id: 'sb4-2', setNumber: 2, weight: 30, reps: 15, isCompleted: false },
          { id: 'sb4-3', setNumber: 3, weight: 30, reps: 15, isCompleted: false }
        ],
        method: '3 séries x 15 repetições',
        interval: '60 segundos',
        loadText: 'Máquina'
      },
      {
        id: 'we-b5',
        exercise: COMPREHENSIVE_EXERCISES[10], // Encolhimento com halteres
        sets: [
          { id: 'sb5-1', setNumber: 1, weight: 16, reps: 15, isCompleted: false },
          { id: 'sb5-2', setNumber: 2, weight: 18, reps: 12, isCompleted: false },
          { id: 'sb5-3', setNumber: 3, weight: 20, reps: 12, isCompleted: false },
          { id: 'sb5-4', setNumber: 4, weight: 20, reps: 12, isCompleted: false }
        ],
        method: '4 séries x 12-15 repetições',
        interval: '60 segundos',
        loadText: 'Halteres'
      },
      {
        id: 'we-b6',
        exercise: COMPREHENSIVE_EXERCISES[11], // Rosca direta W
        sets: [
          { id: 'sb6-1', setNumber: 1, weight: 14, reps: 12, isCompleted: false },
          { id: 'sb6-2', setNumber: 2, weight: 18, reps: 10, isCompleted: false },
          { id: 'sb6-3', setNumber: 3, weight: 18, reps: 10, isCompleted: false }
        ],
        method: '3 séries x 10-12 repetições',
        interval: '60 segundos',
        loadText: 'Barra W'
      },
      {
        id: 'we-b7',
        exercise: COMPREHENSIVE_EXERCISES[12], // Rosca Martelo
        sets: [
          { id: 'sb7-1', setNumber: 1, weight: 10, reps: 12, isCompleted: false },
          { id: 'sb7-2', setNumber: 2, weight: 12, reps: 12, isCompleted: false },
          { id: 'sb7-3', setNumber: 3, weight: 12, reps: 12, isCompleted: false }
        ],
        method: '3 séries x 12 repetições',
        interval: '60 segundos',
        loadText: 'Halteres (Pegada Neutra)'
      }
    ]
  },
  {
    id: 'workout-c',
    name: 'Treino C - Pernas e Core',
    isCompleted: false,
    exercises: [
      {
        id: 'we-c1',
        exercise: COMPREHENSIVE_EXERCISES[13], // Leg Press
        sets: [
          { id: 'sc1-1', setNumber: 1, weight: 120, reps: 12, isCompleted: false },
          { id: 'sc1-2', setNumber: 2, weight: 140, reps: 12, isCompleted: false },
          { id: 'sc1-3', setNumber: 3, weight: 160, reps: 10, isCompleted: false },
          { id: 'sc1-4', setNumber: 4, weight: 180, reps: 10, isCompleted: false }
        ],
        method: '4 séries x 10-12 repetições',
        interval: '90 segundos',
        loadText: '45º ou Horizontal'
      },
      {
        id: 'we-c2',
        exercise: COMPREHENSIVE_EXERCISES[14], // Cadeira extensora
        sets: [
          { id: 'sc2-1', setNumber: 1, weight: 30, reps: 15, isCompleted: false },
          { id: 'sc2-2', setNumber: 2, weight: 35, reps: 12, isCompleted: false },
          { id: 'sc2-3', setNumber: 3, weight: 40, reps: 12, isCompleted: false }
        ],
        method: '3 séries x 12-15 repetições',
        interval: '60 segundos',
        loadText: 'Placas (Fase Excêntrica)'
      },
      {
        id: 'we-c3',
        exercise: COMPREHENSIVE_EXERCISES[15], // Mesa ou Cadeira flexora
        sets: [
          { id: 'sc3-1', setNumber: 1, weight: 25, reps: 12, isCompleted: false },
          { id: 'sc3-2', setNumber: 2, weight: 30, reps: 12, isCompleted: false },
          { id: 'sc3-3', setNumber: 3, weight: 30, reps: 12, isCompleted: false }
        ],
        method: '3 séries x 12 repetições',
        interval: '60 segundos',
        loadText: 'Placas (Posterior Coisa)'
      },
      {
        id: 'we-c4',
        exercise: COMPREHENSIVE_EXERCISES[16], // Panturrilha
        sets: [
          { id: 'sc4-1', setNumber: 1, weight: 20, reps: 15, isCompleted: false },
          { id: 'sc4-2', setNumber: 2, weight: 25, reps: 15, isCompleted: false },
          { id: 'sc4-3', setNumber: 3, weight: 30, reps: 15, isCompleted: false },
          { id: 'sc4-4', setNumber: 4, weight: 30, reps: 15, isCompleted: false }
        ],
        method: '4 séries x 15 repetições',
        interval: '60 segundos',
        loadText: 'Cavalinho (Sentado)'
      },
      {
        id: 'we-c5',
        exercise: COMPREHENSIVE_EXERCISES[17], // Abdominal infra
        sets: [
          { id: 'sc5-1', setNumber: 1, weight: 0, reps: 15, isCompleted: false },
          { id: 'sc5-2', setNumber: 2, weight: 0, reps: 12, isCompleted: false },
          { id: 'sc5-3', setNumber: 3, weight: 0, reps: 12, isCompleted: false }
        ],
        method: '3 séries x 12-15 repetições',
        interval: '60 segundos',
        loadText: 'Peso Corporal (Solo)'
      },
      {
        id: 'we-c6',
        exercise: COMPREHENSIVE_EXERCISES[18], // Prancha abdominal
        sets: [
          { id: 'sc6-1', setNumber: 1, weight: 0, reps: 45, isCompleted: false },
          { id: 'sc6-2', setNumber: 2, weight: 0, reps: 45, isCompleted: false },
          { id: 'sc6-3', setNumber: 3, weight: 0, reps: 60, isCompleted: false }
        ],
        method: '3 séries x 45-60 segundos',
        interval: '60 segundos',
        loadText: 'Sustentação Estática'
      }
    ]
  }
];

export const MOCK_USER_PROFILE: UserProfile = {
  name: 'Henrique Lúcio da Costa',
  avatarUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200',
  level: 'Intermediário',
  gender: 'male',
  streakDays: 4,
  height: 180,
  currentWeight: 81.2,
  weightHistory: [
    { date: 'Mar', weight: 83.5 },
    { date: 'Abr', weight: 82.8 },
    { date: 'Mai', weight: 81.2 }
  ],
  photos: [
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=400'
  ],
  reminders: [
    { id: 'rem-1', dayOfWeek: 'Segunda', time: '18:30', label: 'Esmagar Peito (Treino A)', isActive: true },
    { id: 'rem-2', dayOfWeek: 'Quarta', time: '19:00', label: 'Foco em Costas (Treino B)', isActive: true },
    { id: 'rem-3', dayOfWeek: 'Sexta', time: '18:00', label: 'Leg Day Hardcore (Treino C)', isActive: true }
  ]
};

export const MOCK_WORKOUT_HISTORY: HistorySession[] = [
  {
    id: 'h1',
    name: 'Treino A - Empurre',
    completedAt: '2026-05-18T19:30:00Z',
    durationMinutes: 52,
    totalSets: 21,
    totalWeightVolume: 1280
  },
  {
    id: 'h2',
    name: 'Treino C - Pernas e Core',
    completedAt: '2026-05-16T18:15:00Z',
    durationMinutes: 48,
    totalSets: 20,
    totalWeightVolume: 1950
  },
  {
    id: 'h3',
    name: 'Treino B - Puxe',
    completedAt: '2026-05-15T20:00:00Z',
    durationMinutes: 55,
    totalSets: 21,
    totalWeightVolume: 1410
  }
];
