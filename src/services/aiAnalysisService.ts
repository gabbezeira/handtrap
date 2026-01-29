import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { api } from './api';
import { generateDeckHash } from '../utils/hashUtils';

export interface AiDeckResponse {
  metaScore: {
    poderOfensivo: number;
    consistencia: number;
    resiliencia: number;
    controle: number;
  };
  arquetipo: string;
  analiseGeral: string;
  matchups: {
    deckName: string;
    winRate: number;
    estrategia: string;
  }[];
  pontosFortes: string[];
  pontosFracos: string[];
  combosChave: {
    nome: string;
    passos: string[];
  }[];
  planoDeJogo: {
    turno1: string;
    turno2: string;
  };
  sugestoesMelhoria: {
    carta: string;
    acao: "Adicionar" | "Remover";
    qtd: number;
    motivo: string;
  }[];
}

export const analyzeDeckWithCache = async (cardIds: number[], deckNames: string[]): Promise<AiDeckResponse> => {
  try {
    // 1. Generate Hash
    const deckHash = await generateDeckHash(cardIds);
    const docRef = doc(db, 'deck_analyses', deckHash);

    // 2. Check Cache
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log('Using Cached AI Analysis ⚡');
      return docSnap.data() as AiDeckResponse;
    }

    // 3. Call API
    console.log('Fetching Fresh AI Analysis 🧠');
    const response = await api.post('/analyze', { deckList: deckNames });
    const analysisData = response.data;

    // 4. Save to Cache
    await setDoc(docRef, { ...analysisData, timestamp: new Date() });

    return analysisData;

  } catch (error) {
    console.error('Error in analyzeDeckWithCache:', error);
    throw error;
  }
};

export interface AiCardResponse {
  summary: string;
  usage_moments: string[];
}

export const analyzeCardWithCache = async (cardName: string): Promise<AiCardResponse> => {
  try {
    const msgBuffer = new TextEncoder().encode(cardName);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const cardHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const docRef = doc(db, 'card_analyses', cardHash);

    // Check Cache
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
       console.log('Using Cached Card Analysis ⚡');
       return docSnap.data() as AiCardResponse;
    }

    // Call API
    console.log('Fetching Fresh Card Analysis 🧠');
    const response = await api.post('/analyze-card', { cardName });
    const analysisData = response.data;

    // Save Cache
    await setDoc(docRef, { ...analysisData, timestamp: new Date(), cardName });
    
    return analysisData;

  } catch (error) {
    console.error('Error in analyzeCardWithCache:', error);
    throw error;
  }
};
