import { db } from '../firebase/config';
import { collection, getDocs, query, where, deleteDoc, doc, setDoc, collectionGroup } from 'firebase/firestore';
import { CardData } from './cardDatabase';

export interface DeckDocument {
    id?: string;
    name: string;
    authorName: string;
    authorId: string;
    isPublic: boolean;
    cards: {
        main: CardData[];
        extra: CardData[];
    };
    deckHash: string;
    createdAt: number;
}

export const saveDeck = async (userId: string, deckData: Omit<DeckDocument, 'createdAt' | 'authorId'> & { createdAt?: number }) => {
    try {
        const decksRef = collection(db, 'users', userId, 'decks');
        
        // If deckData has an ID, we update
        if (deckData.id) {
            const docRef = doc(decksRef, deckData.id);
            await setDoc(docRef, {
                ...deckData,
                id: deckData.id, // Ensure ID is stored
                authorId: userId, 
                createdAt: deckData.createdAt || Date.now()
            }, { merge: true });
            return deckData.id;
        } else {
            // Create new
            const { id: _, ...dataWithoutId } = deckData;
            // Generate a reference with a new ID
            const docRef = doc(decksRef);
            await setDoc(docRef, {
                ...dataWithoutId,
                id: docRef.id, // Store the generated ID inside the document
                authorId: userId,
                createdAt: Date.now()
            });
            return docRef.id;
        }
    } catch (error: any) {
         if (error.code === 'failed-precondition' || error.message?.includes('index')) {
            console.error("🔥 FIRESTORE INDEX MISSING 🔥");
            console.error("Create it here:", error.message);
        }
        throw error;
    }
};

export const getUserDecks = async (userId: string): Promise<DeckDocument[]> => {
    try {
        const decksRef = collection(db, 'users', userId, 'decks');
        const snapshot = await getDocs(decksRef);
        
        // Parallel self-healing check
        await Promise.all(snapshot.docs.map(async (d) => {
            const data = d.data();
            if (data.id !== d.id) {
                // If 'id' field is missing or wrong, fix it
                await setDoc(d.ref, { id: d.id }, { merge: true });
            }
        }));

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as DeckDocument));
    } catch (error: any) {
        if (error.code === 'failed-precondition' || error.message?.includes('index')) {
            console.error("🔥 FIRESTORE INDEX MISSING 🔥");
            console.error("Create it here:", error.message);
        }
        throw error;
    }
};

export const deleteDeck = async (userId: string, deckId: string): Promise<void> => {
    await deleteDoc(doc(db, 'users', userId, 'decks', deckId));
};

export const getDeck = async (deckId: string): Promise<DeckDocument | null> => {
    try {
        // Query global collection group by 'id' field
        const q = query(collectionGroup(db, 'decks'), where('id', '==', deckId));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
            const docSnap = snapshot.docs[0];
            return { id: docSnap.id, ...docSnap.data() } as DeckDocument;
        }
        return null;
    } catch (error: any) {
        if (error.code === 'failed-precondition' || error.message?.includes('index')) {
            console.error("🔥 FIRESTORE INDEX MISSING 🔥");
            console.error("Create it here:", error.message);
        }
        throw error;
    }
};
