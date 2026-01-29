import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import { useCardDatabase } from '../../hooks/useCardDatabase';
import { AiAnalysisPanel } from '../../components/AiAnalysisPanel';
import { CardData, fetchCardsByIds } from '../../services/cardDatabase';
import { Search, Sword, Shield, BrainCircuit, Sparkles, X, Info, Box, Loader2, Save } from 'lucide-react';
import { saveDeck, getDeck } from '../../services/deckService';
import { analyzeDeckWithCache, analyzeCardWithCache, AiDeckResponse } from '../../services/aiAnalysisService';
import { getCardImageUrl } from '@/utils/imageUrl';
import { Header } from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';
import { useModal } from '../../contexts/ModalContext';
import cpurIcon from '../../assets/images/cpur.png';
import cpsrIcon from '../../assets/images/cpsr.png';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { SupportButton } from '../../components/SupportButton';

import {
  PageWrapper,
  ContentGrid,
  Column,
  DetailPanel,
  BigCardImage,
  CardTitle,
  TagsContainer,
  Tag,
  DescriptionBox,
  DeckAreaContainer,
  DeckSection,
  SectionLabel,
  CardGrid,
  MiniCard,
  SearchContainer,
  CatalogGrid,
  ActionButton,
  DeckNameInput,
  SearchInputRow,
  ColumnHeader,
  NoSelectionInfo,
  AIContainer,
  SearchRowInner,
  RarityBadge,
  CardBackdrop,
  DetailContent,
  StatGrid,
  StatBox,
  StatLabel,
  StatValue,
  CardImageContainer,
  AiButton,
  ModalOverlay,
  ModalContent, 
  ModalHeader,
  ModalBody,
  CloseButton
} from './styles';

const getCardRarity = (card: CardData): 'UR' | 'SR' | 'R' | 'N' => {
    if (!card.card_sets) return 'N';
    
    const sets = card.card_sets;
    // UR / Secret / Prismatic / Ultimate / Ghost -> UR
    const hasUR = sets.some(s => 
        s.set_rarity.includes('Ultra') || 
        s.set_rarity.includes('Secret') || 
        s.set_rarity.includes('Prismatic') || 
        s.set_rarity.includes('Platinum') || 
        s.set_rarity.includes('Ultimate') || 
        s.set_rarity.includes('Ghost')
    );
    if (hasUR) return 'UR';

    // Super -> SR
    const hasSR = sets.some(s => s.set_rarity.includes('Super'));
    if (hasSR) return 'SR';

    // Rare -> R
    const hasR = sets.some(s => s.set_rarity.includes('Rare')); 
    if (hasR) return 'R';

    return 'N';
};

