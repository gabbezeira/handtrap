import { db } from '../firebase/config';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, setDoc } from 'firebase/firestore';

export interface DeckDocument {
    id?: string;
    name: string;
    authorName: string;
    authorId: string;
    isPublic: boolean;
    cards: {
        main: number[];
        extra: number[];
    };
    deckHash: string;
    createdAt: number;
}

const COLLECTION_NAME = 'decks';

export const saveDeck = async (deckData: Omit<DeckDocument, 'createdAt' | 'authorId'> & { authorId?: string, createdAt?: number }) => {
    // If deckData has an ID, we update
    if (deckData.id) {
        const docRef = doc(db, COLLECTION_NAME, deckData.id);
        await setDoc(docRef, {
            ...deckData,
            createdAt: deckData.createdAt || Date.now() // Preserve or update date
        }, { merge: true });
        return deckData.id;
    } else {
        // Create new - Remove 'id' field to avoid "undefined" error
        const { id, ...dataWithoutId } = deckData;
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...dataWithoutId,
            authorId: deckData.authorId || 'anonymous',
            createdAt: Date.now()
        });
        return docRef.id;
    }
};

export const getUserDecks = async (userId: string): Promise<DeckDocument[]> => {
    const q = query(collection(db, COLLECTION_NAME), where("authorId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as DeckDocument));
};

export const deleteDeck = async (deckId: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTION_NAME, deckId));
};

export const getDeck = async (deckId: string): Promise<DeckDocument | null> => {
    const docRef = doc(db, COLLECTION_NAME, deckId);
    // Dynamic import to avoid circular dep issues in some setups, or just standard import above
    const { getDoc } = await import('firebase/firestore'); 
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as DeckDocument;
    }
    return null;
};
