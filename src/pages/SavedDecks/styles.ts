import styled from 'styled-components';

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  background: radial-gradient(circle at center, #020617 0%, #050510 100%);
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
  flex: 1;

  @media (max-width: 768px) {
    padding: 1rem 0.5rem; /* Reduce padding to give more width to grid */
  }
`;

export const TitleSection = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(62, 147, 252, 0.1);
  padding-bottom: 1.5rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  color: white;
  
  span {
    color: var(--primary-color);
  }

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

export const ActionsWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const WarningBanner = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(234, 179, 8, 0.1);
  border: 1px solid rgba(234, 179, 8, 0.2);
  border-radius: 8px;
  color: #fefce8;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

export const WarningIcon = styled.span`
  font-size: 1.2rem;
`;

export const DecksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem; /* Tighter gap for bigger cards */
  }
`;

export const LoadingWrapper = styled.div`
  color: var(--text-secondary);
  text-align: center;
  margin-top: 4rem;
  font-size: 1.2rem;
`;

export const DateLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const DeckCard = styled.div`
  background: var(--glass-bg);
  border: var(--glass-border);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    border-color: rgba(62, 147, 252, 0.3);

    &::before {
      opacity: 1;
    }
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    padding: 2px;
    background: linear-gradient(135deg, var(--primary-color), transparent 60%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
`;

export const DeckHeader = styled.div`
  padding: 1.5rem;
  background: rgba(15, 23, 42, 0.4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

export const DeckName = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const DeckMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: var(--text-secondary);
  font-size: 0.85rem;
`;

export const DeckBody = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

export const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  font-size: 0.9rem;
  
  span:first-child {
    color: #94a3b8;
  }
  
  span:last-child {
    color: white;
    font-weight: 600;
  }
`;

export const DeckActions = styled.div`
  padding: 1rem 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  gap: 0.8rem;
  justify-content: flex-end;
`;

export const IconButton = styled.button<{ color?: string }>`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${(props) => props.color || 'white'};
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem;
  background: var(--glass-bg);
  border-radius: 20px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  
  h3 {
    margin: 1.5rem 0 0.5rem;
    font-size: 1.5rem;
  }
  
  p {
    color: var(--text-secondary);
    margin-bottom: 2rem;
  }
`;

export const CreateButton = styled.button`
  background: linear-gradient(135deg, var(--primary-color), #2563eb);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  font-family: var(--font-body);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: none; /* Removed glow */
  }
`;

export const ImportWrapper = styled.div`
  display: flex;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  height: 46px;
  align-items: stretch;
  transition: border-color 0.2s;

  &:focus-within {
    border-color: var(--primary-color);
  }

  @media (max-width: 768px) {
    flex: 1;
  }
`;

export const ImportInput = styled.input`
  background: transparent;
  border: none;
  color: white;
  padding: 0 1rem;
  outline: none;
  min-width: 250px;
  font-size: 0.95rem;
  flex: 1;

  &::placeholder {
    color: var(--text-secondary);
  }

  @media (max-width: 768px) {
    min-width: 100px;
  }
`;

export const ImportButton = styled.button`
  background: ${(props) => (props.disabled ? '#334155' : 'var(--primary-color)')};
  color: ${(props) => (props.disabled ? '#94a3b8' : 'white')};
  border: none;
  padding: 0 1.2rem;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #2563eb;
  }
`;
