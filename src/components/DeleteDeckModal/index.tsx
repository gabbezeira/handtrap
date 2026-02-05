import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import { Overlay, ModalContent, Header, Body, Footer, Button, CloseButton } from './styles';

interface DeleteDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deckName?: string;
}

export const DeleteDeckModal: React.FC<DeleteDeckModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  deckName,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <Overlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Header>
          <h3>
            <AlertTriangle size={20} color="var(--error-color)" />
            Excluir Deck
          </h3>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </Header>

        <Body>
          <p>
            Tem certeza que deseja excluir o deck <strong>{deckName || 'Selecionado'}</strong>?
            <br />
            <br />
            Esta ação não pode ser desfeita.
          </p>
        </Body>

        <Footer>
          <Button $variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button $variant="danger" onClick={onConfirm}>
            <Trash2 size={16} />
            Excluir
          </Button>
        </Footer>
      </ModalContent>
    </Overlay>,
    document.body,
  );
};
