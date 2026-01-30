import styled, { keyframes } from 'styled-components';

const flicker = keyframes`
  0% { opacity: 0.98; }
  5% { opacity: 0.99; }
  10% { opacity: 0.98; }
  15% { opacity: 0.99; }
  20% { opacity: 0.98; }
  25% { opacity: 0.99; }
  30% { opacity: 0.98; }
  35% { opacity: 0.99; }
  40% { opacity: 0.98; }
  45% { opacity: 0.99; }
  50% { opacity: 0.98; }
  55% { opacity: 0.99; }
  60% { opacity: 0.98; }
  65% { opacity: 0.99; }
  70% { opacity: 0.98; }
  75% { opacity: 0.99; }
  80% { opacity: 0.98; }
  85% { opacity: 0.99; }
  90% { opacity: 0.98; }
  95% { opacity: 0.99; }
  100% { opacity: 0.98; }
`;

const scanline = keyframes`
  0% { transform: translateY(0%); }
  100% { transform: translateY(100%); }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2147483647; /* Ensure it is absolutely on top of everything */
  pointer-events: none;
  overflow: hidden;

  /* Subtle Noise/Grain */
  &::before {
    content: " ";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
    background-size: 100% 2px, 3px 100%;
    opacity: 0.04; /* Very subtle */
    animation: ${flicker} 0.3s infinite;
  }

  /* Soft Scanlines */
  &::after {
    content: " ";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0) 50%,
      rgba(0, 0, 0, 0.05) 50%,
      rgba(0, 0, 0, 0.05)
    );
    background-size: 100% 4px;
    animation: ${scanline} 8s linear infinite; /* Slower scan */
    pointer-events: none;
  }
`;

export const CrtEffect = () => {
    return <Overlay />;
};
