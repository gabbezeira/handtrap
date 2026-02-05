import { CardData } from '../services/cardDatabase';

interface DeckIds {
  main: number[];
  extra: number[];
}

/**
 * Encodes a deck into a compact URL-safe string.
 * Format: Base64( "M:<id>x<qty>,<id>x<qty>|E:<id>x<qty>..." )
 */
export const encodeDeck = (mainDeck: CardData[], extraDeck: CardData[]): string => {
  const processCards = (cards: CardData[]) => {
    const countMap = new Map<number, number>();
    cards.forEach((c) => countMap.set(c.id, (countMap.get(c.id) || 0) + 1));

    return Array.from(countMap.entries())
      .map(([id, qty]) => `${id}x${qty}`)
      .join(',');
  };

  const mainStr = processCards(mainDeck);
  const extraStr = processCards(extraDeck);

  // Format: "M:123x3,456x1|E:789x2"
  // If empty, just "M:|E:"
  const rawString = `M:${mainStr}|E:${extraStr}`;

  // Encode to Base64
  return btoa(rawString);
};

/**
 * Decodes a deck string back into arrays of IDs.
 */
export const decodeDeck = (encoded: string): DeckIds => {
  try {
    const rawString = atob(encoded);
    const parts = rawString.split('|');

    const mainPart = parts.find((p) => p.startsWith('M:'))?.substring(2) || '';
    const extraPart = parts.find((p) => p.startsWith('E:'))?.substring(2) || '';

    const parseSection = (sectionStr: string): number[] => {
      if (!sectionStr) return [];
      const ids: number[] = [];

      sectionStr.split(',').forEach((segment) => {
        if (!segment.includes('x')) return;
        const [idStr, qtyStr] = segment.split('x');
        const id = parseInt(idStr);
        const qty = parseInt(qtyStr);

        if (!isNaN(id) && !isNaN(qty)) {
          for (let i = 0; i < qty; i++) ids.push(id);
        }
      });
      return ids;
    };

    return {
      main: parseSection(mainPart),
      extra: parseSection(extraPart),
    };
  } catch (e) {
    console.error('Failed to decode deck:', e);
    return { main: [], extra: [] };
  }
};
