import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { 
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease;
`;

export const Modal = styled.div`
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(62, 147, 252, 0.1);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  width: 90%;
  max-width: 480px;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: ${slideUp} 0.3s ease;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 10px;
  
  svg {
    color: #a855f7;
  }
`;

export const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  color: #999;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
`;

export const Body = styled.div`
  padding: 20px 24px;
  overflow-y: auto;
  flex: 1;
`;

// Menu Sections
export const MenuSection = styled.div`
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const MenuSectionTitle = styled.h3`
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #888;
  margin-bottom: 12px;
`;

export const MenuRow = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 8px;
  transition: all 0.2s;
  cursor: default;
  width: 100%;

  &:last-child {
    margin-bottom: 0;
  }
  
  &[as="button"] {
    cursor: pointer;
    width: 100%;
    text-align: left;
    
    &:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(255, 255, 255, 0.12);
    }
  }
`;

export const MenuRowContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const MenuRowTitle = styled.span`
  font-size: 0.95rem;
  font-weight: 500;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 10px;
  
  svg {
    color: #a855f7;
  }
`;

export const MenuRowDescription = styled.span`
  font-size: 0.8rem;
  color: #888;
`;

export const MenuButton = styled.button<{ $locked?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: ${({ $locked }) => $locked ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.06)'};
    border-color: ${({ $locked }) => $locked ? 'rgba(255, 255, 255, 0.08)' : 'rgba(168, 85, 247, 0.3)'};
  }
  
  svg:last-child {
    color: #666;
  }
`;

// Volume Slider
export const VolumeSlider = styled.input`
  width: 100%;
  height: 6px;
  margin-top: 12px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #a855f7);
    cursor: pointer;
    transition: transform 0.2s;
    
    &:hover {
      transform: scale(1.1);
    }
  }
  
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #a855f7);
    cursor: pointer;
    border: none;
  }
`;

export const VolumeValue = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: #a855f7;
  min-width: 40px;
  text-align: right;
`;

// Subscription Card
export const SubscriptionCard = styled.div`
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 12px;
  padding: 20px;
`;

export const SubscriptionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
`;

export const PlanBadge = styled.div<{ $premium: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  
  background: ${({ $premium }) => 
    $premium 
      ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
      : 'rgba(255, 255, 255, 0.1)'};
  color: ${({ $premium }) => $premium ? '#fff' : '#888'};
  
  svg {
    color: ${({ $premium }) => $premium ? '#fff' : '#666'};
  }
`;

export const StatusBadge = styled.span<{ $status: 'active' | 'canceled' | 'past_due' }>`
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  
  background: ${({ $status }) => {
    switch ($status) {
      case 'active': return 'rgba(34, 197, 94, 0.15)';
      case 'canceled': return 'rgba(239, 68, 68, 0.15)';
      default: return 'rgba(234, 179, 8, 0.15)';
    }
  }};
  
  color: ${({ $status }) => {
    switch ($status) {
      case 'active': return '#22c55e';
      case 'canceled': return '#ef4444';
      default: return '#eab308';
    }
  }};
`;

export const SubscriptionDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #888;
  margin-bottom: 16px;
  
  svg {
    color: #666;
  }
`;

export const SubscriptionActions = styled.div`
  display: flex;
  gap: 10px;
`;

export const ActionButton = styled.button<{ $primary?: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  background: ${({ $primary }) => 
    $primary 
      ? 'linear-gradient(135deg, #6366f1, #a855f7)' 
      : 'rgba(255, 255, 255, 0.05)'};
  
  border: ${({ $primary }) => 
    $primary 
      ? 'none' 
      : '1px solid rgba(255, 255, 255, 0.1)'};
  
  color: ${({ $primary }) => $primary ? '#fff' : '#ccc'};
  
  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  svg:last-child {
    opacity: 0.6;
    margin-left: 2px;
  }
`;

// Footer
export const Footer = styled.div`
  padding: 16px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.2);
`;

export const CloseActionButton = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ccc;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
`;

// Locked Premium Feature Overlay
export const LockedOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(1px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  z-index: 10;
`;

export const LockedContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  
  svg {
    color: #a855f7;
  }
  
  span {
    font-size: 0.8rem;
    font-weight: 600;
    color: #a855f7;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

export const PremiumTag = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2));
  border: 1px solid rgba(168, 85, 247, 0.4);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #a855f7;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  
  svg {
    color: #a855f7;
  }
`;
