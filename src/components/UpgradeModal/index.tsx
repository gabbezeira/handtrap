import React, { useState } from 'react';
import { api } from '../../services/api';
import { 
    Overlay, ModalContainer, PlanColumn, PlanHeader, PlanTitle, PlanPrice, 
    FeatureList, FeatureItem, SubscribeButton, CloseButton 
} from './styles';
import { FaCheck, FaTimes, FaBolt, FaBrain, FaGem } from 'react-icons/fa';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubscribe = async () => {
        setLoading(true);
        try {
            const response = await api.post('/create-checkout-session');
            if (response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (error) {
            console.error('Checkout failed', error);
            alert('Falha ao iniciar checkout. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Overlay onClick={onClose}>
            <ModalContainer onClick={e => e.stopPropagation()}>
                <CloseButton onClick={onClose}>&times;</CloseButton>
                
                {/* FREE PLAN */}
                <PlanColumn>
                    <PlanHeader>
                        <PlanTitle color="#aaa">Gratuito</PlanTitle>
                        <PlanPrice>R$ 0</PlanPrice>
                    </PlanHeader>
                    <FeatureList>
                        <FeatureItem><FaCheck color="#aaa"/> 1 Deck Diário (IA Básica)</FeatureItem>
                        <FeatureItem><FaCheck color="#aaa"/> 3 Mãos / 5 Cartas</FeatureItem>
                        <FeatureItem><FaCheck color="#aaa"/> Análise Padrão</FeatureItem>
                        <FeatureItem><FaTimes color="#555"/> Sem API Customizada</FeatureItem>
                    </FeatureList>
                </PlanColumn>

                {/* PREMIUM PLAN */}
                <PlanColumn $isPremium>
                    <PlanHeader>
                        <PlanTitle color="#a855f7">Premium</PlanTitle>
                        <PlanPrice>R$ 19<span>,90/mês</span></PlanPrice>
                    </PlanHeader>
                    <FeatureList>
                        <FeatureItem><FaBrain color="#a855f7"/> <b>IA Pro (Raciocínio Avançado)</b></FeatureItem>
                        <FeatureItem><FaGem color="#a855f7"/> 3 Decks Diários</FeatureItem>
                        <FeatureItem><FaCheck color="#a855f7"/> 5 Mãos / 10 Cartas</FeatureItem>
                        <FeatureItem><FaBolt color="#a855f7"/> Acesso à API Customizada</FeatureItem>
                        <FeatureItem><FaCheck color="#a855f7"/> Prioridade de Suporte</FeatureItem>
                    </FeatureList>
                    <SubscribeButton onClick={handleSubscribe} disabled={loading}>
                        {loading ? 'Processando...' : 'Assinar Agora'}
                    </SubscribeButton>
                </PlanColumn>
            </ModalContainer>
        </Overlay>
    );
};
