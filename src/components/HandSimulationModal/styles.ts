import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  z-index: 9000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.2s;
`;

export const ModalContent = styled.div`
  background: var(--bg-color);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  position: relative;
`;

export const Header = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    margin: 0;
    color: white;
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

export const Body = styled.div`
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  overflow-y: auto;
  min-height: 300px;
  justify-content: center;
`;

export const HandGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  width: 100%;
  padding: 10px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const CardSlot = styled.div`
  aspect-ratio: 421/614;
  position: relative;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
  
  &:hover {
    transform: translateY(-15px) scale(1.05) rotate(2deg);
    z-index: 10;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 6px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.4);
    border: 1px solid rgba(255,255,255,0.1);
  }

  /* Animation for dealing cards */
  animation: deal 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
  
  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.3s; }
  &:nth-child(4) { animation-delay: 0.4s; }
  &:nth-child(5) { animation-delay: 0.5s; }

  @keyframes deal {
    from { 
      opacity: 0;
      transform: translateY(50px) scale(0.8);
    }
    to { 
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

export const Footer = styled.div`
  padding: 20px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: rgba(0, 0, 0, 0.2);
`;

export const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  
  ${props => props.$variant === 'primary' ? `
    background: var(--primary-color);
    color: white;
    &:hover { 
      filter: brightness(1.1); 
      transform: translateY(-1px);
    }
    &:active { transform: translateY(0); }
  ` : `
    background: rgba(255, 255, 255, 0.05);
    color: #cbd5e1;
    border: 1px solid rgba(255, 255, 255, 0.1);
    &:hover { 
      background: rgba(255, 255, 255, 0.1); 
      color: white;
      border-color: rgba(255, 255, 255, 0.2);
    }
  `}
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
  
  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }
`;
