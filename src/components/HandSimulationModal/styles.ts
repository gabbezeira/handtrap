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

export const LoaderOverlay = styled(Overlay)`
  z-index: 9500;
  background: rgba(0, 0, 0, 0.9);
`;

export const LoaderContainer = styled.div`
  background: rgba(15, 23, 42, 0.95);
  padding: 40px;
  border-radius: 16px; 
  border: 1px solid rgba(168, 85, 247, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  min-width: 300px;
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
  
  ${(props) =>
    props.$variant === 'primary'
      ? `
    background: var(--primary-color);
    color: white;
    &:hover { 
      filter: brightness(1.1); 
      transform: translateY(-1px);
    }
    &:active { transform: translateY(0); }
  `
      : `
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

// Analysis Result Styles

export const AnalysisOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
  animation: ${fadeIn} 0.3s ease;
`;

export const AnalysisContent = styled.div`
  background: var(--bg-color); 
  backdrop-filter: blur(16px);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  border-radius: 16px;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  border: var(--glass-border);
  overflow: hidden;
`;

export const AnalysisHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
`;

export const AnalysisTitle = styled.h2`
  margin: 0;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.5rem;
  font-family: var(--font-heading, sans-serif);
  
  svg {
    color: var(--primary-color);
  }
`;

export const AnalysisScrollableBody = styled.div`
  padding: 30px;
  overflow-y: auto;
  color: var(--text-secondary);
  display: flex;
  flex-direction: column;
  gap: 30px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(0,0,0,0.1);
  }
  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 3px;
  }
`;

export const CustomApiBanner = styled.div`
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.1) 100%);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  
  svg {
    color: #22c55e;
    flex-shrink: 0;
  }
`;

export const CustomApiBannerText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const CustomApiBannerTitle = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: #22c55e;
`;

export const CustomApiBannerSubtitle = styled.span`
  font-size: 0.7rem;
  color: #a1a1aa;
`;

export const ScoreSection = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 24px;
  background: rgba(59, 130, 246, 0.05); /* Uses primary-like blue tint base */
  border: 1px solid var(--border-color);
  border-radius: 12px;
  position: relative;
  /* overflow: hidden; Removed to prevent cutting off shadow/content */

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; width: 4px; height: 100%;
    background: var(--primary-color);
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    padding-left: 32px; /* Extra padding to clear the left border bar */
    
    /* Ensure the left bar still looks right or adjust it */
    &::before {
        height: 100%;
    }
  }
`;

export const ScoreCircle = styled.div`
  width: 90px;
  height: 90px;
  flex-shrink: 0;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.1);
  border: 2px solid var(--primary-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--text-primary);
  box-shadow: 0 0 30px rgba(59, 130, 246, 0.2);
  
  span:first-child { 
    font-size: 2.2rem; 
    font-weight: 800; 
    font-family: var(--font-heading, sans-serif);
    line-height: 1;
  }
  span:last-child { 
    font-size: 0.8rem; 
    opacity: 0.7; 
    margin-top: 2px;
  }

  @media (max-width: 600px) {
    align-self: center;
    margin-bottom: 16px;
  }
`;

export const ScoreText = styled.div`
  flex: 1;
  width: 100%;
  
  h4 {
    margin: 0 0 8px 0;
    color: var(--text-primary);
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  p { 
    margin: 0; 
    line-height: 1.5; 
    color: var(--text-secondary); 
    font-size: 0.95rem;
    overflow-wrap: break-word;
  }
`;

export const GridSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const StrategyCard = styled.div<{ $variant: 'first' | 'second' }>`
  background: ${(props) =>
    props.$variant === 'first'
      ? 'linear-gradient(145deg, rgba(59, 130, 246, 0.05) 0%, rgba(30, 41, 59, 0.2) 100%)'
      : 'linear-gradient(145deg, rgba(239, 68, 68, 0.05) 0%, rgba(30, 41, 59, 0.2) 100%)'};
  border: 1px solid ${(props) => (props.$variant === 'first' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(239, 68, 68, 0.2)')};
  border-radius: 12px;
  padding: 20px;
  transition: transform 0.2s;

  &:hover {
      transform: translateY(-2px);
  }

  h3 {
    margin: 0 0 16px 0;
    color: ${(props) => (props.$variant === 'first' ? '#60a5fa' : '#f87171')};
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  p {
    margin: 0;
    color: var(--text-secondary);
    font-size: 0.9rem;
    line-height: 1.6;
    white-space: pre-line;
  }
`;

export const CombosSection = styled.div`
  margin-top: 10px;
`;

export const SectionTitle = styled.h3`
  color: var(--accent-color);
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ComboItem = styled.div`
  background: var(--input-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
  gap: 12px;

  &:last-child { margin-bottom: 0; }

  svg {
    margin-top: 2px;
    color: var(--accent-color);
    opacity: 0.8;
  }

  span {
    color: var(--text-primary);
    font-size: 0.95rem;
    line-height: 1.5;
  }
`;

export const AnalysisCloseBtn = styled.button`
  background: var(--input-bg);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  padding: 8px;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover { 
    color: var(--text-primary); 
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

// Additional styled components for inline styles
export const BricksText = styled.p`
  color: var(--error-color);
  font-size: 0.85rem;
  margin-top: 8px;
  display: flex;
  align-items: start;
  flex-direction: column;
  gap: 6px;
`;

export const DeckMinMessage = styled.div`
  color: #94a3b8;
  font-size: 1.1rem;
`;

export const ErrorBanner = styled.div`
  margin-top: 15px;
  padding: 10px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid #ef4444;
  border-radius: 6px;
  color: #ef4444;
`;

export const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  color: #3b82f6;
`;

export const FooterInfo = styled.div`
  margin-right: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const IAPowered = styled.span`
  font-size: 0.8rem;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const UsageInfo = styled.span`
  font-size: 0.75rem;
  color: #64748b;
`;

export const AnalyzeActionButton = styled(ActionButton)`
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  border: none;
`;

export const RotatedIcon = styled.span`
  display: flex;
  transform: rotate(180deg);
`;

export const DicesIcon = styled.span`
  color: var(--primary-color);
  display: flex;
`;

export const ChevronIcon = styled.span`
  opacity: 0.5;
  display: flex;
`;
