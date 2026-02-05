import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.2s ease-out;
`;

export const ModalContainer = styled.div`
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(62, 147, 252, 0.1);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  width: 90%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

export const PlanColumn = styled.div<{ $isPremium?: boolean }>`
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  background: var(--bg-color);
  position: relative;
  border-right: ${props => !props.$isPremium ? '1px solid var(--border-color)' : 'none'};

  ${props => props.$isPremium && `
    &::before {
      content: 'RECOMENDADO';
      position: absolute;
      top: 12px;
      right: 12px;
      background: #a855f7;
      color: #fff;
      font-size: 0.7rem;
      font-weight: 800;
      padding: 4px 8px;
      border-radius: 12px;
    }
  `}

  @media (max-width: 767px) {
    border-right: none;
    border-bottom: ${props => !props.$isPremium ? '1px solid var(--border-color)' : 'none'};
    padding: 1.5rem;
  }
`;

export const PlanHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const PlanTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${props => props.color || '#fff'};
`;

export const PlanPrice = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  
  span {
    font-size: 1rem;
    font-weight: 400;
    color: var(--secondary-color);
  }
`;

export const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  flex: 1;
`;

export const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1rem;
  color: #ddd;
  font-size: 0.95rem;

  svg {
    font-size: 1.2rem;
  }
`;

export const SubscribeButton = styled.button`
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: #fff;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s, filter 0.2s;
  width: 100%;
  margin-top: auto;

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.1);
  }

  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: transparent;
  border: none;
  color: var(--secondary-color);
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
  
  &:hover {
    color: #fff;
  }
`;
