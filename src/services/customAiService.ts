/**
 * Custom AI Service
 * Handles user-provided API keys for Gemini, OpenAI, or Anthropic.
 * API keys are stored ONLY in localStorage, never sent to backend.
 */

export type AiProvider = 'gemini' | 'openai' | 'anthropic';

export interface CustomApiConfig {
  provider: AiProvider;
  apiKey: string;
  additionalInstructions: string;
  enabled: boolean;
  model?: string;
}

const STORAGE_KEY = 'handtrap_custom_ai_config';

// Simple obfuscation (not encryption, but prevents casual viewing)
const encode = (str: string): string => btoa(str);
const decode = (str: string): string => {
  try {
    return atob(str);
  } catch {
    return '';
  }
};

/**
 * Save custom API config to localStorage
 */
export const saveCustomApiConfig = (config: CustomApiConfig): void => {
  const toStore = {
    ...config,
    apiKey: encode(config.apiKey),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
};

/**
 * Get custom API config from localStorage
 */
export const getCustomApiConfig = (): CustomApiConfig | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  
  try {
    const parsed = JSON.parse(stored);
    return {
      ...parsed,
      apiKey: decode(parsed.apiKey),
    };
  } catch {
    return null;
  }
};

/**
 * Clear custom API config from localStorage
 */
export const clearCustomApiConfig = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Check if custom API is enabled and configured
 */
export const isCustomApiEnabled = (): boolean => {
  const config = getCustomApiConfig();
  return !!(config?.enabled && config?.apiKey);
};

/**
 * Build the full prompt with user's additional instructions
 */
const buildPrompt = (basePrompt: string, additionalInstructions: string): string => {
  if (!additionalInstructions.trim()) return basePrompt;
  
  return `${basePrompt}

    === INSTRUÇÕES ADICIONAIS DO USUÁRIO ===
    ${additionalInstructions}
    === FIM DAS INSTRUÇÕES ADICIONAIS ===`;
};

/**
 * Test API connection with a simple request
 */
export const testCustomApiConnection = async (
  provider: AiProvider, 
  apiKey: string,
  model?: string
): Promise<{ success: boolean; message: string }> => {
  const testPrompt = 'Responda apenas: "OK"';
  
  try {
    switch (provider) {
      case 'gemini': {
        const modelToUse = model || 'gemini-1.5-flash';
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: testPrompt }] }]
            })
          }
        );
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'API key ou Modelo inválido');
        }
        
        return { success: true, message: `Conexão OK com ${modelToUse}!` };
      }
      
      case 'openai': {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: testPrompt }],
            max_tokens: 10
          })
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'API key inválida');
        }
        
        return { success: true, message: 'Conexão estabelecida com OpenAI!' };
      }
      
      case 'anthropic': {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 10,
            messages: [{ role: 'user', content: testPrompt }]
          })
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'API key inválida');
        }
        
        return { success: true, message: 'Conexão estabelecida com Claude!' };
      }
      
      default:
        return { success: false, message: 'Provider não suportado' };
    }
  } catch (error: any) {
    return { 
      success: false, 
      message: error.message || 'Falha na conexão' 
    };
  }
};

/**
 * Analyze deck using custom API
 */
export const analyzeWithCustomApi = async (
  basePrompt: string,
  config: CustomApiConfig
): Promise<any> => {
  const fullPrompt = buildPrompt(basePrompt, config.additionalInstructions);
  
  switch (config.provider) {
    case 'gemini': {
      const model = config.model || 'gemini-1.5-flash'; // Fallback if missing
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: fullPrompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 8192,
              responseMimeType: "application/json"
            }
          })
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Erro na API Gemini');
      }
      
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return cleanAndParseJSON(text);
    }
    
    case 'openai': {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { 
              role: 'system', 
              content: 'Você é um especialista em Yu-Gi-Oh! Master Duel. Responda apenas com JSON válido.' 
            },
            { role: 'user', content: fullPrompt }
          ],
          temperature: 0.7,
          max_tokens: 4096
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Erro na API OpenAI');
      }
      
      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '';
      return cleanAndParseJSON(text);
    }
    
    case 'anthropic': {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4096,
          messages: [{ role: 'user', content: fullPrompt }]
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Erro na API Claude');
      }
      
      const data = await response.json();
      const text = data.content?.[0]?.text || '';
      return cleanAndParseJSON(text);
    }
    
    default:
      throw new Error('Provider não suportado');
  }
};

