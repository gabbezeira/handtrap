import styled from 'styled-components';

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: radial-gradient(circle at center, var(--bg-secondary) 0%, #050510 100%);
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr 320px;
  flex: 1;
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 100px 100px;
    pointer-events: none;
    z-index: 0;
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  border-right: var(--glass-border);
  height: 100%;
  overflow: hidden;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(10px);
  z-index: 1;
  
  &:last-child {
    border-right: none;
    background: var(--glass-bg);
  }
`;

export const ColumnHeader = styled.div`
  padding: 1rem 1.5rem;
  background: var(--glass-heavy);
  border-bottom: var(--glass-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 60px;
  flex-shrink: 0;
  backdrop-filter: blur(5px);
`;

export const DetailPanel = styled.div`
  padding: 0;
  overflow-y: auto;
  flex: 1;
  color: var(--text-secondary);
  position: relative;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`;

export const DetailContent = styled.div`
  padding: 1rem;
  position: relative;
  z-index: 2;
`;

export const CardBackdrop = styled.div<{ $bgImage?: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 400px;
  background-image: url(${props => props.$bgImage});
  background-size: cover;
  background-position: center top;
  opacity: 0.15;
  filter: blur(20px);
  mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
  z-index: 1;
  pointer-events: none;
`;

export const CardImageContainer = styled.div`
  position: relative;
  width: fit-content;
  margin: 0 auto 1.5rem auto;
`;

export const BigCardImage = styled.img`
  width: 100%;
  max-width: 160px;
  border-radius: 8px;
  box-shadow: 
    0 10px 30px -5px rgba(0,0,0,0.6),
    0 0 0 1px var(--border-color);
  display: block;
  transition: all 0.4s ease;
  position: relative;
  z-index: 10;
  
  &:hover {
    transform: scale(1.05) translateY(-5px);
    box-shadow: 
      0 20px 50px -10px rgba(0,0,0,0.7),
      0 0 0 1px rgba(255,255,255,0.2);
  }
`;

export const CardTitle = styled.h2`
  font-size: 1.4rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  line-height: 1.2;
  text-align: center;
  font-family: var(--font-heading);
  text-shadow: 0 4px 10px rgba(0,0,0,0.5);
`;

export const TagsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

export const Tag = styled.span<{ $color?: string }>`
  background: ${props => props.$color || 'var(--border-color)'};
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  color: var(--text-primary);
  font-weight: 600;
  letter-spacing: 0.05em;
  border: 1px solid var(--border-color);
  text-transform: uppercase;
`;

export const RarityBadge = styled.div<{ $rarity: 'UR' | 'SR' | 'R' | 'N' }>`
  position: absolute;
  top: -6px;
  right: -6px;
  z-index: 20;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 800;
  font-size: 0.7rem;
  color: var(--text-primary);
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
  letter-spacing: 0.05em;
  box-shadow: 0 4px 10px rgba(0,0,0,0.4);
  background: ${props => {
    switch(props.$rarity) {
      case 'UR': return 'linear-gradient(135deg, #bf2aeb 0%, #3bf2fa 100%)';
      case 'SR': return 'linear-gradient(135deg, #f97316 0%, #eab308 100%)';
      case 'R':  return 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)';
      default:   return 'linear-gradient(135deg, #334155 0%, #94a3b8 100%)';
    }
  }};
  border: none;
`;

export const TypeBadge = styled.div`
  background: var(--border-color);
  padding: 4px 12px;
  border-radius: 4px;
  color: var(--accent-color);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  text-align: center;
  display: inline-block;
  border: var(--glass-border);
`;

export const AiButton = styled.button`
  background: linear-gradient(90deg, #8b5cf6, #d946ef);
  border: 1px solid rgba(255,255,255,0.2);
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  color: var(--text-primary);
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  font-family: var(--font-heading);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.2);
  text-transform: uppercase;

  &:hover {
    filter: brightness(1.2);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.6), inset 0 1px 0 rgba(255,255,255,0.3);
  }
  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 10px rgba(139, 92, 246, 0.4);
  }
  &:disabled {
    opacity: 0.6;
    cursor: default;
    transform: none;
    filter: grayscale(0.5);
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1.5rem;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const ModalContent = styled.div`
  background: var(--bg-secondary);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  width: 90%;
  max-width: 600px;
  max-height: 85vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  animation: modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes modalSlideUp {
    from { opacity: 0; transform: translateY(20px) scale(0.96); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
`;

export const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    margin: 0;
    color: var(--primary-color);
    font-size: 1.2rem;
  }
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
  &:hover { color: var(--text-primary); }
`;

export const ModalBody = styled.div`
  padding: 1.5rem;
  
  h4 {
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  p {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
  }

  ul {
    list-style: none;
    padding: 0;
    
    li {
      background: rgba(255,255,255,0.03);
      padding: 0.8rem;
      border-radius: 6px;
      margin-bottom: 0.5rem;
      border-left: 2px solid var(--primary-color);
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
  }
`;

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const StatBox = styled.div<{ $statType?: 'atk' | 'def' }>`
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.05);
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; 
    left: 0; 
    width: 100%; 
    height: 3px;
    background: ${props => props.$statType === 'atk' ? '#ef4444' : '#3b82f6'};
    opacity: 0.8;
  }
`;

export const StatLabel = styled.span`
  color: var(--text-secondary);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const StatValue = styled.span`
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
  font-family: var(--font-heading);
  letter-spacing: 0.05em;
`;

export const DescriptionBox = styled.div`
  background: rgba(0,0,0,0.2);
  border: 1px solid rgba(255,255,255,0.05);
  padding: 1.2rem;
  border-radius: 12px;
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--text-secondary);
  white-space: pre-wrap;
  font-family: 'Inter', sans-serif;
  box-shadow: inset 0 2px 10px rgba(0,0,0,0.2);
`;

export const DeckAreaContainer = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 3px;
  }
`;

export const DeckSection = styled.div`
  background: rgba(255,255,255,0.02);
  border-radius: 12px;
  padding: 1.5rem;
  min-height: 150px;
  height: auto;
  border: var(--glass-border);
  box-shadow: inset 0 0 20px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
`;

export const SectionLabel = styled.h3`
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--accent-color);
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  padding-bottom: 0.5rem;
  flex-shrink: 0;
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  gap: 6px;
  padding: 0.5rem;
  height: auto;

   @media (min-width: 1400px) {
    grid-template-columns: repeat(auto-fill, minmax(45px, 1fr));
  }
`;

export const MiniCard = styled.div`
  aspect-ratio: 59 / 86;
  position: relative;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 4px;

  img {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    background: #0f1120;
    display: block;
    object-fit: cover;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  }

  &:hover {
    transform: scale(1.1) translateY(-4px);
    z-index: 10;
    box-shadow: 0 0 0 2px var(--accent-color), 0 8px 16px rgba(0,0,0,0.6);
    
    img {
        filter: brightness(1.1);
    }
  }

  &:active {
    transform: scale(1.05);
  }
`;

export const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

export const SearchInputRow = styled.div`
  padding: 1rem;
  background: rgba(0,0,0,0.2);
  display: flex;
  gap: 0.8rem;
  flex-shrink: 0;
  flex-direction: column;
  border-bottom: var(--glass-border);

  input {
    flex: 1;
    background: rgba(0,0,0,0.4);
    border: var(--border-color);
    padding: 0.8rem;
    border-radius: 8px;
    color: var(--text-primary);
    width: 100%;
    transition: all 0.3s ease;
    font-size: 0.9rem;
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
      background: rgba(62, 147, 252, 0.05);
      box-shadow: none;
    }
    
    &::placeholder {
        color: rgba(255,255,255,0.2);
    }
  }

  small {
    color: var(--text-secondary);
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    gap: 6px;
    padding-left: 4px;
        
    svg {
        color: var(--accent-color);
    }
  }
`;

export const CatalogGrid = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(65px, 1fr));
  gap: 8px;
  align-content: start;
`;

export const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  background: ${props => props.$variant === 'primary' 
    ? 'var(--primary-color)' 
    : 'rgba(255,255,255,0.1)'};
  border: 1px solid ${props => props.$variant === 'primary' ? 'transparent' : 'rgba(255,255,255,0.1)'};
  color: var(--text-primary);
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 600;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  
  &:hover {
    background: ${props => props.$variant === 'primary' 
      ? 'var(--accent-color)' 
      : 'rgba(255,255,255,0.15)'};
    transform: translateY(-2px);
    box-shadow: none;
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const DeckNameInput = styled.input`
  background: transparent;
  border: var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 1.2rem;
  font-weight: 700;
  font-family: var(--font-heading);
  letter-spacing: 0.05em;
  padding: 6px 12px;
  width: 30%;
  transition: all 0.3s ease;
  cursor: text;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
    background: rgba(0, 0, 0, 0.2);
    box-shadow: 0 0 0 2px rgba(62, 147, 252, 0.2);
  }

  &::placeholder {
      color: rgba(255,255,255,0.3);
      font-style: italic;
  }
`;

export const NoSelectionInfo = styled.div`
  padding: 2rem;
  text-align: center;
  color: var(--text-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: center;

  div {
    background: rgba(255,255,255,0.05);
    padding: 2rem;
    border-radius: 50%;
    margin-bottom: 1.5rem;
  }
  
  h3 {
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
  }
  
  p {
    font-size: 0.9rem;
  }
`;

export const AIContainer = styled.div`
  flex: 1;
  overflow: hidden;
`;

export const SearchRowInner = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
`;
