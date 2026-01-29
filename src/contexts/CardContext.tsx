import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { CardData, fetchCardsByIds } from '../services/cardDatabase';

import { STAPLE_IDS } from '../data/staples';
import axios from 'axios';

interface CardContextType {
    cardMap: Map<number, CardData>;
    searchResults: CardData[];
    searchLoading: boolean;
    searchCards: (query: string) => void;
    hydrateMissingCards: (ids: number[]) => Promise<void>;

}

const CardContext = createContext<CardContextType | undefined>(undefined);

export const useCardDatabase = () => {
    const context = useContext(CardContext);
    if (!context) throw new Error('useCardDatabase must be used within a CardProvider');
    return context;
};

export const CardProvider = ({ children }: { children: ReactNode }) => {
    // We keep the huge DB in memory.
    const [fullDatabase, setFullDatabase] = useState<CardData[]>([]);
    const [cardMap, setCardMap] = useState<Map<number, CardData>>(new Map());
    
    // UI state
    const [searchResults, setSearchResults] = useState<CardData[]>([]);
    const [searchLoading, setSearchLoading] = useState(true); // initializing

    // 1. Load the big JSON one time
    useEffect(() => {
        const init = async () => {
            try {
                // Fetch local JSON
                const res = await axios.get('/cardDatabase.json');
                const data: CardData[] = res.data;
                
                // Index it
                const map = new Map<number, CardData>();
                data.forEach(c => map.set(c.id, c));
                
                setFullDatabase(data);
                setCardMap(map);
                
                // Set initial view to staples
                const stapleCards = STAPLE_IDS.map(id => map.get(id)).filter(Boolean) as CardData[];
                setSearchResults(stapleCards);
            } catch (e) {
                console.error("Failed to load local database", e);
            } finally {
                setSearchLoading(false);
            }
        };
        init();
    }, []);

    // 3. Fast Local Search
    const searchCards = useCallback((query: string) => {
        if (!query.trim()) {
            // Reset to Staples if empty
            const stapleCards = STAPLE_IDS.map(id => cardMap.get(id)).filter(Boolean) as CardData[];
            setSearchResults(stapleCards);
            return;
        }

        const lowerQ = query.toLowerCase();
        // Filter limit 100
        const results = [];
        for (const card of fullDatabase) {
            if (results.length >= 100) break;
            
            if (card.name.toLowerCase().includes(lowerQ)) {
                results.push(card);
            }
        }
        setSearchResults(results);
    }, [fullDatabase, cardMap]);

    const hydrateMissingCards = useCallback(async (ids: number[]) => {
        const missing = ids.filter(id => !cardMap.has(id));
        if (missing.length === 0) return;
        
        try {
            const cards = await fetchCardsByIds(missing);
            setCardMap(prev => {
                const newMap = new Map(prev);
                cards.forEach(c => newMap.set(c.id, c));
                return newMap;
            });
        } catch (error) {
            console.error('Hydration error:', error);
        }
    }, [cardMap]);



    const value = {
        cardMap,
        searchResults,
        searchLoading,
        searchCards,
        hydrateMissingCards
    };

    return (
        <CardContext.Provider value={value}>
            {children}
        </CardContext.Provider>
    );
};
