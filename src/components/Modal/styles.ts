import styled, { keyframes } from 'styled-components';
import { ModalType } from './index';

export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export const Overlay = styled.div`
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

export const Container = styled.div<{ $type: ModalType }>`
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

export const Header = styled.div`
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

export const Body = styled.div`
  padding: 24px 20px;
  color: #d1d5db;
  font-size: 1rem;
  line-height: 1.5;
`;

export const Footer = styled.div`
  padding: 16px 20px;
  background: rgba(0,0,0,0.2);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary'; $msgType?: ModalType }>`
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 0.9rem;

  ${(props) =>
    props.variant === 'secondary'
      ? `
    background: transparent;
    color: #9ca3af;
    &:hover { background: rgba(255,255,255,0.1); color: #fff; }
  `
      : `
    background: ${
      props.$msgType === 'error'
        ? '#ff4d4f'
        : props.$msgType === 'success'
          ? '#52c41a'
          : props.$msgType === 'warning'
            ? '#faad14'
            : '#3b82f6'
    };
    color: white;
    &:hover { filter: brightness(1.1); }
  `}
`;

export const IconWrapper = styled.span<{ $type: ModalType }>`
  display: flex;
  align-items: center;
  color: ${(props) =>
    props.$type === 'error'
      ? '#ff4d4f'
      : props.$type === 'success'
        ? '#52c41a'
        : props.$type === 'warning'
          ? '#faad14'
          : '#3b82f6'};
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  &:hover { color: #fff; }
`;
