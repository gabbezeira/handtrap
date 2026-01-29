import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  /* Dynamic Background - Purple & Blue */
  background: radial-gradient(circle at top left, var(--bg-secondary) 0%, #000000 50%, #172554 100%);
  
  &::before {
    content: '';
    position: absolute;
    top: -20%;
    left: -10%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, transparent 70%);
    filter: blur(80px);
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -10%;
    right: -10%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
    filter: blur(80px);
    z-index: 0;
  }
`;

export const GlassCard = styled.div`
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  padding: 3rem;
  border-radius: 24px;
  width: 100%;
  max-width: 440px;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;
  animation: fadeIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
  z-index: 1;

  /* Subtle border gradient */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 24px; 
    padding: 1px;
    background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05)); 
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
`;

export const Title = styled.h1`
  text-align: center;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  letter-spacing: 0.1em;

  span {
    color: var(--primary-color);
  }
`;

export const Substring = styled.p`
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 2.5rem;
  letter-spacing: 0.05em;
`;

export const InputGroup = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background: var(--glass-bg);
  border: var(--glass-border);
  border-radius: 12px;
  color: var(--text-primary);
  font-family: var(--font-body);
  transition: all 0.3s ease;
  font-size: 0.95rem;

  &:focus {
    outline: none;
    background: rgba(15, 23, 42, 0.8);
    border-color: var(--primary-color);
    box-shadow: 0 0 15px rgba(62, 147, 252, 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;

export const IconWrapper = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  pointer-events: none;
  font-size: 1.1rem;
`;

export const Button = styled.button`
  width: 100%;
  padding: 1rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--primary-color) 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: none; /* Removed glow */
    filter: brightness(1.1);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

export const GoogleButton = styled(Button)`
  background: white;
  color: var(--bg-secondary);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
  font-weight: 600;
  
  &:hover {
    background: #f8fafc;
    box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

export const ToggleText = styled.p`
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.2s;
  
  span {
    color: var(--accent-color);
    font-weight: 500;
  }
  
  &:hover {
    color: white;
    span {
      color: var(--accent-color);
    }
  }
`;

export const ErrorMsg = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--error-color);
  color: var(--error-color);
  text-align: center;
  padding: 0.8rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  backdrop-filter: blur(4px);
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
  
  div {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    flex: 1;
  }
  
  span {
    color: var(--text-secondary);
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
`;
