import styled, { keyframes } from 'styled-components';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const PanelContainer = styled.div`
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(10px);
  border-left: 1px solid rgba(139, 92, 246, 0.2);
  padding: 1.5rem;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: ${fadeIn} 0.5s ease-out;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(0,0,0,0.1);
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(139, 92, 246, 0.3);
    border-radius: 3px;
  }
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const BackButton = styled.button`
  background: rgba(255,255,255,0.1);
  border: none;
  border-radius: 8px;
  padding: 8px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: rgba(255,255,255,0.2);
    transform: translateX(-2px);
  }
`;

export const HeaderTitle = styled.h3`
  margin: 0;
  color: white;
  font-size: 1.1rem;
`;

export const HeaderLeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const HeaderCredits = styled.div<{ $isLimitReached?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${(props) =>
    props.$isLimitReached
      ? 'rgba(239, 68, 68, 0.15)'
      : 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)'};
  border: 1px solid ${(props) =>
    props.$isLimitReached ? 'rgba(239, 68, 68, 0.4)' : 'rgba(168, 85, 247, 0.4)'};
  border-radius: 10px;
  padding: 8px 14px;
`;

export const CreditsIcon = styled.div`
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);  
  border-radius: 6px;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CreditsInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

export const CreditsCount = styled.span<{ $isLimitReached?: boolean }>`
  font-size: 1rem;
  font-weight: 700;
  color: ${(props) => (props.$isLimitReached ? '#ef4444' : '#a855f7')};
  font-family: var(--font-heading);
`;

export const CreditsDescription = styled.span`
  font-size: 0.65rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

export const EmptyStateContainer = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #94a3b8;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

export const EmptyStateIconWrapper = styled.div`
  background: rgba(255,255,255,0.05);
  padding: 20px;
  border-radius: 50%;
`;

export const EmptyStateText = styled.p`
  font-size: 1.1rem;
  margin: 0;
`;

export const AnalyzeButton = styled.button`
  background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
  border: none;
  border-radius: 12px;
  padding: 1rem;
  color: white;
  font-weight: 800;
  font-family: var(--font-heading);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;

  &:hover {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    filter: grayscale(0.8);
  }
`;

export const UsageText = styled.div`
  font-size: 0.8rem;
  opacity: 0.7;
  margin-top: 1rem;
`;

export const UsageCredits = styled.div<{ $isLimitReached: boolean }>`
  margin-top: 4px;
  color: ${(props) => (props.$isLimitReached ? '#ef4444' : '#22c55e')};
  font-weight: bold;
`;

export const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: ${fadeIn} 0.6s ease-out;
`;

export const CommunityBanner = styled.div`
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(135deg, rgba(99, 102, 241) 0%, rgba(168, 85, 247) 100%);
  }
`;

export const CustomApiBanner = styled.div`
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.1) 100%);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 12px;
  padding: 14px 18px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  
  svg {
    color: #22c55e;
    flex-shrink: 0;
  }
`;

export const CustomApiBannerText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const CustomApiBannerTitle = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #22c55e;
`;

export const CustomApiBannerSubtitle = styled.span`
  font-size: 0.75rem;
  color: #a1a1aa;
`;

export const CommunityBannerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
`;

export const CommunityBannerInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
`;

export const CommunityIconWrapper = styled.div`
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%);
  border-radius: 10px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CommunityBannerTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 4px;
`;

export const CommunityBannerSubtitle = styled.div`
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.4;
`;

export const CommunityBannerActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  min-width: 140px;
`;

export const CreditsDisplay = styled.div<{ $isLimitReached: boolean }>`
  background: ${(props) =>
    props.$isLimitReached ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.1)'};
  border: 1px solid ${(props) =>
    props.$isLimitReached ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'};
  border-radius: 8px;
  padding: 10px 12px;
  text-align: center;
`;

export const CreditsValue = styled.div<{ $isLimitReached: boolean }>`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${(props) => (props.$isLimitReached ? '#ef4444' : '#22c55e')};
  font-family: var(--font-heading);
`;

export const CreditsLabel = styled.div<{ $isLimitReached?: boolean }>`
  font-size: 0.65rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 2px;
`;

export const ForceRefreshButton = styled.button`
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  border: none;
  color: white;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--text-muted);
    box-shadow: none;
  }
`;

export const FeedbackContainer = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const FeedbackLabel = styled.span`
  color: var(--text-secondary);
  font-size: 0.85rem;
`;

export const FeedbackButtons = styled.div`
  display: flex;
  gap: 10px;
`;

export const VoteButton = styled.button<{ $type: 'accurate' | 'inaccurate' }>`
  background: ${(props) =>
    props.$type === 'accurate' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  border: 1px solid ${(props) => (props.$type === 'accurate' ? '#22c55e' : '#ef4444')};
  border-radius: 6px;
  padding: 6px 12px;
  color: ${(props) => (props.$type === 'accurate' ? '#22c55e' : '#ef4444')};
  cursor: pointer;
  display: flex;
  gap: 6px;
  align-items: center;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    background: ${(props) =>
      props.$type === 'accurate' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
    transform: translateY(-1px);
  }
`;

export const FeedbackSuccess = styled.div`
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 8px;
  padding: 12px;
  font-size: 0.85rem;
  color: #22c55e;
  text-align: center;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const ArchetypeTitleWrapper = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

export const ArchetypeTitle = styled.h2`
  margin: 0;
  font-size: 1.8rem;
  background: linear-gradient(to right, #fff, #94a3b8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  font-family: var(--font-heading);
`;

export const MatchupsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.8rem;
`;

export const MatchupCard = styled.div`
  background: rgba(255,255,255,0.03);
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.05);
`;

export const MatchupDeckName = styled.div`
  font-size: 0.8rem;
  color: #94a3b8;
  text-transform: uppercase;
  margin-bottom: 4px;
