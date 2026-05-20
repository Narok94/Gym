import React, { useState } from 'react';
import { Play, Pause, RefreshCw, Sparkles, Flame, CheckCircle2, Dumbbell } from 'lucide-react';
import { Exercise } from '../types';

interface ExerciseGifPlayerProps {
  exercise: Exercise;
}

// Map each exercise to its specific instructional visual illustration, GIF, biomechanical metrics, and interactive muscle activations.
export const EXERCISE_VISUALS_MAP: Record<string, {
  gifUrl: string;
  fallbackColor: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  tempo: string;
  tempoSteps: { phase: string; duration: string; description: string }[];
  biomechanics: string;
  muscleActivationIndex: number; // 0 to 100 representing intensity
}> = {
  'ex-manguito': {
    gifUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a25f1?q=80&w=400&auto=format&fit=crop', // fallbacks
    fallbackColor: 'from-amber-500/10 to-transparent',
    primaryMuscles: ['Manguito Rotador', 'Infraespinhal'],
    secondaryMuscles: ['Deltoide Posterior', 'Redondo Menor'],
    tempo: '3-0-2-1',
    tempoSteps: [
      { phase: 'Excêntrica (Retorno)', duration: '3s', description: 'Controlar retorno em direção ao abdômen.' },
      { phase: 'Isométrica (Pico)', duration: '0s', description: 'Sem pausa no ponto inicial.' },
      { phase: 'Concêntrica (Puxada)', duration: '2s', description: 'Afastar o antebraço do corpo rotacionando o ombro.' },
      { phase: 'Isométrica (Contração)', duration: '1s', description: 'Sustentar o manguito encurtado ao final.' }
    ],
    biomechanics: 'Rotação externa de ombro na polia com cotovelo flexionado a 90º.',
    muscleActivationIndex: 75,
  },
  'ex-supino-maq': {
    gifUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400&auto=format&fit=crop',
    fallbackColor: 'from-red-500/10 to-transparent',
    primaryMuscles: ['Peitoral Maior', 'Tríceps Braquial'],
    secondaryMuscles: ['Deltoide Anterior'],
    tempo: '3-1-2-0',
    tempoSteps: [
      { phase: 'Excêntrica (Descida)', duration: '3s', description: 'Descer o peso devagar abrindo o peitoral.' },
      { phase: 'Isométrica (Alongamento)', duration: '1s', description: 'Pausa breve sem encostar as placas.' },
      { phase: 'Concêntrica (Subida)', duration: '2s', description: 'Explodir empurrando a máquina à frente.' },
      { phase: 'Isométrica (Contraído)', duration: '0s', description: 'Não travar os cotovelos na extensão total.' }
    ],
    biomechanics: 'Adução horizontal do braço com flexão anterior de ombro.',
    muscleActivationIndex: 94,
  },
  'ex-crucifixo-reto': {
    gifUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400&auto=format&fit=crop',
    fallbackColor: 'from-red-400/10 to-transparent',
    primaryMuscles: ['Peitoral Maior (Porção Esternal)'],
    secondaryMuscles: ['Deltoide Anterior', 'Bíceps (Cabeça Curta)'],
    tempo: '4-1-2-0',
    tempoSteps: [
      { phase: 'Excêntrica (Abertura)', duration: '4s', description: 'Abrir os braços em arco mantendo cotovelos semi-flexionados.' },
      { phase: 'Isométrica (Alongamento)', duration: '1s', description: 'Máximo alongamento das fibras do peito.' },
      { phase: 'Concêntrica (Fechamento)', duration: '2s', description: 'Trazer os halteres de volta ao centro mantendo o mesmo arco.' },
      { phase: 'Isométrica (Contraído)', duration: '0s', description: 'Aproveitar a contração máxima no alto.' }
    ],
    biomechanics: 'Isolamento estrito de adução de ombros sem assistência do tríceps.',
    muscleActivationIndex: 88,
  },
  'ex-elevacao-lat': {
    gifUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=400&auto=format&fit=crop',
    fallbackColor: 'from-blue-500/10 to-transparent',
    primaryMuscles: ['Deltoide Lateral'],
    secondaryMuscles: ['Trapézio Superior', 'Deltoide Anterior'],
    tempo: '3-1-2-1',
    tempoSteps: [
      { phase: 'Excêntrica (Descida)', duration: '3s', description: 'Descer segurando o peso até as laterais da coxa.' },
      { phase: 'Isométrica (Baixo)', duration: '1s', description: 'Evitar pegar balanço para a próxima repetição.' },
      { phase: 'Concêntrica (Elevação)', duration: '2s', description: 'Subir os halteres lateralmente projetando os cotovelos.' },
      { phase: 'Isométrica (Pico)', duration: '1s', description: 'Pausa no topo com cotovelos alinhados ao ombro.' }
    ],
    biomechanics: 'Abdução do braço no plano escapular (aproximadamente 30º à frente).',
    muscleActivationIndex: 90,
  },
  'ex-triceps-corda': {
    gifUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400&auto=format&fit=crop',
    fallbackColor: 'from-cyan-500/10 to-transparent',
    primaryMuscles: ['Tríceps (Cabeça Lateral e Medial)'],
    secondaryMuscles: ['Ancôneo', 'Pronador Redondo'],
    tempo: '3-0-2-1',
    tempoSteps: [
      { phase: 'Excêntrica (Subida)', duration: '3s', description: 'Deixar as mãos subirem suavemente dobrando o cotovelo.' },
      { phase: 'Isométrica (Topo)', duration: '0s', description: 'Não deixar os cotovelos se moverem para frente.' },
      { phase: 'Concêntrica (Extensão)', duration: '2s', description: 'Estender os braços abrindo a ponta da corda embaixo.' },
      { phase: 'Isométrica (Pico)', duration: '1s', description: 'Esmagar o tríceps com os braços totalmente estendidos.' }
    ],
    biomechanics: 'Extensão dos cotovelos na polia alta com pegada neutra.',
    muscleActivationIndex: 85,
  },
  'ex-triceps-coice': {
    gifUrl: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=400&auto=format&fit=crop',
    fallbackColor: 'from-cyan-400/10 to-transparent',
    primaryMuscles: ['Tríceps (Cabeça Longa)'],
    secondaryMuscles: ['Deltoide Posterior', 'Grande Dorsal'],
    tempo: '3-0-2-2',
    tempoSteps: [
      { phase: 'Excêntrica (Retorno)', duration: '3s', description: 'Voltar o antebraço devagar até o ângulo de 90 graus.' },
      { phase: 'Isométrica (Frente)', duration: '0s', description: 'Manter a porção superior do braço paralela ao solo.' },
      { phase: 'Concêntrica (Chute)', duration: '2s', description: 'Chutar para trás elevando o peso pela contração do tríceps.' },
      { phase: 'Isométrica (Pico)', duration: '2s', description: 'Sustentar o peso no ponto mais alto contra a gravidade.' }
    ],
    biomechanics: 'Extensão de cotovelo com o ombro em leve extensão estática.',
    muscleActivationIndex: 82,
  },
  'ex-abdominal-supra': {
    gifUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop',
    fallbackColor: 'from-emerald-500/10 to-transparent',
    primaryMuscles: ['Reto do Abdômen', 'Oblíquo Externo'],
    secondaryMuscles: ['Reto Femoral', 'Piramidal'],
    tempo: '3-0-2-1',
    tempoSteps: [
      { phase: 'Excêntrica (Descida)', duration: '3s', description: 'Descer o tronco sem relaxar as costas no colchonete.' },
      { phase: 'Isométrica (Chão)', duration: '0s', description: 'Manter a tensão abdominal contínua.' },
      { phase: 'Concêntrica (Subida)', duration: '2s', description: 'Retirar as escápulas do chão soprando o ar para fora.' },
      { phase: 'Isométrica (Pico)', duration: '1s', description: 'Squeeze firme no abdômen no ponto de contração máxima.' }
    ],
    biomechanics: 'Flexão torácica da coluna vertebral contra resistência.',
    muscleActivationIndex: 89,
  },
  'ex-puxada-alta': {
    gifUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop',
    fallbackColor: 'from-indigo-500/10 to-transparent',
    primaryMuscles: ['Grande Dorsal (Lats)', 'Bíceps Braquial'],
    secondaryMuscles: ['Redondo Maior', 'Braquial', 'Trapézio Médio/Inferior'],
    tempo: '3-1-2-1',
    tempoSteps: [
      { phase: 'Excêntrica (Retorno)', duration: '3s', description: 'Deixar a barra subir controlando o peso, alongando as costas.' },
      { phase: 'Isométrica (Alto)', duration: '1s', description: 'Alongamento máximo dos lats sob tensão protetora.' },
      { phase: 'Concêntrica (Puxada)', duration: '2s', description: 'Puxar a barra em direção à clavícula trazendo cotovelos para baixo.' },
      { phase: 'Isométrica (Pico)', duration: '1s', description: 'Esmagar as escápulas retendo a barra perto do queixo.' }
    ],
    biomechanics: 'Adução e extensão dos ombros combinada com flexão de cotovelos.',
    muscleActivationIndex: 93,
  },
  'ex-remada-baixa': {
    gifUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a25f1?q=80&w=400&auto=format&fit=crop',
    fallbackColor: 'from-indigo-400/15 to-transparent',
    primaryMuscles: ['Grande Dorsal', 'Trapézio Médio/Inferior'],
    secondaryMuscles: ['Romboides', 'Deltoide Posterior', 'Bíceps'],
    tempo: '3-0-2-1',
    tempoSteps: [
      { phase: 'Excêntrica (Retorno)', duration: '3s', description: 'Estender os braços projetando o tronco levemente à frente.' },
      { phase: 'Isométrica (Frente)', duration: '0s', description: 'Evitar soltar totalmente os ombros.' },
      { phase: 'Concêntrica (Puxada)', duration: '2s', description: 'Puxar o triângulo rente à cintura abrindo o peito.' },
      { phase: 'Isométrica (Pico)', duration: '1s', description: 'Unir as escápulas com máxima força no ponto de contato.' }
    ],
    biomechanics: 'Extensão de ombro horizontal combinada com adução escapular.',
    muscleActivationIndex: 91,
  },
  'ex-crucifixo-inv': {
    gifUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop',
    fallbackColor: 'from-purple-500/10 to-transparent',
    primaryMuscles: ['Deltoide Posterior', 'Romboides'],
    secondaryMuscles: ['Trapézio (Porção Média)', 'Infraespinhal'],
    tempo: '3-0-2-1',
    tempoSteps: [
      { phase: 'Excêntrica (Retorno)', duration: '3s', description: 'Fechar os braços controlando o retorno das placas.' },
      { phase: 'Isométrica (Frente)', duration: '0s', description: 'Parar antes das placas colidirem.' },
      { phase: 'Concêntrica (Abertura)', duration: '2s', description: 'Abrir os braços para as laterais guiado pelos cotovelos.' },
      { phase: 'Isométrica (Pico)', duration: '1s', description: 'Pausa isométrica mantendo ombros encaixados.' }
    ],
    biomechanics: 'Abdução horizontal do ombro com mínimo envolvimento de braços.',
    muscleActivationIndex: 86,
  },
  'ex-encolhimento': {
    gifUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop',
    fallbackColor: 'from-purple-400/10 to-transparent',
    primaryMuscles: ['Trapézio (Porção Superior)'],
    secondaryMuscles: ['Levantador da Escápula', 'Antebraço'],
    tempo: '2-1-2-1',
    tempoSteps: [
      { phase: 'Excêntrica (Descida)', duration: '2s', description: 'Descer os ombros verticalmente alongando o trapézio.' },
      { phase: 'Isométrica (Baixo)', duration: '1s', description: 'Alinhamento postural estático neutro.' },
      { phase: 'Concêntrica (Subida)', duration: '2s', description: 'Subir os ombros reto em direção às orelhas.' },
      { phase: 'Isométrica (Anatômica)', duration: '1s', description: 'Esmagar o trapézio sob tensão extrema no topo.' }
    ],
    biomechanics: 'Elevação pura da cintura escapular contrária à gravidade.',
    muscleActivationIndex: 84,
  },
  'ex-rosca-direta-w': {
    gifUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400&auto=format&fit=crop',
    fallbackColor: 'from-pink-500/10 to-transparent',
    primaryMuscles: ['Bíceps Braquial', 'Braquiorradial'],
    secondaryMuscles: ['Braquial Anterior', 'Flexores do Punho'],
    tempo: '3-0-2-1',
    tempoSteps: [
      { phase: 'Excêntrica (Descida)', duration: '3s', description: 'Descer a barra W estendendo os cotovelos de forma controlada.' },
      { phase: 'Isométrica (Baixo)', duration: '0s', description: 'Não relaxar totalmente o braço embaixo.' },
      { phase: 'Concêntrica (Subida)', duration: '2s', description: 'Flexionar os braços erguendo a barra até a altura do peito.' },
      { phase: 'Isométrica (Topo)', duration: '1s', description: 'Contrair e esmagar o bíceps no topo.' }
    ],
    biomechanics: 'Flexão fisiológica do cotovelo com braços em posição semi-supinada.',
    muscleActivationIndex: 92,
  },
  'ex-rosca-martelo': {
    gifUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop',
    fallbackColor: 'from-pink-400/10 to-transparent',
    primaryMuscles: ['Braquiorradial', 'Braquial'],
    secondaryMuscles: ['Bíceps Braquial', 'Extensores do Punho'],
    tempo: '3-0-2-0',
    tempoSteps: [
      { phase: 'Excêntrica (Descida)', duration: '3s', description: 'Descer os halteres mantendo a pegada de martelo (palmas para dentro).' },
      { phase: 'Isométrica (Baixo)', duration: '0s', description: 'Inversão rápida mantendo os cotovelos fixos.' },
      { phase: 'Concêntrica (Subida)', duration: '2s', description: 'Elevar os halteres mantendo a linha vertical estrita.' },
      { phase: 'Isométrica (Contraído)', duration: '0s', description: 'Pico voluntário de ativação do braquiorradial.' }
    ],
    biomechanics: 'Flexão do cotovelo com o antebraço em posição neutra (meio-pronada).',
    muscleActivationIndex: 85,
  },
  'ex-leg-press': {
    gifUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop',
    fallbackColor: 'from-yellow-500/10 to-transparent',
    primaryMuscles: ['Quadríceps Femoral', 'Glúteo Máximo'],
    secondaryMuscles: ['Posteriores de Coxa', 'Gastrocnêmio'],
    tempo: '3-1-2-0',
    tempoSteps: [
      { phase: 'Excêntrica (Descida)', duration: '3s', description: 'Dobrar os joelhos trazendo a plataforma em direção ao peito.' },
      { phase: 'Isométrica (Baixo)', duration: '1s', description: 'Segurar as placas próximas do limite de segurança.' },
      { phase: 'Concêntrica (Empurre)', duration: '2s', description: 'Empurrar com a força de toda a sola do pé no calcanhar.' },
      { phase: 'Isométrica (Estendido)', duration: '0s', description: 'Parar antes de travar o joelho em hiperextensão!' }
    ],
    biomechanics: 'Extensão de quadril de cadeia fechada integrada com extensão de joelhos.',
    muscleActivationIndex: 95,
  },
  'ex-extensora': {
    gifUrl: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?q=80&w=400&auto=format&fit=crop',
    fallbackColor: 'from-yellow-400/10 to-transparent',
    primaryMuscles: ['Quadríceps (Isolado)', 'Reto Femoral'],
    secondaryMuscles: ['Vasto Lateral', 'Vasto Medial'],
    tempo: '3-0-2-2',
    tempoSteps: [
      { phase: 'Excêntrica (Descida)', duration: '3s', description: 'Descer o rolo devagar segurando o peso contra a máquina.' },
      { phase: 'Isométrica (Flexão)', duration: '0s', description: 'Transição suave evitando pancada nas placas.' },
      { phase: 'Concêntrica (Extensão)', duration: '2s', description: 'Chutar para cima com força total até alinhar as pernas.' },
      { phase: 'Isométrica (Pico)', duration: '2s', description: 'Esmagar o quadríceps ao máximo na contração de topo.' }
    ],
    biomechanics: 'Extensão isolada de joelho de cadeia aberta (foco no reto femoral).',
    muscleActivationIndex: 90,
  },
  'ex-flexora': {
    gifUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop',
    fallbackColor: 'from-orange-500/10 to-transparent',
    primaryMuscles: ['Posteriores de Coxa (Bíceps Femoral)'],
    secondaryMuscles: ['Semimembranoso', 'Semitendinoso', 'Gastrocnêmio'],
    tempo: '3-0-2-1',
    tempoSteps: [
      { phase: 'Excêntrica (Retorno)', duration: '3s', description: 'Esticar as pernas de volta controlando bem o impacto gravitacional.' },
      { phase: 'Isométrica (Estreita)', duration: '0s', description: 'Prevenção de hiperlaxitude articular.' },
      { phase: 'Concêntrica (Puxada)', duration: '2s', description: 'Dobrar os joelhos puxando o rolo em direção ao glúteo.' },
      { phase: 'Isométrica (Pico)', duration: '1s', description: 'Contrair e esmagar o posterior por um segundo inteiro.' }
    ],
    biomechanics: 'Flexão isolada de joelhos sob tensão concêntrica contínua.',
    muscleActivationIndex: 88,
  },
  'ex-panturrilha-cavalinho': {
    gifUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400&auto=format&fit=crop',
    fallbackColor: 'from-orange-400/10 to-transparent',
    primaryMuscles: ['Gastrocnêmio', 'Sóleu'],
    secondaryMuscles: ['Tibial Posterior', 'Flexor Longo dos Dedos'],
    tempo: '3-1-2-2',
    tempoSteps: [
      { phase: 'Excêntrica (Descida)', duration: '3s', description: 'Descer os calcanhares abaixo da linha da plataforma alongando a panturrilha.' },
      { phase: 'Isométrica (Baixo)', duration: '1s', description: 'Segurar embaixo para dissipar a energia elástica do tendão.' },
      { phase: 'Concêntrica (Subida)', duration: '2s', description: 'Ficar na ponta dos pés o mais alto possível.' },
      { phase: 'Isométrica (Pico)', duration: '2s', description: 'Esmagar a panturrilha no pico máximo de encurtamento.' }
    ],
    biomechanics: 'Flexão plantar isolada com flexão estática do joelho.',
    muscleActivationIndex: 87,
  },
  'ex-abdominal-infra': {
    gifUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400&auto=format&fit=crop',
    fallbackColor: 'from-emerald-400/10 to-transparent',
    primaryMuscles: ['Reto do Abdômen (Porção Infra)', 'Iliopsoas'],
    secondaryMuscles: ['Reto Femoral', 'Oblíquos'],
    tempo: '3-0-2-0',
    tempoSteps: [
      { phase: 'Excêntrica (Descida)', duration: '3s', description: 'Descer as pernas estendidas até quase tocar o chão.' },
      { phase: 'Isométrica (Baixo)', duration: '0s', description: 'Manter a lombar firmemente apoiada no colchonete.' },
      { phase: 'Concêntrica (Subida)', duration: '2s', description: 'Elevar a bacia contraindo o abdômen sem impulso.' },
      { phase: 'Isométrica (Pico)', duration: '0s', description: 'Manter a contração isométrica no ponto mais alto.' }
    ],
    biomechanics: 'Retroversão pélvica associada com flexão de quadril.',
    muscleActivationIndex: 86,
  },
  'ex-prancha': {
    gifUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop',
    fallbackColor: 'from-teal-500/10 to-transparent',
    primaryMuscles: ['Reto de Abdômen (Core Estático)', 'Transverso do Abdômen'],
    secondaryMuscles: ['Quadríceps', 'Glúteo Médio', 'Serrátil Anterior'],
    tempo: 'Isométrica Contínua',
    tempoSteps: [
      { phase: 'Isométrica (Estabilidade)', duration: 'Todo o tempo', description: 'Manter quadril, tronco e ombros perfeitamente alinhados.' },
      { phase: 'Respiração Contínua', duration: 'Constante', description: 'Inspirar pelo nariz e expirar pela boca sugando o umbigo para dentro.' }
    ],
    biomechanics: 'Contra-resistência estática de gravidade e antiextensão lombar.',
    muscleActivationIndex: 91,
  },
  'ex-alana-abd-infra-solo': {
    gifUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400&auto=format&fit=crop',
    fallbackColor: 'from-emerald-400/10 to-transparent',
    primaryMuscles: ['Reto do Abdômen (Porção Infra)', 'Iliopsoas'],
    secondaryMuscles: ['Reto Femoral', 'Oblíquos'],
    tempo: '3-0-2-0',
    tempoSteps: [
      { phase: 'Excêntrica (Descida)', duration: '3s', description: 'Descer as pernas estendidas até quase tocar o chão.' },
      { phase: 'Isométrica (Baixo)', duration: '0s', description: 'Manter a lombar firmemente apoiada no colchonete.' },
      { phase: 'Concêntrica (Subida)', duration: '2s', description: 'Elevar a bacia contraindo o abdômen sem impulso.' },
      { phase: 'Isométrica (Pico)', duration: '0s', description: 'Manter a contração isométrica no ponto mais alto.' }
    ],
    biomechanics: 'Retroversão pélvica associada com flexão de quadril no solo.',
    muscleActivationIndex: 86,
  },
  'ex-alana-abd-infra-banco': {
    gifUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop',
    fallbackColor: 'from-emerald-500/10 to-transparent',
    primaryMuscles: ['Reto do Abdômen', 'Iliopsoas'],
    secondaryMuscles: ['Reto Femoral', 'Oblíquos'],
    tempo: '3-1-2-1',
    tempoSteps: [
      { phase: 'Excêntrica (Descida)', duration: '3s', description: 'Descer as pernas controlando o movimento de descida na inclinação.' },
      { phase: 'Isométrica (Isometria)', duration: '1s', description: 'Breve parada antes de subir.' },
      { phase: 'Concêntrica (Subida)', duration: '2s', description: 'Subir as pernas até a posição de flexão máxima de quadril.' },
      { phase: 'Isométrica (Pico de Contração)', duration: '1s', description: 'Esmagar o abdômen no topo.' }
    ],
    biomechanics: 'Flexão pélvica no banco inclinado contra a gravidade.',
    muscleActivationIndex: 89,
  },
  'ex-alana-supino-inc': {
    gifUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400&auto=format&fit=crop',
    fallbackColor: 'from-red-500/10 to-transparent',
    primaryMuscles: ['Peitoral Maior (Superior)', 'Tríceps Braquial'],
    secondaryMuscles: ['Deltoide Anterior'],
    tempo: '3-1-2-0',
    tempoSteps: [
      { phase: 'Excêntrica (Descida)', duration: '3s', description: 'Descer o peso de forma controlada até o peito superior.' },
      { phase: 'Isométrica (Alongamento)', duration: '1s', description: 'Alongar o peito próximo ao limite articular de segurança.' },
      { phase: 'Concêntrica (Empurre)', duration: '2s', description: 'Empurrar com velocidade constante e foco em adução horizontal.' },
      { phase: 'Isométrica (Pico)', duration: '0s', description: 'Contração isométrica de transição no topo.' }
    ],
    biomechanics: 'Adução de ombros em plano inclinado focado no feixe clavicular do peitoral.',
    muscleActivationIndex: 94,
  },
  'ex-alana-crucifixo-adutor': {
    gifUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop',
    fallbackColor: 'from-purple-500/10 to-transparent',
    primaryMuscles: ['Peitoral Maior (Miolo)', 'Deltoide Anterior'],
    secondaryMuscles: ['Bíceps (Cabeça Curta)'],
    tempo: '4-0-2-1',
    tempoSteps: [
      { phase: 'Excêntrica (Abertura)', duration: '4s', description: 'Abrir os cabos mantendo cotovelos semi-flexionados.' },
      { phase: 'Isométrica (Alongamento)', duration: '0s', description: 'Sentir o estiramento das fibras sem ultrapassar a linha dorsal.' },
      { phase: 'Concêntrica (Adução)', duration: '2s', description: 'Fechar e cruzar os braços à frente contraindo os adutores.' },
      { phase: 'Isométrica (Esmagar)', duration: '1s', description: 'Manter a contração voluntária no ponto concêntrico final.' }
    ],
    biomechanics: 'Adução horizontal pura com tensão constante pelo cabo.',
    muscleActivationIndex: 91,
  },
  'ex-alana-triceps-testa': {
    gifUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=400&auto=format&fit=crop',
    fallbackColor: 'from-cyan-500/10 to-transparent',
    primaryMuscles: ['Tríceps (Cabeça Longa)', 'Tríceps (Cabeça Lateral)'],
    secondaryMuscles: ['Ancôneo'],
    tempo: '3-0-2-1',
    tempoSteps: [
      { phase: 'Excêntrica (Descida)', duration: '3s', description: 'Descer o halter em direção à testa dobrando apenas os cotovelos.' },
      { phase: 'Isométrica (Baixo)', duration: '0s', description: 'Alcançar flexão máxima sem bater nos braços.' },
      { phase: 'Concêntrica (Extensão)', duration: '2s', description: 'Subir e estender os braços esmagando os tríceps.' },
      { phase: 'Isométrica (Pico)', duration: '1s', description: 'Aproveitar a isometria máxima no topo do movimento.' }
    ],
    biomechanics: 'Extensão de cotovelo com braços em flexão estática de 90 graus.',
    muscleActivationIndex: 88,
  },
  'ex-alana-triceps-mergulho': {
    gifUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=400&auto=format&fit=crop',
    fallbackColor: 'from-cyan-400/10 to-transparent',
    primaryMuscles: ['Tríceps (Porção Completa)', 'Peitoral Inferior'],
    secondaryMuscles: ['Deltoide Anterior'],
    tempo: '3-1-2-1',
    tempoSteps: [
      { phase: 'Excêntrica (Descida)', duration: '3s', description: 'Descer o tronco dobrando cotovelos para trás e não abertos.' },
      { phase: 'Isométrica (Baixo)', duration: '1s', description: 'Alongamento controlado na porção inferior.' },
      { phase: 'Concêntrica (Subida)', duration: '2s', description: 'Empurrar para cima com toda a força estendendo braços.' },
      { phase: 'Isométrica (Topo)', duration: '1s', description: 'Esmagar tríceps totalmente contraído.' }
    ],
    biomechanics: 'Mergulho em plano paralelo ou banco com foco em tríceps.',
    muscleActivationIndex: 85,
  }
};

