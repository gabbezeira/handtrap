export const generateDeckHash = async (cards: number[]): Promise<string> => {
  // Sort cards to ensure consistent hash regardless of order (unless order matters for you)
  // Converting to string
  const data = JSON.stringify(cards.sort((a, b) => a - b));
  
  // Encode as UTF-8
  const msgBuffer = new TextEncoder().encode(data);
  
  // Hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  
  // Convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  
  // Convert bytes to hex string
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
};
