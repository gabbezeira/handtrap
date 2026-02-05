import React, { useEffect, useRef } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import * as S from './styles';

export type ModalType = 'success' | 'error' | 'info' | 'confirm' | 'warning';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: ModalType;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, onClose, title, message, type = 'info', onConfirm, confirmText = 'OK', cancelText = 'Cancelar' 
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const getIcon = () => {
    switch(type) {
      case 'error': return <AlertCircle size={24} />;
      case 'success': return <CheckCircle size={24} />;
      case 'warning': return <AlertTriangle size={24} />;
      case 'confirm': return <AlertCircle size={24} />; // Or HelpCircle
      default: return <Info size={24} />;
    }
  };

  return (
    <S.Overlay ref={overlayRef} onClick={handleOverlayClick}>
      <S.Container $type={type}>
        <S.Header>
          <h3>
            <S.IconWrapper $type={type}>{getIcon()}</S.IconWrapper>
            {title}
          </h3>
          <S.CloseButton onClick={onClose}><X size={20} /></S.CloseButton>
        </S.Header>
        <S.Body>{message}</S.Body>
        <S.Footer>
          {(type === 'confirm' || onConfirm) && (
            <S.Button variant="secondary" onClick={onClose}>
              {cancelText}
            </S.Button>
          )}
          <S.Button 
            $msgType={type} 
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </S.Button>
        </S.Footer>
      </S.Container>
    </S.Overlay>
  );
};