export default function ExerciseGifPlayer({ exercise }: ExerciseGifPlayerProps) {
  const visualData = EXERCISE_VISUALS_MAP[exercise.id] || {
    gifUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400',
    fallbackColor: 'from-slate-500/10 to-transparent',
    primaryMuscles: ['Geral'],
    secondaryMuscles: [],
    tempo: 'Controlado',
    tempoSteps: [],
    biomechanics: 'Condicionamento de alta intensidade.',
    muscleActivationIndex: 80,
  };

  const [isPlaying, setIsPlaying] = useState(true);
  const [activeStep, setActiveStep] = useState<number>(0);

  // High performance visualizer configurations
  const muscleIntensity = visualData.muscleActivationIndex;

  return (
    <div className="bg-slate-950 border border-slate-900 rounded-2xl overflow-hidden p-3 space-y-3 relative z-10">
      {/* Simulation / GIF Player Header */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-neon-green" />
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold">Simulador 3D de Execução</span>
        </div>
        <div className="flex items-center gap-2">
          {isPlaying && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
            </span>
          )}
          <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-neon-green">LOOP ATIVO</span>
        </div>
      </div>

      {/* Primary visual canvas representing the "GIF" or animated simulation */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-10"></div>
        
        {/* Custom barbell rep simulation overlay */}
        {isPlaying && (
          <div className="absolute z-20 flex flex-col items-center justify-center pointer-events-none">
            <style>{`
              @keyframes lift {
                0%, 100% { transform: translateY(14px); }
                50% { transform: translateY(-14px); }
              }
              .animate-lift {
                animation: lift 2.5s ease-in-out infinite;
              }
            `}</style>
            <Dumbbell className="w-10 h-10 text-neon-green drop-shadow-[0_0_12px_rgba(163,230,53,0.65)] animate-lift" />
            <span className="text-[8px] font-mono text-neon-green/90 font-bold tracking-widest mt-2 bg-slate-950/90 px-2.5 py-0.5 rounded-full border border-neon-green/20 uppercase">LOOP DE EXECUÇÃO</span>
          </div>
        )}

        {/* Real-time moving visual overlay representing the exercise movement trajectory (A visual simulation helper) */}
        {isPlaying ? (
          <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-3 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10 transition-all pointer-events-none">
            {/* Visual contracting bar simulating the weight motion */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-neon-green/90 shadow-[0_0_10px_rgb(163,230,53)] animate-pulse"
                style={{
                  animationDuration: '2s',
                  animationIterationCount: 'infinite'
                }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono mt-2 text-slate-400">
              <div className="flex items-center gap-1">
                <Flame className="w-3 h-3 text-red-500 animate-bounce" />
                <span>Ativação Muscular: <strong className="text-white">{muscleIntensity}%</strong></span>
              </div>
              <span>Tempo: <strong className="text-neon-green font-bold">{visualData.tempo}</strong></span>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-slate-950/80 z-20 flex flex-col items-center justify-center transition-all">
            <button 
              type="button"
              onClick={() => setIsPlaying(true)}
              className="w-12 h-12 rounded-full bg-neon-green text-slate-950 flex items-center justify-center shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              <Play className="w-6 h-6 fill-slate-950" />
            </button>
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold mt-2.5">Simulação Pausada</span>
          </div>
        )}

        {/* Display Currated Athletic Image with customized CSS active scale animations to simulate the movement loops */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src={visualData.gifUrl} 
            alt={exercise.name}
            className={`w-full h-full object-cover select-none pointer-events-none transition-all duration-1000 ${
              isPlaying ? 'scale-105 brightness-[0.70] contrast-110' : 'scale-100 brightness-[0.40] contrast-100'
            }`}
            referrerPolicy="no-referrer"
          />
          {/* Neon overlay */}
          <div className="absolute inset-0 bg-slate-950/50"></div>
        </div>

        {/* Wireframe anatomical motion tracker in corner */}
        <div className="absolute top-2.5 right-2.5 bg-slate-950/90 border border-slate-800 rounded-lg p-1.5 px-2.5 z-20 text-[9px] font-mono text-slate-300 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Foco Biomecânico Ativo</span>
        </div>
      </div>

      {/* Play / Pause manual controller */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-850/60 p-2.5 rounded-xl text-xs gap-3">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold p-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all text-[11px] cursor-pointer"
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 text-neon-green" />
              <span>Pausar</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-neon-green" />
              <span>Simular</span>
            </>
          )}
        </button>

        <span className="text-[10px] font-mono text-slate-500 max-w-[200px] leading-tight select-none">
          {visualData.biomechanics}
        </span>
      </div>

      {/* Target Muscle activation panels */}
      <div className="space-y-2 bg-slate-900/40 p-3 rounded-xl border border-slate-900">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold block mb-1">Músculos Ativados</span>
          <div className="flex flex-wrap gap-1.5">
            {visualData.primaryMuscles.map((muscle) => (
              <span key={muscle} className="px-2 py-0.5 bg-neon-green/10 border border-neon-green/35 rounded-md text-[10px] text-neon-green font-semibold flex items-center gap-1">
                <Flame className="w-3 h-3 shrink-0" />
                <span>{muscle} (Primário)</span>
              </span>
            ))}
            {visualData.secondaryMuscles.map((muscle) => (
              <span key={muscle} className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded-md text-[10px] text-slate-450 font-medium">
                {muscle}
              </span>
            ))}
          </div>
        </div>

        {/* Contraction step tempo layout */}
        {visualData.tempoSteps.length > 0 && (
          <div className="pt-2 border-t border-slate-900 space-y-1.5">
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold block">Cadência de Treino</span>
            <div className="grid grid-cols-1 gap-1">
              {visualData.tempoSteps.map((step, i) => (
                <div 
                  key={step.phase}
                  onClick={() => setActiveStep(i)}
                  className={`flex items-start justify-between p-1.5 rounded-lg border transition-all text-[10px] cursor-pointer ${
                    activeStep === i 
                      ? 'bg-neon-green/5 border-neon-green/30 text-white' 
                      : 'bg-slate-950/20 border-transparent text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className={`w-3 h-3 ${activeStep === i ? 'text-neon-green' : 'text-slate-650'}`} />
                    <span className="font-medium text-slate-300">{step.phase}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono bg-slate-950 border border-slate-800 px-1 text-slate-500 text-[9px] rounded font-bold">{step.duration}</span>
                  </div>
                </div>
              ))}
              {/* Dynamic instruction description based on active selection step */}
              <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-900/50 mt-1">
                <p className="text-[10px] text-slate-300 leading-relaxed font-mono">
                  💡 <strong className="text-neon-green">Instrução:</strong> {visualData.tempoSteps[activeStep]?.description || 'Siga a cadência sugerida para otimizar os ganhos.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
