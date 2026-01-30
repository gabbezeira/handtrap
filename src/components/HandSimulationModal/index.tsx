import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, RefreshCw, Dices } from 'lucide-react';
import { CardData } from '../../services/cardDatabase';
import { getCardImageUrl } from '../../utils/imageUrl';
import { 
  Overlay, ModalContent, Header, Body, Footer, 
  HandGrid, CardSlot, ActionButton, CloseButton 
} from './styles';

interface HandSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  deck: CardData[]; // Main Deck cards
}

export const HandSimulationModal: React.FC<HandSimulationModalProps> = ({ isOpen, onClose, deck }) => {
    const [hand, setHand] = useState<CardData[]>([]);

    const drawHand = () => {
        if (!deck || deck.length === 0) return;
        
        // Safety: Filter out Extra Deck cards just in case
        const mainDeckOnly = deck.filter(c => {
            const frame = c.frameType?.toLowerCase();
            const isExtra = [
                'fusion', 'synchro', 'xyz', 'link', 
                'fusion_pendulum', 'synchro_pendulum', 'xyz_pendulum', 'link_pendulum'
            ].includes(frame || '');
            return !isExtra;
        });

        if (mainDeckOnly.length === 0) return;

        // Fisher-Yates Shuffle copy
        const shuffled = [...mainDeckOnly];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        setHand(shuffled.slice(0, 5));
    };

    useEffect(() => {
        if (isOpen) {
            drawHand();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <Overlay onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <Header>
                    <h3><Dices size={24} style={{color: 'var(--primary-color)'}}/> Simulação de Mão Inicial</h3>
                    <CloseButton onClick={onClose}><X size={24}/></CloseButton>
                </Header>
                <Body>
                  {deck.length < 5 ? (
                     <div style={{color: '#94a3b8', fontSize: '1.1rem'}}>O deck precisa de pelo menos 5 cartas para simular uma mão.</div>
                  ) : (
                    <HandGrid>
                        {hand.map((card, idx) => (
                            <CardSlot key={`${card.id}-${idx}`}>
                                <img src={getCardImageUrl(card.id)} alt={card.name} />
                            </CardSlot>
                        ))}
                    </HandGrid>
                  )}
                </Body>
                <Footer>
                    <ActionButton $variant="secondary" onClick={onClose}>
                        Fechar
                    </ActionButton>
                    <ActionButton $variant="primary" onClick={drawHand}>
                        <RefreshCw size={18} />
                        Redraw
                    </ActionButton>
                </Footer>
            </ModalContent>
        </Overlay>,
        document.body
    );
};
