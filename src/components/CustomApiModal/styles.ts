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
  z-index: 1100;
  animation: ${fadeIn} 0.2s ease;
`;

export const Modal = styled.div`
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(62, 147, 252, 0.1);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  width: 90%;
  max-width: 520px;
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
  padding: 24px;
  overflow-y: auto;
  flex: 1;
`;

export const Section = styled.div`
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #888;
  margin-bottom: 12px;
`;

export const ProviderSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

export const ProviderOption = styled.button<{ $selected: boolean }>`
  background: ${({ $selected }) =>
    $selected
      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.3))'
      : 'rgba(255, 255, 255, 0.03)'};
  border: 1px solid ${({ $selected }) =>
    $selected ? 'rgba(168, 85, 247, 0.5)' : 'rgba(255, 255, 255, 0.08)'};
  border-radius: 10px;
  padding: 14px 12px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: ${({ $selected }) =>
      $selected
        ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.35), rgba(168, 85, 247, 0.35))'
        : 'rgba(255, 255, 255, 0.06)'};
    border-color: ${({ $selected }) =>
      $selected ? 'rgba(168, 85, 247, 0.6)' : 'rgba(255, 255, 255, 0.15)'};
  }
`;

export const ProviderName = styled.span`
  font-size: 0.85rem;
  font-weight: 500;
  color: #fff;
`;

export const ProviderIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

export const InputGroup = styled.div`
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const Label = styled.label<{ $variant?: 'success' | 'error' | 'warning' }>`
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
  color: ${({ $variant }) => {
    switch ($variant) {
      case 'success':
        return '#22c55e';
      case 'error':
        return '#ef4444';
      case 'warning':
        return '#eab308';
      default:
        return '#ccc';
    }
  }};
  margin-bottom: 8px;
`;

export const Input = styled.input`
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 0.95rem;
  color: #fff;
  transition: all 0.2s;
  
  &::placeholder {
    color: #666;
  }
  
  &:focus {
    outline: none;
    border-color: rgba(168, 85, 247, 0.5);
    box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 0.9rem;
  color: #fff;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  transition: all 0.2s;
  
  &::placeholder {
    color: #666;
  }
  
  &:focus {
    outline: none;
    border-color: rgba(168, 85, 247, 0.5);
    box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
  }
`;

export const WarningBanner = styled.div`
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.1));
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  
  svg {
    color: #22c55e;
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

export const WarningText = styled.div`
  font-size: 0.85rem;
  color: #a1a1aa;
  line-height: 1.5;
  
  strong {
    color: #22c55e;
    font-weight: 600;
  }
`;

export const Footer = styled.div`
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.2);
`;

export const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  flex: 1;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  ${({ $variant }) => {
    switch ($variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #6366f1, #a855f7);
          border: none;
          color: #fff;
          
          &:hover {
            opacity: 0.9;
            transform: translateY(-1px);
          }
          
          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
          }
        `;
      case 'danger':
        return `
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
          
          &:hover {
            background: rgba(239, 68, 68, 0.2);
          }
        `;
      default:
        return `
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #ccc;
          
          &:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
          }
        `;
    }
  }}
`;

export const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
`;

export const ToggleLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ToggleTitle = styled.span`
  font-size: 0.95rem;
  font-weight: 500;
  color: #fff;
`;

export const ToggleDescription = styled.span`
  font-size: 0.8rem;
  color: #888;
`;

export const Toggle = styled.button<{ $active: boolean }>`
  width: 44px;
  height: 24px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
  background: ${({ $active }) =>
    $active ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'rgba(255, 255, 255, 0.15)'};
  
  &::after {
    content: '';
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #fff;
    top: 3px;
    left: ${({ $active }) => ($active ? '23px' : '3px')};
    transition: left 0.2s;
  }
`;

export const TestButton = styled.button<{ $success?: boolean; $error?: boolean }>`
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  
  background: ${({ $success, $error }) => {
    if ($success) return 'rgba(34, 197, 94, 0.15)';
    if ($error) return 'rgba(239, 68, 68, 0.15)';
    return 'rgba(255, 255, 255, 0.05)';
  }};
  
  border: 1px solid ${({ $success, $error }) => {
    if ($success) return 'rgba(34, 197, 94, 0.4)';
    if ($error) return 'rgba(239, 68, 68, 0.4)';
    return 'rgba(255, 255, 255, 0.1)';
  }};
  
  color: ${({ $success, $error }) => {
    if ($success) return '#22c55e';
    if ($error) return '#ef4444';
    return '#ccc';
  }};
  
  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.08);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const InputRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-end;
`;

export const InputWrapper = styled.div`
  flex: 1;
`;

export const ModelHelperText = styled.span`
  display: block;
  font-size: 0.7rem;
  color: #666;
  margin-top: 4px;
`;