export const DeckBuilder = () => {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const deckId = searchParams.get('id');

    const { 
        searchResults, 
        searchCards, 
        searchLoading 
    } = useCardDatabase();
    

    const [searchTerm, setSearchTerm] = useState('');
    const [mainDeck, setMainDeck] = useState<CardData[]>([]);
    const [extraDeck, setExtraDeck] = useState<CardData[]>([]);
    const [deckName, setDeckName] = useState('Novo Deck');
    const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
    const [showAI, setShowAI] = useState(false);
    const [loadingDeck, setLoadingDeck] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiResult, setAiResult] = useState<{summary: string, usage_moments: string[]} | null>(null);
    const [showAiModal, setShowAiModal] = useState(false);
    
    // New AI Analysis State
    const [deckAnalysis, setDeckAnalysis] = useState<AiDeckResponse | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    // Calculate CP Cost
    const urCost = [...mainDeck, ...extraDeck].filter(c => getCardRarity(c) === 'UR').length * 30;
    const srCost = [...mainDeck, ...extraDeck].filter(c => getCardRarity(c) === 'SR').length * 30;

    const { showModal } = useModal();
    const { playAddSound, playRemoveSound } = useSoundEffects();
    const handleDeckAnalysis = async () => {
        if (mainDeck.length < 40) {
            showModal({
                title: 'Deck Incompleto',
                message: 'O Deck Principal deve ter no mínimo 40 cartas para ser analisado.',
                type: 'info'
            });
            return;
        }
        const allCards = mainDeck.concat(extraDeck);
        if (allCards.length === 0) return;
        
        setIsAnalyzing(true);
        try {
            const cardIds = allCards.map(c => c.id);
            
            // Generate list like ["3x Ash Blossom", "1x Nibiru"]
            const nameMap = new Map<string, number>();
            allCards.forEach(c => {
               nameMap.set(c.name, (nameMap.get(c.name) || 0) + 1);
            });
            const deckListForAi = Array.from(nameMap.entries()).map(([name, count]) => `${count}x ${name}`);

            const result = await analyzeDeckWithCache(cardIds, deckListForAi);
            setDeckAnalysis(result);
        } catch (error) {
            console.error("AI Analysis Failed", error);
            showModal({
                title: 'Erro de Análise',
                message: 'Falha ao analisar deck. Tente novamente mais tarde.',
                type: 'error'
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleAiAnalysis = async (cardName: string) => {
        setIsAiLoading(true);
        setShowAiModal(true);
        setAiResult(null); // Reset previous result
        try {
            const result = await analyzeCardWithCache(cardName);
            setAiResult(result);
        } catch (error) {
            console.error(error);
            setAiResult({
                summary: "Erro ao analisar carta. Tente novamente.",
                usage_moments: []
            });
        } finally {
            setIsAiLoading(false);
        }
    };
    const sortCardsByName = (cards: CardData[]) => {
        return [...cards].sort((a, b) => a.name.localeCompare(b.name));
    };

    // Load deck if ID is present
    useEffect(() => {
        const loadDeckData = async () => {
             if (!deckId) return;
             try {
                 setLoadingDeck(true);
                 const deck = await getDeck(deckId);
                 if (deck) {
                     setDeckName(deck.name);
                     
                     const allIds = [...deck.cards.main, ...deck.cards.extra];
                     const allCards = await fetchCardsByIds(allIds);
                     const allMap = new Map(allCards.map(c => [c.id, c]));
                     
                     const finalMain = deck.cards.main.map(id => allMap.get(id)).filter(Boolean) as CardData[];
                     const finalExtra = deck.cards.extra.map(id => allMap.get(id)).filter(Boolean) as CardData[];
                     
                     setMainDeck(sortCardsByName(finalMain));
                     setExtraDeck(sortCardsByName(finalExtra));
                 }
             } catch (error) {
                 console.error("Failed to load deck", error);
             } finally {
                 setLoadingDeck(false);
             }
        };
        loadDeckData();
    }, [deckId]);

    // Filter Search on type
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchTerm(val);
        // Instant local search
        searchCards(val);
    };

    const isExtraDeckType = (card: CardData): boolean => {
        const frame = card.frameType?.toLowerCase();
        return [
            'fusion', 'synchro', 'xyz', 'link', 
            'fusion_pendulum', 'synchro_pendulum', 'xyz_pendulum', 'link_pendulum'
        ].includes(frame || '');
    };

    const handleAddToDeck = (card: CardData) => {
        const isExtra = isExtraDeckType(card);
        
        // 1. Check Copy Limit (Max 3 of same ID per DECK)
        const countInMain = mainDeck.filter(c => c.id === card.id).length;
        const countInExtra = extraDeck.filter(c => c.id === card.id).length;
        const totalCopies = countInMain + countInExtra;
        
        if (totalCopies >= 3) {
            // Silently fail
            return;
        }

        if (isExtra) {
            if (extraDeck.length >= 15) {
                // Limit reached
                return;
            }
            setExtraDeck(prev => sortCardsByName([...prev, card]));
            playAddSound();
        } else {
            if (mainDeck.length >= 40) { // Limit strictly to 40
                 // Limit reached
                 return;
            }
            setMainDeck(prev => sortCardsByName([...prev, card]));
            playAddSound();
        }
    };

    const handleRemoveFromDeck = (index: number, isExtra: boolean) => {
        if (isExtra) {
            setExtraDeck(prev => {
                const newDeck = [...prev];
                newDeck.splice(index, 1);
                playRemoveSound();
                return newDeck;
            });
        } else {
            setMainDeck(prev => {
                const newDeck = [...prev];
                newDeck.splice(index, 1);
                playRemoveSound();
                return newDeck;
            });
        }
    };

    const handleSave = async () => {
        if (!user) {
            showModal({
                title: 'Login Necessário',
                message: 'Você precisa estar logado para salvar seus decks.',
                type: 'info'
            });
            return;
        }
        try {
            const savedId = await saveDeck({
                id: deckId || undefined, // Pass existing ID if any
                authorName: user.displayName || 'Duelist',
                authorId: user.uid,
                name: deckName,
                isPublic: false,
                cards: {
                    main: mainDeck.map(c => c.id),
                    extra: extraDeck.map(c => c.id)
                },
                deckHash: '', 
            });
            
            if (!deckId) {
                // If it was a new deck, set the ID so future saves are updates
                setSearchParams({ id: savedId });
            }
            showModal({
                title: 'Sucesso',
                message: 'O Deck foi salvo com sucesso!',
                type: 'success'
            });
        } catch (e: any) {
            console.error(e);
            showModal({
                title: 'Falha ao Salvar',
                message: 'Ocorreu um erro ao salvar o deck: ' + e.message,
                type: 'error'
            });
        }
    };



    const renderCardDetails = () => {
        if (!selectedCard) {
            return (
                <NoSelectionInfo>
                    <div>
                        <Box size={48} style={{opacity:0.5}} />
                    </div>
                    <h3 style={{color: 'white', marginBottom: '0.5rem', fontSize: '1.2rem'}}>Nenhuma Carta Selecionada</h3>
                    <p style={{fontSize: '0.9rem'}}>Clique em uma carta para ver detalhes.</p>
                </NoSelectionInfo>
            );
        }
        // Use local image util
        const imgUrl = getCardImageUrl(selectedCard.id);

        return (
            <DetailPanel>
                <CardBackdrop $bgImage={imgUrl} />
                <DetailContent>
                    <CardImageContainer>
                        <BigCardImage src={imgUrl} alt={selectedCard.name} />
                        <RarityBadge $rarity={getCardRarity(selectedCard)}>
                            {getCardRarity(selectedCard)}
                        </RarityBadge>
                    </CardImageContainer>

                    <CardTitle>{selectedCard.name}</CardTitle>
                    




                    <TagsContainer>
                    {selectedCard.attribute && <Tag $color="#d97706">{selectedCard.attribute}</Tag>}
                    {selectedCard.race && <Tag $color="#2563eb">{selectedCard.race}</Tag>}
                    {selectedCard.level && <Tag $color="#dc2626">Level {selectedCard.level}</Tag>}
                    </TagsContainer>

                    <StatGrid>
                        {selectedCard.atk !== undefined && selectedCard.atk !== null && (
                        <StatBox $statType="atk">
                            <StatLabel><Sword size={14} /> ATK</StatLabel>
                            <StatValue>{selectedCard.atk}</StatValue>
                        </StatBox>
                        )}
                        {selectedCard.def !== undefined && (
                            <StatBox $statType="def">
                                <StatLabel><Shield size={14} /> DEF</StatLabel>
                                <StatValue>{selectedCard.def}</StatValue>
                            </StatBox>
                        )}
                    </StatGrid>

                    <DescriptionBox>
                        {selectedCard.desc}
                    </DescriptionBox>

                    <AiButton onClick={() => handleAiAnalysis(selectedCard.name)} disabled={isAiLoading}>
                        <Sparkles size={18} />
                        {isAiLoading ? 'ANALISANDO...' : 'ANALISAR CARD'}
                    </AiButton>
                </DetailContent>

                {showAiModal && createPortal(
                    <ModalOverlay onClick={() => setShowAiModal(false)}>
                        <ModalContent onClick={e => e.stopPropagation()}>
                            <ModalHeader>
                                <h3><BrainCircuit size={20} style={{display:'inline', marginRight:'8px'}}/> Análise Tática</h3>
                                <CloseButton onClick={() => setShowAiModal(false)}><X size={20}/></CloseButton>
                            </ModalHeader>
                            <ModalBody>
                                {isAiLoading ? (
                                    <div style={{textAlign: 'center', padding: '3rem', color: '#94a3b8'}}>
                                        <Sparkles className="animate-spin" size={48} style={{marginBottom: '1rem', color: 'var(--accent-color)'}}/>
                                        <p style={{fontSize: '1.1rem', letterSpacing: '0.05em'}}>Consultando  Oráculo...</p>
                                    </div>
                                ) : aiResult ? (
                                    <>
                                        <div style={{marginBottom: '2rem'}}>
                                            <div style={{
                                                fontSize: '0.8rem', 
                                                textTransform: 'uppercase', 
                                                color: '#94a3b8', 
                                                letterSpacing: '0.1em',
                                                marginBottom: '0.8rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}>
                                                <BrainCircuit size={14} /> Resumo Estratégico
                                            </div>
                                            <p style={{
                                                fontSize: '1rem',
                                                lineHeight: '1.7',
                                                color: '#e2e8f0',
                                                padding: '1.5rem',
                                                background: 'rgba(255,255,255,0.03)',
                                                borderRadius: '12px',
                                                border: '1px solid rgba(255,255,255,0.05)',
                                                borderLeft: '4px solid var(--primary-color)'
                                            }}>{aiResult.summary}</p>
                                        </div>
                                        <div>
                                            <div style={{
                                                fontSize: '0.8rem', 
                                                textTransform: 'uppercase', 
                                                color: '#94a3b8', 
                                                letterSpacing: '0.1em',
                                                marginBottom: '1rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}>
                                                <Sparkles size={14} /> Melhores Momentos de Uso
                                            </div>
                                            <ul style={{display: 'flex', flexDirection: 'column', gap: '0.8rem'}}>
                                                {aiResult.usage_moments.map((moment, idx) => (
                                                    <li key={idx} style={{
                                                        background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, transparent 100%)',
                                                        padding: '1rem 1.2rem',
                                                        borderRadius: '8px',
                                                        border: '1px solid rgba(255,255,255,0.05)',
                                                        fontSize: '0.95rem',
                                                        display: 'flex',
                                                        gap: '12px',
                                                        alignItems: 'center',
                                                        transition: 'transform 0.2s',
                                                        cursor: 'default'
                                                    }}>
                                                        <span style={{
                                                            color: 'var(--primary-color)', 
                                                            fontWeight: '900', 
                                                            fontFamily: 'var(--font-heading)',
                                                            fontSize: '1.1rem',
                                                            opacity: 0.8
                                                        }}>0{idx + 1}</span>
                                                        <span style={{color: '#cbd5e1'}}>{moment}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </>
                                ) : null}
                            </ModalBody>
                        </ModalContent>
                    </ModalOverlay>,
                    document.body
                )}
            </DetailPanel>
        );
    };

    if (loadingDeck) {
        return (
            <PageWrapper>
                <Header />
                <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100%', color:'white'}}>
                    <Loader2 className="animate-spin" size={32} style={{marginRight: 12}} />
                    Loading Deck...
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <Header />
            <SupportButton />
            <ContentGrid>
                {/* LEFT: Details Panel */}
                <Column>
                    {renderCardDetails()}
                </Column>

                {/* CENTER: Deck Area */}
                <Column>
                    <ColumnHeader>
                       <DeckNameInput 
                            value={deckName} 
                            onChange={e => setDeckName(e.target.value)} 
                       />

                       <div style={{display:'flex', gap:'0.8rem'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.3)', padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)'}}>
                               <img src={cpurIcon} alt="UR CP" style={{width: '20px', height: '20px'}} />
                               <span style={{color: '#fde0ffff', fontWeight: 'bold', fontSize: '0.9rem'}}>{urCost}</span>
                           </div>
                           <div style={{display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.3)', padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)'}}>
                               <img src={cpsrIcon} alt="SR CP" style={{width: '20px', height: '20px'}} />
                               <span style={{color: '#cbd5e1', fontWeight: 'bold', fontSize: '0.9rem'}}>{srCost}</span>
                           </div>
                           <ActionButton $variant="secondary" onClick={() => setShowAI(!showAI)}>
                               <Sparkles size={16} className={showAI ? "text-yellow-400" : ""} />
                               {showAI ? 'IA' : 'IA'}
                           </ActionButton>
                           <ActionButton $variant="primary" onClick={handleSave}>
                               <Save size={16} />
                               Salvar
                           </ActionButton>
                       </div>
                    </ColumnHeader>

                    {showAI ? (
                        <AIContainer>
                            <AiAnalysisPanel 
                                onAnalyze={handleDeckAnalysis}
                                isLoading={isAnalyzing}
                                result={deckAnalysis}
                                isDisabled={(mainDeck.length + extraDeck.length) === 0}
                                onClose={() => setShowAI(false)}
                            />
                        </AIContainer>
                    ) : (
                        <DeckAreaContainer>
                            <DeckSection>
                                <SectionLabel>
                                    <span>Deck Principal</span>
                                    <span style={{color: mainDeck.length >= 40 ? 'var(--success-color)' : 'var(--text-secondary)'}}>
                                        {mainDeck.length} / 40
                                    </span>
                                </SectionLabel>
                                <CardGrid>
                                    {mainDeck.map((card, idx) => {
                                        const imgUrlSmall = getCardImageUrl(card.id, true);
                                        return (
                                            <MiniCard 
                                                key={`main-${idx}`} 
                                                onClick={() => setSelectedCard(card)}
                                                onContextMenu={(e) => {
                                                    e.preventDefault();
                                                    handleRemoveFromDeck(idx, false);
                                                }}
                                            >
                                                <img src={imgUrlSmall} alt="" loading="lazy"/>
                                            </MiniCard>
                                        );
                                    })}
                                </CardGrid>
                            </DeckSection>

                            <DeckSection>
                                <SectionLabel>
                                    <span>Deck Extra</span>
                                    <span>{extraDeck.length} / 15</span>
                                </SectionLabel>
                                <CardGrid>
                                    {extraDeck.map((card, idx) => {
                                        const imgUrlSmall = getCardImageUrl(card.id, true);
                                        return (
                                            <MiniCard 
                                                key={`extra-${idx}`} 
                                                onClick={() => setSelectedCard(card)}
                                                onContextMenu={(e) => {
                                                    e.preventDefault();
                                                    handleRemoveFromDeck(idx, true);
                                                }}
                                            >
                                                <img src={imgUrlSmall} alt="" loading="lazy"/>
                                            </MiniCard>
                                        );
                                    })}
                                </CardGrid>
                            </DeckSection>
                        </DeckAreaContainer>
                    )}
                </Column>

                {/* RIGHT: Search Catalog */}
                <Column>
                    <SearchContainer>
                        <SearchInputRow>
                            <SearchRowInner>
                                <Search size={20} color="var(--accent-color)" />
                                <input 
                                    placeholder="Buscar cartas..." 
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </SearchRowInner>
                            <small>
                                 <Info size={14} style={{marginRight:4}}/>
                                 {searchTerm ? `Resultados para "${searchTerm}"` : "Principais Staples"}
                            </small>
                        </SearchInputRow>
                        
                        {searchLoading ? (
                            <div style={{padding:'2rem', display:'flex', justifyContent:'center', alignItems: 'center', flex: 1}}>
                                <Loader2 className="animate-spin" size={48} color="var(--primary-color)" />
                            </div>
                        ) : (
                            <CatalogGrid>
                                {searchResults.length === 0 && searchTerm ? (
                                    <div style={{gridColumn:'1/-1', textAlign:'center', padding:'3rem', color:'var(--text-secondary)'}}>
                                        <div style={{marginBottom: '1rem', fontSize: '2rem'}}>🔍</div>
                                        Nenhuma carta encontrada.
                                    </div>
                                ) : null}

                                {searchResults.map(card => {
                                    const imgUrlSmall = getCardImageUrl(card.id, true);
                                    return (
                                        <MiniCard 
                                            key={card.id} 
                                            onClick={() => {
                                                setSelectedCard(card);
                                                handleAddToDeck(card);
                                            }}
                                        >
                                            <img src={imgUrlSmall} alt="" loading="lazy" />
                                        </MiniCard>
                                    );
                                })}
                            </CatalogGrid>
                        )}
                    </SearchContainer>
                </Column>
            </ContentGrid>
        </PageWrapper>
    );
};
