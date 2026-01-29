import styled from 'styled-components';

export const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  padding: 0 2rem;
  background: rgba(2, 6, 23, 0.8);
  border-bottom: 1px solid rgba(62, 147, 252, 0.1);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
`;

export const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: 800;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  font-family: var(--font-heading);
  font-family: var(--font-heading);
  
  
  span {
    color: var(--accent-color);
  }
  
  &:hover {
    filter: brightness(1.2);
  }
`;

export const UserArea = styled.div`
  position: relative;
`;

export const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.4rem 1rem 0.4rem 0.5rem;
  border-radius: 32px;
  cursor: pointer;
  transition: all 0.2s;
  color: #fff;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--primary-color);
    box-shadow: none; /* Removed glow */
  }
`;

export const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid transparent;
  background: 
    linear-gradient(#000, #000) padding-box,
    linear-gradient(135deg, var(--primary-color), var(--accent-color)) border-box;
`;

export const UserName = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #e2e8f0;
`;

export const Dropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 220px;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(62, 147, 252, 0.1);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  padding: 0.8rem;
  opacity: ${props => props.$isOpen ? 1 : 0};
  transform: translateY(${props => props.$isOpen ? '0' : '-10px'});
  pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: -6px;
    right: 20px;
    width: 12px;
    height: 12px;
    background: inherit;
    border-left: 1px solid rgba(62, 147, 252, 0.1);
    border-top: 1px solid rgba(62, 147, 252, 0.1);
    transform: rotate(45deg);
  }
`;

export const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  width: 100%;
  padding: 0.8rem 1rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #e0e0e0;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  font-size: 0.95rem;
  font-weight: 500;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: var(--accent-color);
    transform: translateX(4px);
  }
`;

export const ThemeToggleButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 1rem;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--accent-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
`;
