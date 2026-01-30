import styled from 'styled-components';

export const FooterContainer = styled.footer`
  width: 100%;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.4);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-top: auto;
  font-size: 0.9rem;
  color: var(--text-secondary);
  backdrop-filter: blur(5px);
  position: relative;
  z-index: 10;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.8rem;
    padding-bottom: 5rem; /* Space for mobile nav if exists or just extra padding */
  }
`;

export const Link = styled.a`
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    color: var(--primary-color);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;
