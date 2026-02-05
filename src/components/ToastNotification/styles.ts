import styled, { keyframes } from 'styled-components';

export const slideIn = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

export const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

export const ToastContainer = styled.div<{ $visible: boolean }>`
  position: fixed;
  top: 100px;
  right: 20px;
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid var(--accent-color);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 300px;
  
  animation: ${props => props.$visible ? slideIn : fadeOut} 0.5s forwards;
  pointer-events: none; /* Just display, don't block clicks underneath */
`;

export const Message = styled.p`
  color: white;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
`;
