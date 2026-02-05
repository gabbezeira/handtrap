import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import { useCardDatabase } from '../../contexts/CardContext';
import { AiAnalysisPanel } from '../../components/AiAnalysisPanel';
import { CardData } from '../../services/cardDatabase';
import { HandSimulationModal } from '../../components/HandSimulationModal';
import { UpgradeModal } from '../../components/UpgradeModal';
import { AiLoader } from '../../components/AiLoader';
import {
  Search,
  Sword,
  Shield,
  BrainCircuit,
  Sparkles,
  X,
  Info,
  Box,
  Loader2,
  Save,
  Dices,
  Share2,
  Key,
  Plus,
} from 'lucide-react';
import { saveDeck, getDeck } from '../../services/deckService';
import {
  analyzeDeckWithCache,
  analyzeCardWithCache,
  AiDeckResponse,
  AiCardResponse,
} from '../../services/aiAnalysisService';
import { getDeckAnalysisUsage } from '../../services/usersService';
import { getCustomApiConfig } from '../../services/customAiService';
import { getCardImageUrl } from '@/utils/imageUrl';
import { db } from '../../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';
import { Header } from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';
import { useModal } from '../../contexts/ModalContext';
import cpurIcon from '../../assets/images/cpur.png';
import cpsrIcon from '../../assets/images/cpsr.png';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { SupportButton } from '../../components/SupportButton';
import { encodeDeck, decodeDeck } from '../../utils/deckShareUtils';

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
  DeckCount,
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
  CloseButton,
  LoadingContainer,
  HeaderActions,
  CPContainer,
  CPValueUR,
  CPValueSR,
  AiSummarySection,
  AiSummaryTitle,
  AiSummaryContent,
  UsageList,
  UsageListItem,
  UsageNumber,
  UsageText,
  SearchLoadingState,
  SearchEmptyState,
  SearchEmptyIcon,
  IconWrapper,
  CustomApiBanner,
  CustomApiBannerText,
  CustomApiBannerTitle,
  CustomApiBannerSubtitle,
  MobileAddButtonContainer,
  MobileAddButton,
  MobileSearchCloseButton,
} from './styles';

const getCardRarity = (card: CardData): 'UR' | 'SR' | 'R' | 'N' => {
  if (!card.card_sets) return 'N';

  const sets = card.card_sets;
  const hasUR = sets.some(
    (s) =>
      s.set_rarity.includes('Ultra') ||
      s.set_rarity.includes('Secret') ||
      s.set_rarity.includes('Prismatic') ||
      s.set_rarity.includes('Platinum') ||
      s.set_rarity.includes('Ultimate') ||
      s.set_rarity.includes('Ghost'),
  );
  if (hasUR) return 'UR';

  const hasSR = sets.some((s) => s.set_rarity.includes('Super'));
  if (hasSR) return 'SR';

  const hasR = sets.some((s) => s.set_rarity.includes('Rare'));
  if (hasR) return 'R';

  return 'N';
};

