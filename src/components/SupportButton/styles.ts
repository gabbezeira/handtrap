import styled from 'styled-components';

export const ButtonContainer = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: var(--primary-color);
  color: white;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &:hover {
    transform: scale(1.1) rotate(5deg);
    background: #0046b8;
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const SupportLabel = styled.div<{ $visible: boolean }>`
  position: fixed;
  bottom: 2.8rem;
  right: 90px;
  background: white;
  color: var(--primary-color);
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.85rem;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  z-index: 1000;
  pointer-events: none;
  
  opacity: ${props => props.$visible ? 1 : 0};
  transform: ${props => props.$visible ? 'translateX(0)' : 'translateX(10px)'};
  transition: all 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    right: -5px;
    top: 50%;
    transform: translateY(-50%);
    width: 0; 
    height: 0; 
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 5px solid white;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

export const ModalContent = styled.div`
  background: var(--bg-secondary);
  border-radius: 20px;
  border: 1px solid var(--border-color);
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  position: relative;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
  
  &:hover {
    color: var(--text-primary);
  }
`;

export const QrPlaceholder = styled.div`
  width: 200px;
  height: 200px;
  background: white;
  margin: 1.5rem auto;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid white;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

export const PixKeyBox = styled.div`
  background: var(--input-bg);
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 1.5rem;
  border: 1px solid var(--border-color);
`;

export const KeyText = styled.code`
  font-family: monospace;
  color: #e2e8f0;
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CopyButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 6px;
  padding: 6px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const Title = styled.h3`
  font-family: var(--font-heading);
  color: var(--text-primary);
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

export const Subtitle = styled.p`
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.5;
`;

export const CopiedText = styled.span`
  font-size: 0.8rem;
  font-weight: bold;
`;
