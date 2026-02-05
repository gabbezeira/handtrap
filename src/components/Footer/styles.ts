import styled from 'styled-components';

export const FooterContainer = styled.footer`
  width: 100%;
  padding: 1.25rem 1.5rem;
  background: rgba(0, 0, 0, 0.6);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
  backdrop-filter: blur(5px);
  position: relative;
  z-index: 10;
  
  @media (max-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.8rem;
    padding: 1rem;
    justify-content: center;
    font-size: 0.75rem;
  }
`;

export const Link = styled.a`
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    color: var(--primary-color);
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const Separator = styled.span`
  opacity: 0.3;
`;
