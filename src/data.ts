import { Exercise, WorkoutSession, UserProfile, HistorySession } from './types';

export const COMPREHENSIVE_EXERCISES: Exercise[] = [
  // Treino A - Empurre
  { id: 'ex-manguito', name: 'Aquecimento: Manguito Rotador na Polia', category: 'Ombros', description: 'Foco em ativação leve dos rotadores.' },
  { id: 'ex-supino-maq', name: 'Supino na Máquina (ou Articulado)', category: 'Peito', description: 'Proteger ombro, manter o movimento controlado.' },
  { id: 'ex-crucifixo-reto', name: 'Crucifixo Reto com Halteres', category: 'Peito', description: 'Não descer os halteres além do tronco.' },
  { id: 'ex-elevacao-lat', name: 'Elevação Lateral (Halteres ou Polia)', category: 'Ombros', description: 'Braços levemente à frente (no plano escapular).' },
  { id: 'ex-triceps-corda', name: 'Tríceps Corda na Polia', category: 'Braços', description: 'Extensão máxima mantendo os cotovelos fixos.' },
  { id: 'ex-triceps-coice', name: 'Tríceps Coice (Cabo ou Halter)', category: 'Braços', description: 'Controle bem a fase de retorno do peso.' },
  { id: 'ex-abdominal-supra', name: 'Abdominal Supra (Solo ou Máquina)', category: 'Abdômen', description: 'Contrair bem o abdômen no pico do movimento.' },

  // Treino B - Puxe
  { id: 'ex-puxada-alta', name: 'Puxada Alta (Lat Pulldown)', category: 'Costas', description: 'Puxar em direção ao peito (nunca por trás da cabeça).' },
  { id: 'ex-remada-baixa', name: 'Remada Baixa Sentada (Triângulo)', category: 'Costas', description: 'Esmagar as escápulas, mantendo o peito estufado.' },
  { id: 'ex-crucifixo-inv', name: 'Crucifixo Inverso na Máquina', category: 'Ombros', description: 'Fortalecimento essencial para a porção posterior do ombro.' },
  { id: 'ex-encolhimento', name: 'Encolhimento com Halteres (Trapézio)', category: 'Costas', description: 'Subir e descer controlado, SEM girar os ombros.' },
  { id: 'ex-rosca-direta-w', name: 'Rosca Direta com Barra W', category: 'Braços', description: 'Mais anatômica para punhos e cotovelos.' },
  { id: 'ex-rosca-martelo', name: 'Rosca Martelo', category: 'Braços', description: 'Pegada neutra para trabalhar braquiorradial e bíceps.' },

  // Treino C - Pernas e Core
  { id: 'ex-leg-press', name: 'Leg Press 45° ou Horizontal', category: 'Pernas', description: 'Empurrar com o meio do pé/calcanhar.' },
  { id: 'ex-extensora', name: 'Cadeira Extensora', category: 'Pernas', description: 'Controlar bem a descida (fase excêntrica).' },
  { id: 'ex-flexora', name: 'Mesa ou Cadeira Flexora', category: 'Pernas', description: 'Foco no isolamento de posteriores de coxa.' },
  { id: 'ex-panturrilha-cavalinho', name: 'Panturrilha Sentado (Cavalinho)', category: 'Pernas', description: 'Realizar alongamento completo e contração máxima.' },
  { id: 'ex-abdominal-infra', name: 'Abdominal Infra (Solo)', category: 'Abdômen', description: 'Elevação de pernas controlada sem balançar o quadril.' },
  { id: 'ex-prancha', name: 'Prancha Abdominal', category: 'Abdômen', description: 'Se incomodar o ombro, substituir pelo Abdominal Infra.' },

  // Treino de Alana Souza Adh
  { id: 'ex-alana-abd-infra-solo', name: 'Abdomen infra no solo', category: 'Abdômen', description: 'Elevação de pernas deitada no colchonete.', gifUrl: 'https://raw.githubusercontent.com/hollyood-caribe/tatugym/main/gifs/abdomen-infra-solo.gif' },
  { id: 'ex-alana-abd-infra-banco', name: 'Abdomen Infra no Banco', category: 'Abdômen', description: 'Elevação de pernas com apoio lombar inclinado.', gifUrl: 'https://raw.githubusercontent.com/hollyood-caribe/tatugym/main/gifs/abdomen-infra-banco.gif' },
  { id: 'ex-alana-supino-inc', name: 'Supino Inclinado', category: 'Peito', description: 'Ativação das fibras claviculares do peitoral.', gifUrl: 'https://raw.githubusercontent.com/hollyood-caribe/tatugym/main/gifs/supino-inclinado.gif' },
  { id: 'ex-alana-crucifixo-adutor', name: 'Crucifixo Adutor na Polia', category: 'Peito', description: 'Cruzamento de cabos focado em miolo de peito.', gifUrl: 'https://raw.githubusercontent.com/hollyood-caribe/tatugym/main/gifs/crucifixo-adutor.gif' },
  { id: 'ex-alana-triceps-testa', name: 'Tríceps Testa', category: 'Braços', description: 'Extensão de cotovelos deitada com halteres.', gifUrl: 'https://raw.githubusercontent.com/hollyood-caribe/tatugym/main/gifs/triceps-testa.gif' },
  { id: 'ex-alana-triceps-mergulho', name: 'Tríceps Mergulho', category: 'Braços', description: 'Mergulho de tríceps em apoio elevado/banco.', gifUrl: 'https://raw.githubusercontent.com/hollyood-caribe/tatugym/main/gifs/triceps-mergulho.gif' }
];