/**
 * Clean and parse JSON from AI response
 */
const cleanAndParseJSON = (text: string): any => {
  try {
    const clean = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    return JSON.parse(clean);
  } catch (error) {
    console.error('JSON Parse Error. Raw text:', text);
    
    // Check for truncation
    const clean = text.trim();
    if (clean.startsWith('{') && !clean.endsWith('}')) {
        throw new Error('A resposta da IA foi cortada. O modelo pode ter atingido o limite de tokens. Tente usar "gemini-1.5-pro" ou aumentar seus limites.');
    }
    
    throw new Error('Falha ao processar resposta da IA. O formato retornado é inválido.');
  }
};

/**
 * Get the base prompt for deck analysis (mirrors backend)
 */
export const getDeckAnalysisPrompt = (deckList: string[]): string => {
  return `
    CONTEXTO: Você é um especialista em Yu-Gi-Oh! Master Duel (formato Best of 1, Fevereiro 2026).
    
    TAREFA: Analise a lista de deck fornecida e forneça uma avaliação técnica e construtiva.
    
    LISTA DO DECK:
    ${deckList.join(", ")}
    
    REGRAS IMPORTANTES:
    1. NÃO mencione banlist, cartas proibidas ou limitadas. Ignore completamente a banlist.
    2. RESPEITE as quantidades exatas de cartas informadas na lista. Se a lista diz "3x Blue-Eyes", são 3 cópias.
    3. Seja específico e construtivo. Evite críticas genéricas como "remova tudo".
    4. Analise o deck pelo que ele É, não pelo que você acha que deveria ser.
    5. Se o deck mistura engines, sugira como melhorar a sinergia, não "apague tudo".
    6. Responda APENAS com o JSON, sem introduções ou texto explicativo antes.

    === META ATUAL DE FEVEREIRO 2026 (USE COMO REFERÊNCIA) ===
    
    **TIER 0 - DRACOTAIL:**
    - Arquétipo: Fusion-based com Dragons/Spellcasters
    - Playstyle: Fusion Summon gerando vantagem; Dracotail monsters quando usados como Fusion Material setam Spells/Traps do deck
    - Key Cards: Dracotail Lukias (starter, busca qualquer Dracotail), Dracotail Faimena (Fusion Summon da mão), Dracotail Arthalion (Fusion boss que recicla materiais), Dracotail Gulamel (Quick Effect destruição), Rahu Dracotail, Dracotail Mululu
    - Traps: Dracotail Flame (nega Spell), Dracotail Horn
    - Combos: Lukias → search Faimena → Fusion Arthalion → Rahu GY effect → Fusion Gulamel → set 2 traps
    - Variantes: Branded Dracotail, Dracotail Ryzeal, Pure Dracotail
    - Fraquezas: Negar Arthalion com Impermanence/Veiler; NÃO negue Lukias ou Mululu
    - Power Level: 10/10 (deck dominante do formato)

    **TIER 1 - MITSURUGI:**
    - Arquétipo: Ritual-based com DARK Reptiles
    - Playstyle: Midrange com tributes para gerar recursos; alto search power; acessa Rank 4 e 8 facilmente
    - Key Cards: Ame no Habakiri no Mitsurugi (starter principal), Mitsurugi Ritual (Ritual Spell), Kusanagi (recicla Ritual Spell), Saji, Ame no Murakumo no Mitsurugi (Ritual boss)
    - Spells/Traps: Mitsurugi Prayers (flexível), Mitsurugi Great Purification (interação forte), Mitsurugi Mirror
    - Combos: Habakiri → summon Saji → tribute Saji → add Mitsurugi Ritual → Ritual Summon Murakumo
    - Variantes: Pure Mitsurugi, Mitsurugi Yummy, Ryzeal Mitsurugi, Orcust Mitsurugi
    - Power Level: 9/10

    **TIER 1 - YUMMY:**
    - Arquétipo: DARK Fairy/Fiend combo deck
    - Playstyle: One-card combos extremamente consistentes; resiliente a hand traps; end board com Herald of the Arc Light (omni-negate)
    - Key Cards: Yummy☆Cupsy, Yummy☆Cookie, Yummy☆Lollipop, Yummy☆Marshmao, Yummy☆Snatchy, K9-66A Jokul (engine Level 5)
    - End Board: Herald of the Arc Light + interruptions
    - Força: Passa por Ash Blossom e Nibiru; muitos starters de 1 carta
    - Variantes: Pure Yummy, Yummy Mitsurugi, Yummy Misogi
    - Power Level: 9/10

    **DINÂMICA DE MATCHUPS:**
    - Dracotail > Yummy (favorável)
    - Mitsurugi vs Dracotail (50/50)
    - Yummy vs Mitsurugi (depende da versão)

    === FIM DO CONTEXTO META ===

    DIRETRIZES DE ANÁLISE:
    - Compare o deck analisado com os tier decks acima
    - Avalie se o deck consegue competir contra Dracotail (dominante)
    - Analise sinergia entre Main Deck e Extra Deck
    - Descreva combos reais que o deck pode executar
    - Identifique "Garnets" (cartas ruins de comprar) e cartas sub-otimizadas

    FORMATO DE RESPOSTA (JSON ESTRITO - SEM MARKDOWN, SEM TEXTO ANTES):
    {
      "metaScore": {
        "poderOfensivo": 0-10,
        "consistencia": 0-10,
        "resiliencia": 0-10,
        "controle": 0-10
      },
      "arquetipo": "Nome do Arquétipo Principal",
      "analiseGeral": "Resumo técnico de 2 parágrafos em Português. Seja direto e construtivo.",
      "matchups": [
        {
          "deckName": "Dracotail",
          "winRate": 0-100,
          "estrategia": "Como jogar contra Dracotail (deck dominante do formato)."
        },
        {
          "deckName": "Mitsurugi Yummy",
          "winRate": 0-100,
          "estrategia": "Dicas para enfrentar a engine Mitsurugi + Yummy."
        },
        {
          "deckName": "Pure Yummy",
          "winRate": 0-100,
          "estrategia": "Pontos a explorar contra Yummy puro."
        }
      ],
      "pontosFortes": ["ponto 1", "ponto 2", "ponto 3"],
      "pontosFracos": ["fraqueza 1", "fraqueza 2", "fraqueza 3"],
      "combosChave": [
        {
          "nome": "Nome do Combo",
          "passos": ["1. ...", "2. ..."]
        }
      ],
      "planoDeJogo": {
        "turno1": "Setup ideal going first.",
        "turno2": "Como jogar going second."
      },
      "sugestoesMelhoria": [
        {
          "carta": "Nome da Carta",
          "acao": "Adicionar",
          "qtd": 1,
          "motivo": "Motivo técnico."
        },
        {
          "carta": "Nome da Carta",
          "acao": "Remover",
          "qtd": 1,
          "motivo": "Motivo construtivo (nunca 'remova tudo')."
        }
      ]
    }
    `;
};

