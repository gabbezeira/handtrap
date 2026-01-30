import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  /* Deep Blue Theme Background */
  background: radial-gradient(circle at center, #0f172a 0%, #000000 100%);
  
  /* Animated Orbs - Blue & Cyan - Kept but subtle */
  &::before {
    content: '';
    position: absolute;
    top: -10%;
    left: -10%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
    filter: blur(100px);
    z-index: 0;
    opacity: 0.6;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -10%;
    right: -10%;
    width: 700px;
    height: 700px;
    background: radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%);
    filter: blur(100px);
    z-index: 0;
    opacity: 0.6;
  }
`;

export const GlassCard = styled.div`
  background: rgba(10, 15, 30, 0.75); 
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  /* Removed heavy shadow/glow */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
  padding: 3.5rem 3rem;
  border-radius: 24px;
  width: 100%;
  max-width: 420px;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;
  animation: fadeIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
  z-index: 1;

  /* Subtle Clean Border Accent using Primary Color */
  border-top: 1px solid var(--primary-color); 
`;

export const Title = styled.h1`
  text-align: center;
  color: #fff;
  margin-bottom: 0.5rem;
  font-size: 2.2rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  /* Updated Handtrap to Blue using Global Styles */
  span {
    color: var(--primary-color);
    background: linear-gradient(135deg, var(--accent-color) 0%, var(--primary-color) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    /* Removed text-shadow glow */
  }
`;

export const Substring = styled.p`
  text-align: center;
  color: #94a3b8;
  font-size: 0.95rem;
  margin-bottom: 2.5rem;
  font-weight: 400;
`;

export const InputGroup = styled.div`
  position: relative;
  margin-bottom: 1.2rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  font-family: var(--font-body);
  transition: all 0.2s ease;
  font-size: 0.95rem;

  &:focus {
    outline: none;
    background: rgba(15, 23, 42, 0.8);
    border-color: var(--primary-color);
    /* Removed box-shadow glow */
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.25);
  }
`;

export const IconWrapper = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  pointer-events: none;
  transition: color 0.3s;

  ${Input}:focus ~ & {
    color: var(--primary-color);
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  background: var(--primary-color); /* Flat primary color */
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  letter-spacing: 0.05em;
  transition: background-color 0.2s ease, transform 0.1s ease;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
  /* Removed box-shadow */
  
  &:hover {
    background-color: var(--accent-color); /* Lighter blue on hover */
    transform: translateY(-1px);
    /* No glow */
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    background: #334155;
    transform: none;
  }
`;

export const GoogleButton = styled(Button)`
  background: white;
  color: #0f172a;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
  font-weight: 600;
  
  &:hover {
    background: #f8fafc;
    /* Subtle shadow only for depth, not glow */
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); 
    transform: translateY(-1px);
  }
`;

export const ToggleText = styled.p`
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: all 0.2s;
  
  span {
    color: var(--primary-color);
    font-weight: 600;
    margin-left: 4px;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  &:hover {
    color: #94a3b8;
  }
`;

export const ErrorMsg = styled.div`
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.2);
  color: #ef4444;
  text-align: center;
  padding: 0.8rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
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
    color: #64748b;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 600;
  }
`;
