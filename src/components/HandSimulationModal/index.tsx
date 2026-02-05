import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, RefreshCw, Dices } from 'lucide-react';
import { CardData } from '../../services/cardDatabase';
import { getCardImageUrl } from '../../utils/imageUrl';
import {
  ActionButton,
  Body,
  CardSlot,
  CloseButton,
  Footer,
  HandGrid,
  Header,
  ModalContent,
  Overlay,
  DeckMinMessage,
  ErrorBanner,
  FooterInfo,
  IAPowered,
  UsageInfo,
  AnalyzeActionButton,
  DicesIcon,
  LoaderOverlay,
  LoaderContainer,
} from './styles';
import { useAuth } from '../../contexts/AuthContext';
import { analyzeHandWithCache, AiHandResponse } from '../../services/aiAnalysisService';
import { BrainCircuit, Sparkles } from 'lucide-react';
import { HandAnalysisResultModal } from './HandAnalysisResultModal';
import { AiLoader } from '../AiLoader';
import { UpgradeModal } from '../UpgradeModal';
import { db } from '../../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';

interface HandSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  deck: CardData[]; // Main Deck cards
  extraDeck: CardData[]; // Extra Deck cards (for context hash)
}

export const HandSimulationModal: React.FC<HandSimulationModalProps> = ({
  isOpen,
  onClose,
  deck,
  extraDeck,
}) => {
  const { user } = useAuth();
  const [hand, setHand] = useState<CardData[]>([]);

  // Analysis State
  const [analysis, setAnalysis] = useState<AiHandResponse | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [usageInfo, setUsageInfo] = useState({ used: 0, limit: 3 });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [userPlan, setUserPlan] = useState<'free' | 'premium'>('free');

  const drawHand = () => {
    setAnalysis(null);
    setError(null);
    setShowResultModal(false);

    if (!deck || deck.length === 0) return;

    // Fisher-Yates Shuffle copy (Main Deck Only)
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setHand(shuffled.slice(0, 5));
  };

  // Real-time Usage & Plan Update
  useEffect(() => {
    if (!user) return;

    const loadInitial = async () => {
      const { getHandAnalysisUsage } = await import('../../services/usersService');
      const data = await getHandAnalysisUsage(user.uid);
      setUsageInfo(data);
    };
    loadInitial();

    // Listen for Sub changes
    const subUnsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      const data = doc.data();
      setUserPlan(data?.subscription?.plan || 'free');
    });

    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid, 'usage', 'hand_analysis'),
      async (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const today = new Date().toISOString().split('T')[0];
          if (data.date === today) {
            setUsageInfo((prev) => ({ ...prev, used: data.count || 0 }));
          } else {
            setUsageInfo((prev) => ({ ...prev, used: 0 }));
          }
        }
      },
    );

    return () => {
      unsubscribe();
      subUnsubscribe();
    };
  }, [user]);

  useEffect(() => {
    if (isOpen) {
      drawHand();
    }
  }, [isOpen]);

  const handleAnalyze = async () => {
    if (!user) {
      setError('Faça login para usar a IA.');
      return;
    }

    if (hand.length !== 5) return;

    if (analysis) {
      setShowResultModal(true);
      return;
    }

    setLoadingAnalysis(true);
    setError(null);

    try {
      const handIds = hand.map((c: CardData) => c.id);
      const handNames = hand.map((c: CardData) => c.name);
      const fullDeck = [...deck, ...extraDeck];
      const deckIds = fullDeck.map((c: CardData) => c.id);
      const nameMap = new Map<string, number>();
      fullDeck.forEach((c: CardData) => nameMap.set(c.name, (nameMap.get(c.name) || 0) + 1));
      const deckNames = Array.from(nameMap.entries()).map(([name, count]) => `${count}x ${name}`);

      const result = await analyzeHandWithCache(handIds, deckIds, handNames, deckNames);
      setAnalysis(result);
      setShowResultModal(true);
    } catch (err: any) {
      console.error(err);
      if (err.message === 'LIMIT_REACHED') {
        if (userPlan === 'free') {
          setShowUpgradeModal(true);
          setError('Limite Gratuito Atingido. Seja Premium para mais!');
        } else {
          setError('Limite Diário Premium Atingido.');
        }
      } else {
        setError('Erro ao analisar mão.');
      }
    } finally {
      setLoadingAnalysis(false);
    }
  };

  // ... (rest of code)

  if (!isOpen) return null;

  return createPortal(
    <>
      <Overlay onClick={onClose}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          {/* ... existing header/body ... */}
          <Header>
            <h3>
              <DicesIcon>
                <Dices size={24} />
              </DicesIcon>{' '}
              Simulação de Mão Inicial
            </h3>
            <CloseButton onClick={onClose}>
              <X size={24} />
            </CloseButton>
          </Header>
          <Body>
            {deck.length < 5 ? (
              <DeckMinMessage>
                O deck precisa de pelo menos 5 cartas para simular uma mão.
              </DeckMinMessage>
            ) : (
              <>
                <HandGrid>
                  {hand.map((card, idx) => (
                    <CardSlot key={`${card.id}-${idx}`}>
                      <img src={getCardImageUrl(card.id)} alt={card.name} />
                    </CardSlot>
                  ))}
                </HandGrid>

                {error && <ErrorBanner>{error}</ErrorBanner>}
              </>
            )}
          </Body>
          <Footer>
            <FooterInfo>
              <IAPowered>
                <Sparkles size={12} color="#a855f7" /> IA Powered
              </IAPowered>
              <UsageInfo>
                Uso: {usageInfo.used}/{usageInfo.limit} análises hoje
              </UsageInfo>
            </FooterInfo>

            <ActionButton $variant="secondary" onClick={onClose}>
              Fechar
            </ActionButton>

            <AnalyzeActionButton
              $variant="primary"
              onClick={handleAnalyze}
              disabled={loadingAnalysis}
            >
              <BrainCircuit size={18} />
              {analysis ? 'Ver Análise' : 'Analisar Mão'}
            </AnalyzeActionButton>

            <ActionButton $variant="primary" onClick={drawHand}>
              <RefreshCw size={18} />
              Redraw
            </ActionButton>
          </Footer>
        </ModalContent>
      </Overlay>

      {loadingAnalysis && (
        <LoaderOverlay>
          <LoaderContainer>
            <AiLoader message="Analisando sua Mão..." />
          </LoaderContainer>
        </LoaderOverlay>
      )}

      <HandAnalysisResultModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        analysis={analysis}
      />

      {/* Dynamic Import or passed prop would be better, but direct usage is fine here to fix quickly */}
      {showUpgradeModal && (
        <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
      )}
    </>,
    document.body,
  );
};
