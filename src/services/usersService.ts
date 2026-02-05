import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

// Helper to get Plan Limits
const getLimits = (plan: string) => {
  if (plan === 'premium') {
    return { deck: 2, hand: 5, card: 10 };
  }
  return { deck: 1, hand: 3, card: 5 };
};

export const getDeckAnalysisUsage = async (
  userId: string,
): Promise<{ used: number; limit: number }> => {
  return getUsageCheck(userId, 'deck_analysis', 'deck');
};

export const getHandAnalysisUsage = async (
  userId: string,
): Promise<{ used: number; limit: number }> => {
  return getUsageCheck(userId, 'hand_analysis', 'hand');
};

export const getCardAnalysisUsage = async (
  userId: string,
): Promise<{ used: number; limit: number }> => {
  return getUsageCheck(userId, 'card_analysis', 'card');
};

const getUsageCheck = async (
  userId: string,
  collectionName: string,
  type: 'deck' | 'hand' | 'card',
) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [usageSnap, userSnap] = await Promise.all([
      getDoc(doc(db, 'users', userId, 'usage', collectionName)),
      getDoc(doc(db, 'users', userId)),
    ]);

    const plan = userSnap.data()?.subscription?.plan || 'free';
    const limit = getLimits(plan)[type];

    if (!usageSnap.exists()) {
      return { used: 0, limit };
    }

    const data = usageSnap.data();
    if (data.date !== today) {
      return { used: 0, limit };
    }

    return { used: data.count || 0, limit };
  } catch (error) {
    console.error(`Error fetching usage for ${type}:`, error);
    return { used: 0, limit: 1 };
  }
};
