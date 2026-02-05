import styled, { keyframes } from 'styled-components';

export const scanline = keyframes`
  0% { transform: translateY(0%); }
  100% { transform: translateY(100%); }
`;

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  color: #fff;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;

  @media (min-width: 768px) {
    display: none;
  }
`;

export const IconWrapper = styled.div`
  margin-bottom: 2rem;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(0.95); }
    100% { opacity: 1; transform: scale(1); }
  }
`;

export const Title = styled.h2`
  font-family: var(--font-heading);
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

export const Description = styled.p`
  color: #94a3b8;
  font-size: 1rem;
  max-width: 300px;
  line-height: 1.6;
`;

export const Scanline = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  animation: ${scanline} 4s linear infinite;
  pointer-events: none;
`;
