import axios from 'axios';
import { getDB } from './db';
import { metricsManager } from './metrics';

// Local path to the public JSON file
const DB_URL = '/cardDatabase.json';

export interface CardData {
  id: number;
  konami_id?: number;
  name: string; 
  name_en?: string;
  type: string;
  frameType: string;
  desc: string;
  atk?: number;
  def?: number;
  level?: number;
  race?: string;
  attribute?: string;
  card_images: { image_url: string; image_url_small: string }[];
  banStatus?: 'Forbidden' | 'Limited' | 'Semi-Limited' | 'Unlimited';
  card_sets?: { set_name: string; set_code: string; set_rarity: string }[];
}

// Track loading state
let databaseLoadPromise: Promise<void> | null = null;

// Initialize/Load the database into IndexedDB
const loadDatabase = async () => {
    if (databaseLoadPromise) return databaseLoadPromise;

    databaseLoadPromise = (async () => {
        try {
            const db = await getDB();
            
            // Check if we already have data
            const count = await db.count('cards');
            if (count > 0) {
                console.log(`Database already populated with ${count} cards.`);
                return;
            }

            console.log('Database empty. Fetching JSON...');
            
            const requestId = 'card-db-fetch';
            metricsManager.startRequest(requestId);
            
            let response;
            try {
                response = await axios.get(DB_URL);
                metricsManager.endRequest(requestId, 'external', false);
            } catch (e) {
                metricsManager.endRequest(requestId, 'external', true);
                throw e;
            }
            
            if (Array.isArray(response.data)) {
                const cards: CardData[] = response.data;
                console.log(`Fetched ${cards.length} cards. Populating IndexedDB...`);
                
                // Use a transaction for bulk insert
                const tx = db.transaction('cards', 'readwrite');
                const store = tx.objectStore('cards');
                
                // Promise.all might be too heavy for 12k items, let's do batches or simple loop
                // Simple loop with strict transactions is safer for browser limit
                for (const card of cards) {
                    store.put(card);
                }
                
                await tx.done;
                console.log('IndexedDB population complete.');
            } else {
                console.error('Local DB format incorrect');
            }
        } catch (error) {
            console.error('Failed to load local card database:', error);
            // Reset promise so we can retry later
            databaseLoadPromise = null;
        }
    })();
    
    return databaseLoadPromise;
};

export const searchCardsAPI = async (query: string): Promise<CardData[]> => {
  if (!query || query.length < 2) return [];

  // Ensure DB is ready
  await loadDatabase();
  
  const db = await getDB();
  const lowerQuery = query.toLowerCase();
  
  // IndexedDB doesn't support full-text search natively like SQL 'LIKE %...%'
  // For 12k cards, we can iterate using a cursor efficiently enough, 
  // or getAllKeys() if we want to be fancy.
  // A generic cursor is efficient.
  
  const results: CardData[] = [];
  const limit = 50;
  
  let cursor = await db.transaction('cards').store.openCursor();
  
  while (cursor && results.length < limit) {
      const card = cursor.value;
      // Search by Name or Description
      if (card.name.toLowerCase().includes(lowerQuery) || 
         (card.desc && card.desc.toLowerCase().includes(lowerQuery))) {
          results.push(card);
      }
      cursor = await cursor.continue();
  }
  
  return results;
};

export const fetchCardsByIds = async (ids: number[]): Promise<CardData[]> => {
    if (ids.length === 0) return [];
    
    await loadDatabase();
    const db = await getDB();
    
    const uniqueIds = Array.from(new Set(ids));
    
    // Fetch in parallel
    const cards = await Promise.all(
        uniqueIds.map(id => db.get('cards', id))
    );
    
    // Filter out undefined (if card not found)
    return cards.filter((card): card is CardData => !!card);
}
