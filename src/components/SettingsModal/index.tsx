import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Settings,
  X,
  Volume2,
  VolumeX,
  Cpu,
  Crown,
  ChevronRight,
  ExternalLink,
  Loader2,
  Calendar,
  CreditCard,
  Lock,
} from 'lucide-react';
import {
  Overlay,
  Modal,
  Header,
  Title,
  CloseButton,
  Body,
  MenuSection,
  MenuSectionTitle,
  MenuRow,
  MenuRowContent,
  MenuRowTitle,
  MenuRowDescription,
  MenuButton,
  VolumeSlider,
  VolumeValue,
  SubscriptionCard,
  PlanBadge,
  StatusBadge,
  SubscriptionInfo,
  SubscriptionDetail,
  SubscriptionActions,
  ActionButton,
  Footer,
  CloseActionButton,
  LockedOverlay,
  LockedContent,
  PremiumTag,
} from './styles';
import { useMusic } from '../../contexts/MusicContext';
import { useAuth } from '../../contexts/AuthContext';
import { CustomApiModal } from '../CustomApiModal';
import { isCustomApiEnabled } from '../../services/customAiService';
import { db } from '../../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';
import { api } from '../../services/api';
import { UpgradeModal } from '../UpgradeModal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SubscriptionData {
  plan: 'free' | 'premium';
  status: 'active' | 'canceled' | 'past_due' | null;
  startDate: Date | null;
  stripeCustomerId: string | null;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { volume, isMuted, setVolume, toggleMute } = useMusic();
  const { user } = useAuth();
  const [showCustomApiModal, setShowCustomApiModal] = useState(false);
  const [customApiEnabled, setCustomApiEnabled] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionData>({
    plan: 'free',
    status: null,
    startDate: null,
    stripeCustomerId: null,
  });
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const isPremium = subscription.plan === 'premium';

  // Check if custom API is enabled
  useEffect(() => {
    setCustomApiEnabled(isCustomApiEnabled());
  }, [showCustomApiModal, isOpen]);

  // Listen for subscription changes
  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const sub = data.subscription || {};
        setSubscription({
          plan: sub.plan || 'free',
          status: sub.status || null,
          startDate: sub.startDate?.toDate() || null,
          stripeCustomerId: sub.stripeCustomerId || null,
        });
      }
    });

    return () => unsubscribe();
  }, [user]);

  const handleManageSubscription = async () => {
    if (!subscription.stripeCustomerId) return;

    setLoadingPortal(true);
    try {
      const response = await api.post('/billing-portal');
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Failed to open billing portal:', error);
    } finally {
      setLoadingPortal(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      <Overlay onClick={onClose}>
        <Modal onClick={(e) => e.stopPropagation()}>
          <Header>
            <Title>
              <Settings size={22} />
              Configurações
            </Title>
            <CloseButton onClick={onClose}>
              <X size={18} />
            </CloseButton>
          </Header>

          <Body>
            {/* Audio Section */}
            <MenuSection>
              <MenuSectionTitle>🔊 Áudio</MenuSectionTitle>

              <MenuRow>
                <MenuRowContent>
                  <MenuRowTitle>
                    <Volume2 size={16} />
                    Volume da Música
                  </MenuRowTitle>
                  <VolumeValue>{Math.round(volume * 100)}%</VolumeValue>
                </MenuRowContent>
                <VolumeSlider
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                />
              </MenuRow>

              <MenuRow as="button" onClick={toggleMute}>
                <MenuRowContent>
                  <MenuRowTitle>
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    {isMuted ? 'Desmutar' : 'Mutar'} Áudio
                  </MenuRowTitle>
                  <MenuRowDescription>
                    {isMuted ? 'Clique para ativar' : 'Clique para silenciar'}
                  </MenuRowDescription>
                </MenuRowContent>
              </MenuRow>
            </MenuSection>

            {/* API Section */}
            <MenuSection>
              <MenuSectionTitle>🤖 Inteligência Artificial</MenuSectionTitle>

              <MenuButton
                onClick={() =>
                  isPremium ? setShowCustomApiModal(true) : setShowUpgradeModal(true)
                }
                $locked={!isPremium}
              >
                <MenuRowContent>
                  <MenuRowTitle>
                    <Cpu size={16} />
                    API Personalizada
                  </MenuRowTitle>
                  <MenuRowDescription>
                    {isPremium
                      ? customApiEnabled
                        ? 'Ativada'
                        : 'Use sua própria API key'
                      : 'Recurso exclusivo Premium'}
                  </MenuRowDescription>
                </MenuRowContent>
                {isPremium ? (
                  <ChevronRight size={18} />
                ) : (
                  <PremiumTag>
                    <Lock size={12} />
                    Premium
                  </PremiumTag>
                )}

                {!isPremium && (
                  <LockedOverlay>
                    <LockedContent>
                      <Lock size={20} />
                      <span>Recurso Premium</span>
                    </LockedContent>
                  </LockedOverlay>
                )}
              </MenuButton>
            </MenuSection>

            {/* Subscription Section */}
            <MenuSection>
              <MenuSectionTitle>💎 Sua Assinatura</MenuSectionTitle>

              <SubscriptionCard>
                <SubscriptionInfo>
                  <PlanBadge $premium={subscription.plan === 'premium'}>
                    <Crown size={14} />
                    {subscription.plan === 'premium' ? 'Premium' : 'Gratuito'}
                  </PlanBadge>

                  {subscription.status && (
                    <StatusBadge $status={subscription.status}>
                      {subscription.status === 'active'
                        ? 'Ativo'
                        : subscription.status === 'canceled'
                          ? 'Cancelado'
                          : 'Pendente'}
                    </StatusBadge>
                  )}
                </SubscriptionInfo>

                {subscription.plan === 'premium' && subscription.startDate && (
                  <SubscriptionDetail>
                    <Calendar size={14} />
                    Membro desde: {formatDate(subscription.startDate)}
                  </SubscriptionDetail>
                )}

                <SubscriptionActions>
                  {subscription.plan === 'premium' ? (
                    <ActionButton
                      onClick={handleManageSubscription}
                      disabled={loadingPortal || !subscription.stripeCustomerId}
                    >
                      {loadingPortal ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <CreditCard size={14} />
                      )}
                      Gerenciar Assinatura
                      <ExternalLink size={12} />
                    </ActionButton>
                  ) : (
                    <ActionButton
                      $primary
                      onClick={() => {
                        onClose();
                        // Trigger upgrade modal - this would be better with a context/event
                        window.dispatchEvent(new CustomEvent('open-upgrade-modal'));
                      }}
                    >
                      <Crown size={14} />
                      Fazer Upgrade para Premium
                    </ActionButton>
                  )}
                </SubscriptionActions>
              </SubscriptionCard>
            </MenuSection>
          </Body>

          <Footer>
            <CloseActionButton onClick={onClose}>Fechar</CloseActionButton>
          </Footer>
        </Modal>
      </Overlay>

      <CustomApiModal isOpen={showCustomApiModal} onClose={() => setShowCustomApiModal(false)} />

      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
    </>,
    document.body,
  );
};