export const DeckBuilder = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const deckId = searchParams.get('id');

  const { searchResults, searchCards, searchLoading } = useCardDatabase();

  const [searchTerm, setSearchTerm] = useState('');
  const [mainDeck, setMainDeck] = useState<CardData[]>([]);
  const [extraDeck, setExtraDeck] = useState<CardData[]>([]);
  const [deckName, setDeckName] = useState('Novo Deck');
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [showAI, setShowAI] = useState(false);
  const [loadingDeck, setLoadingDeck] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AiCardResponse | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showHandModal, setShowHandModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const [deckAnalysis, setDeckAnalysis] = useState<AiDeckResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisUsage, setAnalysisUsage] = useState({ used: 0, limit: 10 });
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const [userPlan, setUserPlan] = useState<'free' | 'premium'>('free');

  // Real-time Usage & Plan Update
  useEffect(() => {
    if (!user) return;

    const subUnsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      const data = doc.data();
      setUserPlan(data?.subscription?.plan || 'free');
    });

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid, 'usage', 'deck_analysis'), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const today = new Date().toISOString().split('T')[0];
        if (data.date === today) {
          setAnalysisUsage((prev) => ({ ...prev, used: data.count || 0 }));
        } else {
          setAnalysisUsage((prev) => ({ ...prev, used: 0 }));
        }
      } else {
        setAnalysisUsage((prev) => ({ ...prev, used: 0 }));
      }
    });

    return () => {
      unsubscribe();
      subUnsubscribe();
    };
  }, [user]);

  const urCost = [...mainDeck, ...extraDeck].filter((c) => getCardRarity(c) === 'UR').length * 30;
  const srCost = [...mainDeck, ...extraDeck].filter((c) => getCardRarity(c) === 'SR').length * 30;

  const { showModal } = useModal();
  const { playAddSound, playRemoveSound } = useSoundEffects();

  const fetchAnalysisUsage = async () => {
    if (!user) return;
    const usage = await getDeckAnalysisUsage(user.uid);
    setAnalysisUsage(usage);
  };

  useEffect(() => {
    if (showAI && user) {
      fetchAnalysisUsage();
    }
  }, [showAI, user]);

  // Clear cached analysis when deck composition changes
  // Using JSON of sorted IDs to detect any card addition/removal/swap
  const deckSignature = JSON.stringify([...mainDeck, ...extraDeck].map((c) => c.id).sort());
  useEffect(() => {
    setDeckAnalysis(null);
  }, [deckSignature]);

  const handleDeckAnalysis = async () => {
    if (!user) {
      showModal({
        title: 'Login Necessário',
        message: 'Você precisa estar logado para usar a análise de IA.',
        type: 'info',
      });
      return;
    }

    if (mainDeck.length < 40) {
      showModal({
        title: 'Deck Incompleto',
        message: 'O Deck Principal deve ter no mínimo 40 cartas para ser analisado.',
        type: 'info',
      });
      return;
    }
    const allCards = mainDeck.concat(extraDeck);
    if (allCards.length === 0) return;

    setShowAI(true);
    setIsAnalyzing(true);
    setDeckAnalysis(null);

    try {
      const cardIds = allCards.map((c) => c.id);

      const nameMap = new Map<string, number>();
      allCards.forEach((c) => {
        nameMap.set(c.name, (nameMap.get(c.name) || 0) + 1);
      });
      const deckListForAi = Array.from(nameMap.entries()).map(
        ([name, count]) => `${count}x ${name}`,
      );

      // forceRefresh: true because user explicitly clicked to generate new analysis
      const result = await analyzeDeckWithCache(cardIds, deckListForAi, true);
      setDeckAnalysis(result);
    } catch (error: any) {
      console.error('AI Analysis Failed', error);

      const errCode = error.response?.data?.error || error.message;

      if (errCode === 'LIMIT_REACHED') {
        if (userPlan === 'free') {
          setShowUpgradeModal(true);
        } else {
          showModal({
            title: 'Limite Atingido',
            message: 'Limite diário de decks atingido.',
            type: 'info',
          });
        }
        setShowAI(false);
        return;
      }

      if (error.response?.status === 404) {
        setDeckAnalysis(null);
        return;
      }

      const isTimeout = error.code === 'ECONNABORTED' || error.message?.includes('timeout');
      const isServerError = error.response?.status >= 500;

      if (isTimeout || isServerError) {
        showModal({
          title: '⚠️ Serviço Temporariamente Indisponível',
          message: 'A API do Google Gemini está enfrentando instabilidade no momento.',
          type: 'warning',
        });
      } else {
        showModal({
          title: 'Erro de Análise',
          message: 'Falha ao buscar análise. Tente novamente.',
          type: 'error',
        });
      }
      setShowAI(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (showAI && !deckAnalysis && !isAnalyzing && user) {
      const checkCommunityAnalysis = async () => {
        const allCards = mainDeck.concat(extraDeck);
        if (allCards.length < 40) return;

        setIsAnalyzing(true);
        try {
          const cardIds = allCards.map((c) => c.id);
          const { checkDeckAnalysisCache } = await import('../../services/aiAnalysisService');
          const cachedAnalysis = await checkDeckAnalysisCache(cardIds);

          if (cachedAnalysis) {
            setDeckAnalysis(cachedAnalysis);
          }
        } catch (e) {
          console.error('Auto-check failed', e);
        } finally {
          setIsAnalyzing(false);
        }
      };
      checkCommunityAnalysis();
    }
  }, [showAI, mainDeck, extraDeck, user]);

  const handleForceRefresh = async () => {
    if (!user) return;
    const allCards = mainDeck.concat(extraDeck);

    setIsAnalyzing(true);
    try {
      const cardIds = allCards.map((c) => c.id);
      const nameMap = new Map<string, number>();
      allCards.forEach((c) => nameMap.set(c.name, (nameMap.get(c.name) || 0) + 1));
      const deckListForAi = Array.from(nameMap.entries()).map(
        ([name, count]) => `${count}x ${name}`,
      );

      const result = await analyzeDeckWithCache(cardIds, deckListForAi, true);
      setDeckAnalysis(result);
      await fetchAnalysisUsage();
    } catch (error: any) {
      const errCode = error.response?.data?.error || error.message;
      if (errCode === 'LIMIT_REACHED') {
        if (userPlan === 'free') {
          setShowUpgradeModal(true);
        } else {
          showModal({
            title: 'Limite Atingido',
            message: 'Limite diário de decks atingido.',
            type: 'info',
          });
        }
      } else {
        showModal({
          title: 'Erro na Análise',
          message: error.message || 'Falha ao atualizar análise.',
          type: 'error',
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAiAnalysis = async (cardName: string) => {
    if (!user) {
      showModal({
        title: 'Login Necessário',
        message: 'Você precisa estar logado para analisar cartas.',
        type: 'info',
      });
      return;
    }

    setIsAiLoading(true);
    setShowAiModal(true);
    setAiResult(null);
    try {
      const result = await analyzeCardWithCache(cardName);
      setAiResult(result);
    } catch (error: any) {
      console.error(error);
      setShowAiModal(false);

      const errCode = error.response?.data?.error || error.message;
      if (errCode === 'LIMIT_REACHED') {
        if (userPlan === 'free') {
          setShowUpgradeModal(true);
        } else {
          showModal({
            title: 'Limite Atingido',
            message: 'Limite diário de cartas atingido.',
            type: 'info',
          });
        }
        return;
      }

      const isTimeout = error.code === 'ECONNABORTED' || error.message?.includes('timeout');
      const isServerError = error.response?.status >= 500;

      if (isTimeout || isServerError) {
        showModal({
          title: '⚠️ Serviço Temporariamente Indisponível',
          message:
            'A API do Google Gemini está enfrentando instabilidade no momento. Isso é temporário e não é um problema do Handtrap.\n\nTente novamente em alguns minutos ou aguarde a normalização do serviço.',
          type: 'warning',
        });
      } else {
        showModal({
          title: 'Erro de Análise',
          message: 'Não foi possível analisar a carta neste momento. Tente novamente.',
          type: 'error',
        });
      }
    } finally {
      setIsAiLoading(false);
    }
  };
  const sortCardsByName = (cards: CardData[]) => {
    return [...cards].sort((a, b) => {
      const nameA = a.name_en || a.name;
      const nameB = b.name_en || b.name;
      return nameA.localeCompare(nameB);
    });
  };

  useEffect(() => {
    const loadDeckData = async () => {
      if (!deckId) return;
      try {
        setLoadingDeck(true);
        const deck = await getDeck(deckId);
        if (deck) {
          setDeckName(deck.name);

          setMainDeck(sortCardsByName(deck.cards.main));
          setExtraDeck(sortCardsByName(deck.cards.extra));
        }
      } catch (error) {
        console.error('Failed to load deck', error);
      } finally {
        setLoadingDeck(false);
      }
    };
    loadDeckData();
  }, [deckId]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    searchCards(val);
  };

  const isExtraDeckType = (card: CardData): boolean => {
    const frame = card.frameType?.toLowerCase();
    return [
      'fusion',
      'synchro',
      'xyz',
      'link',
      'fusion_pendulum',
      'synchro_pendulum',
      'xyz_pendulum',
      'link_pendulum',
    ].includes(frame || '');
  };

  const handleAddToDeck = (card: CardData) => {
    const isExtra = isExtraDeckType(card);

    const countInMain = mainDeck.filter((c) => c.id === card.id).length;
    const countInExtra = extraDeck.filter((c) => c.id === card.id).length;
    const totalCopies = countInMain + countInExtra;

    if (totalCopies >= 3) {
      return;
    }

    if (isExtra) {
      if (extraDeck.length >= 15) {
        return;
      }
      setExtraDeck((prev) => sortCardsByName([...prev, card]));
      playAddSound();
    } else {
      if (mainDeck.length >= 40) {
        return;
      }
      setMainDeck((prev) => sortCardsByName([...prev, card]));
      playAddSound();
    }
  };

  const handleRemoveFromDeck = (index: number, isExtra: boolean) => {
    if (isExtra) {
      setExtraDeck((prev) => {
        const newDeck = [...prev];
        newDeck.splice(index, 1);
        playRemoveSound();
        return newDeck;
      });
    } else {
      setMainDeck((prev) => {
        const newDeck = [...prev];
        newDeck.splice(index, 1);
        playRemoveSound();
        return newDeck;
      });
    }
  };

  const handleShareDeck = () => {
    if (mainDeck.length === 0 && extraDeck.length === 0) {
      showModal({
        title: 'Deck Vazio',
        message: 'Adicione cartas antes de compartilhar.',
        type: 'info',
      });
      return;
    }

    try {
      const code = encodeDeck(mainDeck, extraDeck);
      const url = `${window.location.origin}${window.location.pathname}?import=${code}`;

      navigator.clipboard.writeText(url);
      showModal({
        title: 'Link Copiado!',
        message:
          'O link do deck foi copiado para sua área de transferência. Compartilhe com quem quiser!',
        type: 'success',
      });
    } catch (e) {
      console.error('Share error', e);
      showModal({ title: 'Erro', message: 'Falha ao gerar link.', type: 'error' });
    }
  };

  const { hydrateMissingCards, cardMap } = useCardDatabase();
  useEffect(() => {
    const importCode = searchParams.get('import');
    if (!importCode) return;

    const loadImportedDeck = async () => {
      setLoadingDeck(true);
      try {
        const { main: mainIds, extra: extraIds } = decodeDeck(importCode);

        if (mainIds.length === 0 && extraIds.length === 0) {
          throw new Error('Invalid Code');
        }

        const allIds = [...new Set([...mainIds, ...extraIds])];
        await hydrateMissingCards(allIds);

        setDeckName('Deck Compartilhado');
        setSearchParams({}, { replace: true });

        setPendingImport({ main: mainIds, extra: extraIds });
      } catch (e) {
        console.error('Import error', e);
        showModal({
          title: 'Erro na Importação',
          message: 'O código do deck é inválido ou está corrompido.',
          type: 'error',
        });
      } finally {
        setLoadingDeck(false);
      }
    };
    loadImportedDeck();
  }, [searchParams]);

  const [pendingImport, setPendingImport] = useState<{ main: number[]; extra: number[] } | null>(
    null,
  );

  useEffect(() => {
    if (!pendingImport) return;

    const { main, extra } = pendingImport;
    const resolvedMain: CardData[] = [];
    const resolvedExtra: CardData[] = [];
    let missing = false;

    main.forEach((id) => {
      const card = cardMap.get(id);
      if (card) resolvedMain.push(card);
      else missing = true;
    });

    extra.forEach((id) => {
      const card = cardMap.get(id);
      if (card) resolvedExtra.push(card);
      else missing = true;
    });

    if (!missing) {
      setMainDeck(resolvedMain);
      setExtraDeck(resolvedExtra);
      setPendingImport(null);
      showModal({
        title: 'Deck Importado',
        message: 'Deck carregado com sucesso via link!',
        type: 'success',
      });
    }
  }, [pendingImport, cardMap]);

  const handleSave = async () => {
    if (!user) {
      showModal({
        title: 'Login Necessário',
        message: 'Você precisa estar logado para salvar seus decks.',
        type: 'info',
      });
      return;
    }
    try {
      const savedId = await saveDeck(user.uid, {
        id: deckId || undefined,
        authorName: user.displayName || 'Duelist',
        name: deckName,
        isPublic: false,
        cards: {
          main: mainDeck,
          extra: extraDeck,
        },
        deckHash: '',
      });

      if (!deckId) {
        setSearchParams({ id: savedId });
      }
      showModal({
        title: 'Sucesso',
        message: 'O Deck foi salvo com sucesso!',
        type: 'success',
      });
    } catch (e: any) {
      console.error(e);
      showModal({
        title: 'Falha ao Salvar',
        message: 'Ocorreu um erro ao salvar o deck: ' + e.message,
        type: 'error',
      });
    }
  };

  const [cardUsage, setCardUsage] = useState({ used: 0, limit: 5 });

  // Fetch card usage limits on mount and real-time
  useEffect(() => {
    if (!user) return;

    const loadInitial = async () => {
      const { getCardAnalysisUsage } = await import('../../services/usersService');
      const data = await getCardAnalysisUsage(user.uid);
      setCardUsage(data);
    };
    loadInitial();

    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid, 'usage', 'card_analysis'),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const today = new Date().toISOString().split('T')[0];
          if (data.date === today) {
            setCardUsage((prev) => ({ ...prev, used: data.count || 0 }));
          } else {
            setCardUsage((prev) => ({ ...prev, used: 0 }));
          }
        }
      },
    );
    return () => unsubscribe();
  }, [user]);

  const isCardLimitReached = cardUsage.used >= cardUsage.limit;

  const renderCardDetails = () => {
    if (!selectedCard) {
      return (
        <NoSelectionInfo>
          <IconWrapper>
            <Box size={48} />
          </IconWrapper>
          <h3>Nenhuma Carta Selecionada</h3>
          <p>Clique em uma carta para ver detalhes.</p>
        </NoSelectionInfo>
      );
    }
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
                <StatLabel>
                  <Sword size={14} /> ATK
                </StatLabel>
                <StatValue>{selectedCard.atk}</StatValue>
              </StatBox>
            )}
            {selectedCard.def !== undefined && (
              <StatBox $statType="def">
                <StatLabel>
                  <Shield size={14} /> DEF
                </StatLabel>
                <StatValue>{selectedCard.def}</StatValue>
              </StatBox>
            )}
          </StatGrid>

          <DescriptionBox>{selectedCard.desc}</DescriptionBox>

          <AiButton
            onClick={() => handleAiAnalysis(selectedCard.name)}
            disabled={isAiLoading || isCardLimitReached}
            title={isCardLimitReached ? 'Limite diário atingido' : 'Analisar carta com IA'}
          >
            <Sparkles size={18} />
            {isAiLoading
              ? 'ANALISANDO...'
              : isCardLimitReached
                ? 'LIMITE ATINGIDO'
                : `ANALISAR (${cardUsage.used}/${cardUsage.limit})`}
          </AiButton>
        </DetailContent>

        {showAiModal &&
          createPortal(
            <ModalOverlay onClick={() => setShowAiModal(false)}>
              <ModalContent onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                  <h3>
                    <BrainCircuit size={20} /> Análise Tática
                  </h3>
                  <CloseButton onClick={() => setShowAiModal(false)}>
                    <X size={20} />
                  </CloseButton>
                </ModalHeader>
                <ModalBody>
                  {isAiLoading ? (
                    <AiLoader message="Analisando esta Carta..." />
                  ) : aiResult ? (
                    <>
                      {aiResult.source === 'custom' && (
                        <CustomApiBanner>
                          <Key size={18} />
                          <CustomApiBannerText>
                            <CustomApiBannerTitle>
                              Análise via API Personalizada (
                              {getCustomApiConfig()?.provider?.toUpperCase() || 'Custom'})
                            </CustomApiBannerTitle>
                            <CustomApiBannerSubtitle>
                              Usando sua própria chave de API. Não consome créditos.
                            </CustomApiBannerSubtitle>
                          </CustomApiBannerText>
                        </CustomApiBanner>
                      )}
                      <AiSummarySection>
                        <AiSummaryTitle>
                          <BrainCircuit size={14} /> Resumo Estratégico
                        </AiSummaryTitle>
                        <AiSummaryContent>{aiResult.summary}</AiSummaryContent>
                      </AiSummarySection>
                      <div>
                        <AiSummaryTitle>
                          <Sparkles size={14} /> Melhores Momentos de Uso
                        </AiSummaryTitle>
                        <UsageList>
                          {aiResult.usage_moments.map((moment, idx) => (
                            <UsageListItem key={idx}>
                              <UsageNumber>0{idx + 1}</UsageNumber>
                              <UsageText>{moment}</UsageText>
                            </UsageListItem>
                          ))}
                        </UsageList>
                      </div>
                    </>
                  ) : null}
                </ModalBody>
              </ModalContent>
            </ModalOverlay>,
            document.body,
          )}
      </DetailPanel>
    );
  };

  if (loadingDeck) {
    return (
      <PageWrapper>
        <Header />
        <LoadingContainer>
          <Loader2 className="animate-spin" size={32} />
          Carregando Deck...
        </LoadingContainer>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Header />
      <SupportButton />
      <ContentGrid>
        {/* LEFT: Details Panel */}
        <Column>{renderCardDetails()}</Column>

        {/* CENTER: Deck Area */}
        <Column>
          <ColumnHeader>
            <DeckNameInput value={deckName} onChange={(e) => setDeckName(e.target.value)} />

            <HeaderActions>
              <CPContainer>
                <img src={cpurIcon} alt="UR CP" />
                <CPValueUR>{urCost}</CPValueUR>
              </CPContainer>
              <CPContainer>
                <img src={cpsrIcon} alt="SR CP" />
                <CPValueSR>{srCost}</CPValueSR>
              </CPContainer>
              <ActionButton $variant="secondary" onClick={() => setShowHandModal(true)}>
                <Dices size={16} />
                Mão
              </ActionButton>
              {/* Mobile Add Button moved below */}
              <ActionButton $variant="secondary" onClick={() => setShowAI(!showAI)}>
                <Sparkles size={16} />
                IA
              </ActionButton>
              <ActionButton
                $variant="secondary"
                onClick={handleShareDeck}
                title="Compartilhar Link do Deck"
              >
                <Share2 size={16} />
              </ActionButton>
              <ActionButton $variant="primary" onClick={handleSave}>
                <Save size={16} />
                Salvar
              </ActionButton>
            </HeaderActions>
          </ColumnHeader>

          {/* Mobile Only: Full Width Add Button */}
          <MobileAddButtonContainer>
            <MobileAddButton onClick={() => setShowMobileSearch(true)}>
              <Plus size={18} /> ADICIONAR CARD AO DECK
            </MobileAddButton>
          </MobileAddButtonContainer>

          {showAI ? (
            <AIContainer>
              <AiAnalysisPanel
                onAnalyze={handleDeckAnalysis}
                onForceAnalyze={handleForceRefresh}
                isLoading={isAnalyzing}
                result={deckAnalysis}
                isDisabled={mainDeck.length + extraDeck.length === 0}
                onClose={() => setShowAI(false)}
                usageLimit={analysisUsage}
              />
            </AIContainer>
          ) : (
            <DeckAreaContainer>
              <DeckSection>
                <SectionLabel>
                  <span>Deck Principal</span>
                  <DeckCount $isComplete={mainDeck.length >= 40}>{mainDeck.length} / 40</DeckCount>
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
                        <img src={imgUrlSmall} alt="" loading="lazy" />
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
                        <img src={imgUrlSmall} alt="" loading="lazy" />
                      </MiniCard>
                    );
                  })}
                </CardGrid>
              </DeckSection>
            </DeckAreaContainer>
          )}
        </Column>

        {/* RIGHT: Search Catalog */}
        <Column className={showMobileSearch ? 'mobile-open' : ''}>
          <SearchContainer>
            <SearchInputRow>
              <SearchRowInner>
                <Search size={20} color="var(--accent-color)" />
                <input
                  placeholder="Buscar cartas..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {showMobileSearch && (
                  <MobileSearchCloseButton onClick={() => setShowMobileSearch(false)}>
                    <X size={20} />
                  </MobileSearchCloseButton>
                )}
              </SearchRowInner>
              <small>
                <Info size={14} />
                {searchTerm ? `Resultados para "${searchTerm}"` : 'Principais Staples'}
              </small>
            </SearchInputRow>

            {searchLoading ? (
              <SearchLoadingState>
                <Loader2 className="animate-spin" size={48} color="var(--primary-color)" />
              </SearchLoadingState>
            ) : (
              <CatalogGrid>
                {searchResults.length === 0 && searchTerm ? (
                  <SearchEmptyState>
                    <SearchEmptyIcon>🔍</SearchEmptyIcon>
                    Nenhuma carta encontrada.
                  </SearchEmptyState>
                ) : null}

                {searchResults.map((card) => {
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
      <HandSimulationModal
        isOpen={showHandModal}
        onClose={() => setShowHandModal(false)}
        deck={mainDeck}
        extraDeck={extraDeck}
      />
      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
    </PageWrapper>
  );
};
