import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

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

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${fadeIn} 0.2s ease-out;
`;

const Container = styled.div<{ type: ModalType }>`
  background: #0f172a;
  width: 90%;
  max-width: 450px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
  overflow: hidden;
  animation: ${slideUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  
  h3 {
    margin: 0;
    color: #fff;
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const Body = styled.div`
  padding: 24px 20px;
  color: #d1d5db;
  font-size: 1rem;
  line-height: 1.5;
`;

const Footer = styled.div`
  padding: 16px 20px;
  background: rgba(0,0,0,0.2);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary', msgType?: ModalType }>`
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 0.9rem;

  ${props => props.variant === 'secondary' ? `
    background: transparent;
    color: #9ca3af;
    &:hover { background: rgba(255,255,255,0.1); color: #fff; }
  ` : `
    background: ${
      props.msgType === 'error' ? '#ff4d4f' : 
      props.msgType === 'success' ? '#52c41a' : 
      props.msgType === 'warning' ? '#faad14' : 
      '#3b82f6'
    };
    color: white;
    &:hover { filter: brightness(1.1); }
  `}
`;

const IconWrapper = styled.span<{ type: ModalType }>`
  display: flex;
  align-items: center;
  color: ${props => 
    props.type === 'error' ? '#ff4d4f' : 
    props.type === 'success' ? '#52c41a' : 
    props.type === 'warning' ? '#faad14' : 
    '#3b82f6'};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  &:hover { color: #fff; }
`;

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
    <Overlay ref={overlayRef} onClick={handleOverlayClick}>
      <Container type={type}>
        <Header>
          <h3>
            <IconWrapper type={type}>{getIcon()}</IconWrapper>
            {title}
          </h3>
          <CloseButton onClick={onClose}><X size={20} /></CloseButton>
        </Header>
        <Body>{message}</Body>
        <Footer>
          {(type === 'confirm' || onConfirm) && (
            <Button variant="secondary" onClick={onClose}>
              {cancelText}
            </Button>
          )}
          <Button 
            msgType={type} 
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </Footer>
      </Container>
    </Overlay>
  );
};
