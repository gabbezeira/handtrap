import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.2s ease-out;
`;

export const ModalContent = styled.div`
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const Header = styled.div`
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color);
  background: rgba(0, 0, 0, 0.2);

  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    color: var(--text-primary);
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const Body = styled.div`
  padding: 24px 20px;
  
  p {
    color: var(--text-secondary);
    font-size: 0.95rem;
    line-height: 1.5;
    margin: 0;
  }

  strong {
    color: var(--text-primary);
    font-weight: 600;
  }
`;

export const Footer = styled.div`
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid var(--border-color);
`;

export const Button = styled.button<{ $variant?: 'danger' | 'secondary' }>`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  
  ${props => props.$variant === 'danger' ? `
    background: var(--error-color);
    color: white;
    border: none;
    
    &:hover {
      filter: brightness(1.1);
    }
  ` : `
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid var(--border-color);
    
    &:hover {
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-primary);
      border-color: var(--text-muted);
    }
  `}
`;
