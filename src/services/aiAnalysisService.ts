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
  // Verification fields
  cardIds?: number[];
  deckList?: string[];
  deckHash?: string; // Add this field
  source?: 'cache' | 'fresh' | 'custom';
}

import { 
  isCustomApiEnabled, 
  getCustomApiConfig, 
  analyzeWithCustomApi, 
  getDeckAnalysisPrompt,
  getCardAnalysisPrompt,
  getHandAnalysisPrompt
} from './customAiService';

export const analyzeDeckWithCache = async (cardIds: number[], deckNames: string[], forceRefresh: boolean = false): Promise<AiDeckResponse> => {
  try {
    const deckHash = await generateDeckHash(cardIds);
    
    // 1. Check Client-Side Cache (Community Analysis)
    // Only if we are NOT forcing a refresh AND NOT using Custom API
    if (!forceRefresh && !isCustomApiEnabled()) {
        const docRef = doc(db, 'deck_analyses', deckHash);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // Include deckHash and source in the return so feedback can work
            return { 
                ...docSnap.data() as AiDeckResponse, 
                deckHash, 
                source: 'cache' 
            };
        }
    }

    // 2. Check for Custom API (User's own API key)
    if (isCustomApiEnabled()) {
        const config = getCustomApiConfig();
        if (config) {
            const prompt = getDeckAnalysisPrompt(deckNames);
            const result = await analyzeWithCustomApi(prompt, config);
            
            // Custom API results are NOT saved to cache (per user request)
            return {
                ...result,
                deckHash,
                source: 'custom'
            };
        }
    }

    // Call Backend (Handles Usage Limits & Caching)
    const response = await api.post('/analyze', { 
        deckList: deckNames,
        cardIds, // Required for backend hashing
        forceRefresh 
    });
    
    // The backend now updates the Firestore cache automatically on success.
    // We just return the data.
    return response.data;

  } catch (error: any) {
    if (error.response?.status === 403 && error.response?.data?.error === 'LIMIT_REACHED') {
        throw new Error("LIMIT_REACHED");
    }
    // Convert 404 from backend (No Community Analysis) to a specific error/null if needed
    // But standardized error handling usually bubbles up.
    console.error('Error in analyzeDeckWithCache:', error);
    throw error;
  }
};

export const checkDeckAnalysisCache = async (cardIds: number[]): Promise<AiDeckResponse | null> => {
    try {
        const deckHash = await generateDeckHash(cardIds);
        const docRef = doc(db, 'deck_analyses', deckHash);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // Include deckHash and source so feedback can work
            return { 
                ...docSnap.data() as AiDeckResponse, 
                deckHash, 
                source: 'cache' 
            };
        }
        return null;
    } catch (error) {
        console.error("Error checking cache:", error);
        return null;
    }
};

export const submitFeedback = async (deckHash: string, vote: 'accurate' | 'inaccurate', reason: string) => {
    return api.post('/feedback/analysis', {
        deckHash,
        vote,
        reason
    });
};

export interface AiCardResponse {
  summary: string;
  usage_moments: string[];
  source?: 'cache' | 'fresh' | 'custom';
}

export const analyzeCardWithCache = async (cardName: string): Promise<AiCardResponse> => {
  try {
    const msgBuffer = new TextEncoder().encode(cardName);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const cardHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const docRef = doc(db, 'card_analyses', cardHash);

    const docSnap = await getDoc(docRef);
    const isCustomEnabled = isCustomApiEnabled();

    if (docSnap.exists() && !isCustomEnabled) {
       const data = docSnap.data();
       return { ...data as AiCardResponse, source: 'cache' };
    }

    // Check for Custom API
    if (isCustomEnabled) {
        const config = getCustomApiConfig();
        if (config) {
            const prompt = getCardAnalysisPrompt(cardName);
            const result = await analyzeWithCustomApi(prompt, config);
            // Custom API results are NOT saved to cache
            return { ...result, source: 'custom' };
        }
    }

    const response = await api.post('/analyze-card', { cardName });
    const analysisData = response.data;

    await setDoc(docRef, { ...analysisData, timestamp: new Date(), cardName, generatedBy: 'system' });
    
    return { ...analysisData, source: 'fresh' };

  } catch (error) {
    console.error('Error in analyzeCardWithCache:', error);
    throw error;
  }
};

export interface AiHandResponse {
    score: number;
    strategy_going_first: string;
    strategy_going_second: string;
    key_combos: string[];
    bricks: string[];
    source?: 'cache' | 'fresh' | 'custom';
}

export const analyzeHandWithCache = async (handCards: number[], deckCards: number[], handNames: string[], deckNames: string[]): Promise<AiHandResponse> => {
    try {
        // 1. Calculate Deck Hash (Parent)
        const deckHash = await generateDeckHash(deckCards);
        
        // 2. Calculate Hand Hash (Subcollection ID)
        const handHash = await generateDeckHash(handCards); // Reuse same hash function as it sorts IDs

        // 3. Check Cache: deck_analyses/{deckHash}/hands/{handHash}
        // 3. Check Cache: deck_analyses/{deckHash}/hands/{handHash}
        const handRef = doc(db, 'deck_analyses', deckHash, 'hands', handHash);
        const handSnap = await getDoc(handRef);
        const isCustomEnabled = isCustomApiEnabled();

        if (handSnap.exists() && !isCustomEnabled) {
            const data = handSnap.data();
            return { ...data as AiHandResponse, source: 'cache' };
        }

        // Check for Custom API
        if (isCustomEnabled) {
            const config = getCustomApiConfig();
            if (config) {
                const prompt = getHandAnalysisPrompt(handNames, deckNames);
                const result = await analyzeWithCustomApi(prompt, config);
                // Custom API results are NOT saved to cache
                return { ...result, source: 'custom' };
            }
        }

        // Check Usage Limit (Handled by Backend)
        // We no longer check/increment here to prevent "Pay-Up-Front" issues.
        // The backend returns 403 if limit is reached.

        const response = await api.post('/analyze-hand', { 
            handCards: handNames,
            deckList: deckNames
        });
        
        const analysisData = response.data;

        // 5. Save to Cache
        await setDoc(handRef, {
            ...analysisData,
            timestamp: new Date(),
            handIds: handCards.sort((a,b) => a-b)
        });

        return { ...analysisData, source: 'fresh' };

    } catch (error: any) {
        if (error.response && error.response.status === 403 && error.response.data?.error === 'LIMIT_REACHED') {
             throw new Error("LIMIT_REACHED");
        }
        console.error('Error in analyzeHandWithCache:', error);
        throw error;
    }
};