export const WORKOUT_TEMPLATES: WorkoutSession[] = [
  {
    id: 'workout-alana',
    name: 'Ficha Superior e Abdominal Avançado',
    isCompleted: false,
    exercises: [
      {
        id: 'we-al1',
        exercise: { id: 'ex-alana-abd-infra-solo', name: 'Abdomen infra no solo', category: 'Abdômen', description: 'Elevação de pernas deitada no colchonete.' },
        sets: [
          { id: 'sal1-1', setNumber: 1, weight: 0, reps: 10, isCompleted: false },
          { id: 'sal1-2', setNumber: 2, weight: 0, reps: 10, isCompleted: false },
          { id: 'sal1-3', setNumber: 3, weight: 0, reps: 10, isCompleted: false }
        ],
        method: 'Rest-pause 3 de 10x',
        interval: 'Intervalo 30',
        loadText: 'Carga Peso Corporal'
      },
      {
        id: 'we-al2',
        exercise: { id: 'ex-alana-abd-infra-banco', name: 'Abdomen Infra no Banco', category: 'Abdômen', description: 'Elevação de pernas com apoio lombar inclinado.' },
        sets: [
          { id: 'sal2-1', setNumber: 1, weight: 0, reps: 10, isCompleted: false },
          { id: 'sal2-2', setNumber: 2, weight: 0, reps: 10, isCompleted: false },
          { id: 'sal2-3', setNumber: 3, weight: 0, reps: 10, isCompleted: false }
        ],
        method: 'Rotina Alta/Baixa 3 de 10',
        interval: 'Intervalo 30',
        loadText: 'Carga Livre'
      },
      {
        id: 'we-al3',
        exercise: { id: 'ex-alana-supino-inc', name: 'Supino Inclinado', category: 'Peito', description: 'Ativação das fibras claviculares do peitoral.' },
        sets: [
          { id: 'sal3-1', setNumber: 1, weight: 30, reps: 10, isCompleted: false },
          { id: 'sal3-2', setNumber: 2, weight: 30, reps: 10, isCompleted: false },
          { id: 'sal3-3', setNumber: 3, weight: 30, reps: 10, isCompleted: false }
        ],
        method: 'Piram. Cresc. 3 de 10x',
        interval: 'Intervalo 40',
        loadText: 'Carga 30kg'
      },
      {
        id: 'we-al4',
        exercise: { id: 'ex-alana-crucifixo-adutor', name: 'Crucifixo Adutor na Polia', category: 'Peito', description: 'Cruzamento de cabos focado em miolo de peito.' },
        sets: [
          { id: 'sal4-1', setNumber: 1, weight: 6, reps: 10, isCompleted: false },
          { id: 'sal4-2', setNumber: 2, weight: 6, reps: 10, isCompleted: false },
          { id: 'sal4-3', setNumber: 3, weight: 6, reps: 10, isCompleted: false }
        ],
        method: 'Bi-set 3 de 10x',
        interval: 'Intervalo 20',
        loadText: 'Carga 6 barras'
      },
      {
        id: 'we-al5',
        exercise: { id: 'ex-alana-triceps-testa', name: 'Tríceps Testa', category: 'Braços', description: 'Extensão de cotovelos deitada com halteres.' },
        sets: [
          { id: 'sal5-1', setNumber: 1, weight: 10, reps: 20, isCompleted: false },
          { id: 'sal5-2', setNumber: 2, weight: 10, reps: 20, isCompleted: false },
          { id: 'sal5-3', setNumber: 3, weight: 10, reps: 20, isCompleted: false }
        ],
        method: 'Piram. Decresc. 3 de 20x',
        interval: 'Intervalo 40',
        loadText: 'Carga 10kg'
      },
      {
        id: 'we-al6',
        exercise: { id: 'ex-alana-triceps-mergulho', name: 'Tríceps Mergulho', category: 'Braços', description: 'Mergulho de tríceps em apoio elevado/banco.' },
        sets: [
          { id: 'sal6-1', setNumber: 1, weight: 0, reps: 12, isCompleted: false },
          { id: 'sal6-2', setNumber: 2, weight: 0, reps: 12, isCompleted: false },
          { id: 'sal6-3', setNumber: 3, weight: 0, reps: 12, isCompleted: false }
        ],
        method: 'Rotina Alta/Baixa 3 de 12',
        interval: 'Intervalo 40',
        loadText: 'Carga Peso Corporal'
      }
    ]
  },
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
        ]
      },
      {
        id: 'we-a2',
        exercise: COMPREHENSIVE_EXERCISES[1], // Supino Máquina
        sets: [
          { id: 'sa2-1', setNumber: 1, weight: 30, reps: 12, isCompleted: false },
          { id: 'sa2-2', setNumber: 2, weight: 35, reps: 10, isCompleted: false },
          { id: 'sa2-3', setNumber: 3, weight: 40, reps: 10, isCompleted: false }
        ]
      },
      {
        id: 'we-a3',
        exercise: COMPREHENSIVE_EXERCISES[2], // Crucifixo reto halteres
        sets: [
          { id: 'sa3-1', setNumber: 1, weight: 12, reps: 12, isCompleted: false },
          { id: 'sa3-2', setNumber: 2, weight: 14, reps: 12, isCompleted: false },
          { id: 'sa3-3', setNumber: 3, weight: 14, reps: 12, isCompleted: false }
        ]
      },
      {
        id: 'we-a4',
        exercise: COMPREHENSIVE_EXERCISES[3], // Elevação lateral
        sets: [
          { id: 'sa4-1', setNumber: 1, weight: 8, reps: 15, isCompleted: false },
          { id: 'sa4-2', setNumber: 2, weight: 10, reps: 12, isCompleted: false },
          { id: 'sa4-3', setNumber: 3, weight: 10, reps: 12, isCompleted: false }
        ]
      },
      {
        id: 'we-a5',
        exercise: COMPREHENSIVE_EXERCISES[4], // Tríceps Corda
        sets: [
          { id: 'sa5-1', setNumber: 1, weight: 15, reps: 12, isCompleted: false },
          { id: 'sa5-2', setNumber: 2, weight: 20, reps: 12, isCompleted: false },
          { id: 'sa5-3', setNumber: 3, weight: 20, reps: 12, isCompleted: false },
          { id: 'sa5-4', setNumber: 4, weight: 25, reps: 12, isCompleted: false }
        ]
      },
      {
        id: 'we-a6',
        exercise: COMPREHENSIVE_EXERCISES[5], // Tríceps Coice
        sets: [
          { id: 'sa6-1', setNumber: 1, weight: 7, reps: 12, isCompleted: false },
          { id: 'sa6-2', setNumber: 2, weight: 7, reps: 12, isCompleted: false },
          { id: 'sa6-3', setNumber: 3, weight: 9, reps: 12, isCompleted: false }
        ]
      },
      {
        id: 'we-a7',
        exercise: COMPREHENSIVE_EXERCISES[6], // Abdominal supra
        sets: [
          { id: 'sa7-1', setNumber: 1, weight: 0, reps: 20, isCompleted: false },
          { id: 'sa7-2', setNumber: 2, weight: 0, reps: 18, isCompleted: false },
          { id: 'sa7-3', setNumber: 3, weight: 0, reps: 15, isCompleted: false }
        ]
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
        exercise: COMPREHENSIVE_EXERCISES[0], // Manguito (também no aquecimento do B)
        sets: [
          { id: 'sb2-1', setNumber: 1, weight: 5, reps: 15, isCompleted: false },
          { id: 'sb2-2', setNumber: 2, weight: 5, reps: 15, isCompleted: false }
        ]
      },
      {
        id: 'we-b2',
        exercise: COMPREHENSIVE_EXERCISES[7], // Puxada alta
        sets: [
          { id: 'sb3-1', setNumber: 1, weight: 40, reps: 12, isCompleted: false },
          { id: 'sb3-2', setNumber: 2, weight: 45, reps: 10, isCompleted: false },
          { id: 'sb3-3', setNumber: 3, weight: 50, reps: 10, isCompleted: false }
        ]
      },
      {
        id: 'we-b3',
        exercise: COMPREHENSIVE_EXERCISES[8], // Remada baixa sentada
        sets: [
          { id: 'sb4-1', setNumber: 1, weight: 35, reps: 12, isCompleted: false },
          { id: 'sb4-2', setNumber: 2, weight: 40, reps: 12, isCompleted: false },
          { id: 'sb4-3', setNumber: 3, weight: 45, reps: 12, isCompleted: false }
        ]
      },
      {
        id: 'we-b4',
        exercise: COMPREHENSIVE_EXERCISES[9], // Crucifixo inverso
        sets: [
          { id: 'sb5-1', setNumber: 1, weight: 25, reps: 15, isCompleted: false },
          { id: 'sb5-2', setNumber: 2, weight: 30, reps: 15, isCompleted: false },
          { id: 'sb5-3', setNumber: 3, weight: 30, reps: 15, isCompleted: false }
        ]
      },
      {
        id: 'we-b5',
        exercise: COMPREHENSIVE_EXERCISES[10], // Encolhimento com halteres
        sets: [
          { id: 'sb6-1', setNumber: 1, weight: 16, reps: 15, isCompleted: false },
          { id: 'sb6-2', setNumber: 2, weight: 18, reps: 12, isCompleted: false },
          { id: 'sb6-3', setNumber: 3, weight: 20, reps: 12, isCompleted: false },
          { id: 'sb6-4', setNumber: 4, weight: 20, reps: 12, isCompleted: false }
        ]
      },
      {
        id: 'we-b6',
        exercise: COMPREHENSIVE_EXERCISES[11], // Rosca direta W
        sets: [
          { id: 'sb7-1', setNumber: 1, weight: 14, reps: 12, isCompleted: false },
          { id: 'sb7-2', setNumber: 2, weight: 18, reps: 10, isCompleted: false },
          { id: 'sb7-3', setNumber: 3, weight: 18, reps: 10, isCompleted: false }
        ]
      },
      {
        id: 'we-b7',
        exercise: COMPREHENSIVE_EXERCISES[12], // Rosca Martelo
        sets: [
          { id: 'sb8-1', setNumber: 1, weight: 10, reps: 12, isCompleted: false },
          { id: 'sb8-2', setNumber: 2, weight: 12, reps: 12, isCompleted: false },
          { id: 'sb8-3', setNumber: 3, weight: 12, reps: 12, isCompleted: false }
        ]
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
        exercise: COMPREHENSIVE_EXERCISES[13], // Leg press 45
        sets: [
          { id: 'sc1-1', setNumber: 1, weight: 120, reps: 12, isCompleted: false },
          { id: 'sc1-2', setNumber: 2, weight: 140, reps: 12, isCompleted: false },
          { id: 'sc1-3', setNumber: 3, weight: 160, reps: 10, isCompleted: false },
          { id: 'sc1-4', setNumber: 4, weight: 180, reps: 10, isCompleted: false }
        ]
      },
      {
        id: 'we-c2',
        exercise: COMPREHENSIVE_EXERCISES[14], // Cadeira extensora
        sets: [
          { id: 'sc2-1', setNumber: 1, weight: 30, reps: 15, isCompleted: false },
          { id: 'sc2-2', setNumber: 2, weight: 35, reps: 12, isCompleted: false },
          { id: 'sc2-3', setNumber: 3, weight: 40, reps: 12, isCompleted: false }
        ]
      },
      {
        id: 'we-c3',
        exercise: COMPREHENSIVE_EXERCISES[15], // Mesa ou Cadeira flexora
        sets: [
          { id: 'sc3-1', setNumber: 1, weight: 25, reps: 12, isCompleted: false },
          { id: 'sc3-2', setNumber: 2, weight: 30, reps: 12, isCompleted: false },
          { id: 'sc3-3', setNumber: 3, weight: 30, reps: 12, isCompleted: false }
        ]
      },
      {
        id: 'we-c4',
        exercise: COMPREHENSIVE_EXERCISES[16], // Panturrilha cavalinho
        sets: [
          { id: 'sc4-1', setNumber: 1, weight: 20, reps: 15, isCompleted: false },
          { id: 'sc4-2', setNumber: 2, weight: 25, reps: 15, isCompleted: false },
          { id: 'sc4-3', setNumber: 3, weight: 30, reps: 15, isCompleted: false },
          { id: 'sc4-4', setNumber: 4, weight: 30, reps: 15, isCompleted: false }
        ]
      },
      {
        id: 'we-c5',
        exercise: COMPREHENSIVE_EXERCISES[17], // Abdominal infra
        sets: [
          { id: 'sc5-1', setNumber: 1, weight: 0, reps: 15, isCompleted: false },
          { id: 'sc5-2', setNumber: 2, weight: 0, reps: 12, isCompleted: false },
          { id: 'sc5-3', setNumber: 3, weight: 0, reps: 12, isCompleted: false }
        ]
      },
      {
        id: 'we-c6',
        exercise: COMPREHENSIVE_EXERCISES[18], // Prancha abdominal
        sets: [
          // Using reps as seconds for visualization in tables
          { id: 'sc6-1', setNumber: 1, weight: 0, reps: 45, isCompleted: false },
          { id: 'sc6-2', setNumber: 2, weight: 0, reps: 45, isCompleted: false },
          { id: 'sc6-3', setNumber: 3, weight: 0, reps: 60, isCompleted: false }
        ]
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