`;

export const MatchupWinRate = styled.div<{ $winRate: number }>`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${(props) => (props.$winRate >= 50 ? '#22c55e' : '#ef4444')};
  margin-bottom: 6px;
`;

export const MatchupStrategy = styled.p`
  font-size: 0.75rem;
  margin: 0;
  color: #cbd5e1;
  line-height: 1.4;
`;

export const ScoreGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

export const ScoreBarContainer = styled.div`
  margin-bottom: 0.5rem;
`;

export const ScoreHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.3rem;
  font-size: 0.85rem;
  color: #cbd5e1;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const ScoreLabel = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

export const ScoreValue = styled.span`
  color: white;
  font-weight: bold;
`;

export const BarBackground = styled.div`
  height: 8px;
  background: rgba(255,255,255,0.1);
  border-radius: 4px;
  overflow: hidden;
`;

export const BarFill = styled.div<{ $width: number; $color: string }>`
  height: 100%;
  width: ${(props) => props.$width}%;
  background: ${(props) => props.$color};
  border-radius: 4px;
  transition: width 1s ease-out;
`;

export const SectionHeader = styled.h4`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--accent-color);
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

export const ReviewText = styled.p`
  color: #cbd5e1;
  line-height: 1.6;
  font-size: 0.95rem;
  background: rgba(0,0,0,0.2);
  padding: 1rem;
  border-radius: 8px;
  border-left: 3px solid var(--accent-color);
`;

export const GamePlanGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

export const GamePlanCard = styled.div<{ $mode: 'turn1' | 'turn2' }>`
  background: ${(props) =>
    props.$mode === 'turn1'
      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)'
      : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)'};
  border: 1px solid ${(props) => (props.$mode === 'turn1' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(239, 68, 68, 0.2)')};
  border-radius: 12px;
  padding: 1.2rem;
  margin-bottom: 1rem;
`;

export const PlanTitle = styled.h5<{ $color: string }>`
  margin: 0 0 0.8rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${(props) => props.$color};
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const PlanDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #cbd5e1;
  line-height: 1.5;
`;

export const PointList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const PointItem = styled.li<{ $type: 'good' | 'bad' }>`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #e2e8f0;
  
  svg {
    min-width: 16px;
    margin-top: 3px;
    color: ${(props) => (props.$type === 'good' ? '#22c55e' : '#ef4444')};
  }
`;

export const Accordion = styled.div`
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

export const AccordionHeader = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255,255,255,0.02);
  border: none;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(255,255,255,0.05);
  }
`;

export const AccordionContent = styled.div<{ $isOpen: boolean }>`
  max-height: ${(props) => (props.$isOpen ? '500px' : '0')};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
  background: rgba(0,0,0,0.2);
`;

export const StepList = styled.ol`
  padding: 1rem 1rem 1rem 2.5rem;
  margin: 0;
  color: #cbd5e1;
  font-size: 0.9rem;
  
  li {
    margin-bottom: 0.5rem;
    &:last-child { margin-bottom: 0; }
  }
`;

export const SuggestionCard = styled.div<{ $action: 'Adicionar' | 'Remover' }>`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(255,255,255,0.03);
  padding: 0.8rem;
  border-radius: 8px;
  border-left: 3px solid ${(props) => (props.$action === 'Adicionar' ? '#22c55e' : '#ef4444')};
  margin-bottom: 0.5rem;
`;

export const SuggestionContent = styled.div`
  flex: 1;
`;

export const SuggestionHeader = styled.div`
  font-weight: bold;
  font-size: 0.9rem;
`;

export const SuggestionReason = styled.div`
  font-size: 0.8rem;
  color: #94a3b8;
`;

// Modal Styles
export const FeedbackModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(4px);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
`;

export const FeedbackModalContent = styled.div`
  background: var(--glass-heavy);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 28px;
  width: 90%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--primary-color) 0%, #a855f7 100%);
  }
`;

export const FeedbackTitle = styled.h4`
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-primary);
  font-family: var(--font-heading);
`;

export const FeedbackSubtitle = styled.p`
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
`;

export const FeedbackTextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  background: var(--input-bg);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 14px;
  color: var(--text-primary);
  font-size: 0.95rem;
  font-family: var(--font-body);
  resize: none;
  outline: none;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: var(--primary-color);
  }
  
  &::placeholder {
    color: var(--text-muted);
  }
`;

export const FeedbackActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 4px;
`;

export const CancelButton = styled.button`
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 10px 18px;
  color: var(--text-secondary);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    color: var(--text-primary);
    border-color: var(--text-secondary);
  }
`;

export const SubmitButton = styled.button`
  background: linear-gradient(135deg, var(--primary-color) 0%, #6366f1 100%);
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 10px rgba(59, 130, 246, 0.3);

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
  }
`;

export const PointsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

export const FeedbackErrorMessage = styled.div`
  color: var(--error-color);
  font-size: 0.85rem;
  padding: 8px 12px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 6px;
`;
