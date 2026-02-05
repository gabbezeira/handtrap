import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  gap: 1.5rem;
  animation: ${fadeIn} 0.4s ease-out;
`;

export const IconWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const GlowRing = styled.div`
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #a855f7, #6366f1);
  background-size: 200% 200%;
  animation: ${spin} 3s linear infinite, ${gradientShift} 2s ease infinite;
  opacity: 0.3;
  filter: blur(8px);
`;

export const IconCircle = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
`;

export const SpinnerIcon = styled.div`
  animation: ${spin} 2s linear infinite;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TextContainer = styled.div`
  text-align: center;
  max-width: 300px;
`;

export const MainText = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  animation: ${pulse} 2s ease-in-out infinite;
`;

export const TipContainer = styled.div`
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TipText = styled.div`
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.5;
  animation: ${fadeIn} 0.5s ease-out;
`;

export const TipLabel = styled.span`
  color: #a855f7;
  font-weight: 600;
  margin-right: 6px;
`;

export const DotsContainer = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 1rem;
`;

export const Dot = styled.div<{ $active: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${(props) => (props.$active ? '#a855f7' : 'rgba(168, 85, 247, 0.3)')};
  transition: background 0.3s ease;
`;