/**
 * Get the base prompt for card analysis
 */
export const getCardAnalysisPrompt = (cardName: string): string => {
  return `
    Você é um especialista em Yu-Gi-Oh! Master Duel. Analise a carta "${cardName}" e forneça:
    
    1. Um resumo técnico sobre a carta
    2. Momentos ideais para usar/ativar esta carta
    
    REGRAS:
    - Responda APENAS em JSON válido, sem markdown
    - Seja conciso e técnico
    - Foque em uso competitivo
    
    FORMATO DE RESPOSTA (JSON ESTRITO):
    {
      "summary": "Resumo técnico da carta em 2-3 frases em Português.",
      "usage_moments": [
        "Momento ideal 1",
        "Momento ideal 2",
        "Momento ideal 3"
      ]
    }
  `;
};

/**
 * Get the base prompt for hand analysis
 */
export const getHandAnalysisPrompt = (handCards: string[], deckList: string[]): string => {
  return `
    Você é um especialista em Yu-Gi-Oh! Master Duel. Analise esta mão inicial:
    
    MÃO: ${handCards.join(", ")}
    
    DECK COMPLETO: ${deckList.join(", ")}
    
    TAREFA: Avalie a qualidade desta mão e forneça estratégias.
    
    REGRAS:
    - Responda APENAS em JSON válido, sem markdown
    - Seja técnico e específico
    - Considere o formato Best of 1
    
    FORMATO DE RESPOSTA (JSON ESTRITO):
    {
      "score": 0-10,
      "strategy_going_first": "Estratégia detalhada para ir primeiro.",
      "strategy_going_second": "Estratégia detalhada para ir segundo.",
      "key_combos": [
        "Combo 1 possível com esta mão",
        "Combo 2 possível com esta mão"
      ],
      "bricks": [
        "Carta problemática 1 (se houver)",
        "Carta problemática 2 (se houver)"
      ]
    }
  `;
};
