import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
`;

export const DashboardContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--bg-secondary);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  width: 700px;
  max-width: 95vw;
  padding: 2.5rem;
  z-index: 9999;
  box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.5);
  font-family: var(--font-body);
  color: #e2e8f0;
  animation: ${fadeIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1.5rem;
`;

export const Title = styled.h2`
  color: var(--text-primary);
  font-family: var(--font-heading);
  font-size: 1.5rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;

  svg {
    color: var(--accent-color);
  }
`;

export const CloseButton = styled.button`
  background: var(--input-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div<{ $type: 'system' | 'external' }>`
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid ${props => props.$type === 'system' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(236, 72, 153, 0.3)'};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: ${props => props.$type === 'system' ? '#3b82f6' : '#ec4899'};
  }
`;

export const CardTitle = styled.h3`
  color: var(--text-primary);
  margin: 0 0 1.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: 0.02em;
`;

export const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-secondary);
  margin-bottom: 12px;
  font-size: 0.9rem;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
`;

export const MetricValue = styled.strong<{ $color?: string }>`
  color: ${props => props.$color || 'var(--text-primary)'};
  font-family: monospace;
  font-size: 1rem;
`;

export const LoginOverlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  width: 100%;
`;

export const LoginTitle = styled.h3`
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  font-weight: 500;
`;

export const PasswordInput = styled.input`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
  padding: 12px 16px;
  border-radius: 8px;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  width: 100%;
  max-width: 280px;
  text-align: center;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: var(--accent-color);
  }
`;

export const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  background: ${props => props.$variant === 'primary' ? 'var(--primary-color)' : 'transparent'};
  border: ${props => props.$variant === 'primary' ? 'none' : '1px solid var(--border-color)'};
  color: ${props => props.$variant === 'primary' ? 'white' : 'var(--text-secondary)'};
  padding: 10px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s;
  width: ${props => props.$variant === 'primary' ? '100%' : 'auto'};
  max-width: 280px;

  &:hover {
    filter: brightness(1.1);
    background: ${props => props.$variant === 'primary' ? 'var(--accent-color)' : 'var(--input-bg)'};
    color: var(--text-primary);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const LoginActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
`;
