import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Loader2, BrainCircuit, Sparkles, Zap, Target, Layers, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, ArrowRight, ArrowLeft, Shield, Lock } from 'lucide-react';
import { AiDeckResponse } from '../../services/aiAnalysisService';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PanelContainer = styled.div`
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

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const BackButton = styled.button`
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

const AnalyzeButton = styled.button`
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

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: ${fadeIn} 0.6s ease-out;
`;

const ScoreGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

const ScoreBarContainer = styled.div`
  margin-bottom: 0.5rem;
`;

const ScoreHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.3rem;
  font-size: 0.85rem;
  color: #cbd5e1;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const BarBackground = styled.div`
  height: 8px;
  background: rgba(255,255,255,0.1);
  border-radius: 4px;
  overflow: hidden;
`;

const BarFill = styled.div<{ $width: number; $color: string }>`
  height: 100%;
  width: ${props => props.$width}%;
  background: ${props => props.$color};
  border-radius: 4px;
  transition: width 1s ease-out;
`;

const GamePlanCard = styled.div<{ $mode: 'turn1' | 'turn2' }>`
  background: ${props => props.$mode === 'turn1' 
    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)'};
  border: 1px solid ${props => props.$mode === 'turn1' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
  border-radius: 12px;
  padding: 1.2rem;
  margin-bottom: 1rem;
`;

const PlanTitle = styled.h5<{ $color: string }>`
  margin: 0 0 0.8rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.$color};
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const SectionHeader = styled.h4`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--accent-color);
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const ReviewText = styled.p`
  color: #cbd5e1;
  line-height: 1.6;
  font-size: 0.95rem;
  background: rgba(0,0,0,0.2);
  padding: 1rem;
  border-radius: 8px;
  border-left: 3px solid var(--accent-color);
`;

const PointList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PointItem = styled.li<{ $type: 'good' | 'bad' }>`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #e2e8f0;
  
  svg {
    min-width: 16px;
    margin-top: 3px;
    color: ${props => props.$type === 'good' ? '#22c55e' : '#ef4444'};
  }
`;

const Accordion = styled.div`
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const AccordionHeader = styled.button`
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

const AccordionContent = styled.div<{ $isOpen: boolean }>`
  max-height: ${props => props.$isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
  background: rgba(0,0,0,0.2);
`;

const StepList = styled.ol`
  padding: 1rem 1rem 1rem 2.5rem;
  margin: 0;
  color: #cbd5e1;
  font-size: 0.9rem;
  
  li {
    margin-bottom: 0.5rem;
    &:last-child { margin-bottom: 0; }
  }
`;

const SuggestionCard = styled.div<{ $action: 'Adicionar' | 'Remover' }>`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(255,255,255,0.03);
  padding: 0.8rem;
  border-radius: 8px;
  border-left: 3px solid ${props => props.$action === 'Adicionar' ? '#22c55e' : '#ef4444'};
  margin-bottom: 0.5rem;
`;

interface AiAnalysisPanelProps {
    onAnalyze: () => void;
    isLoading: boolean;
    result: AiDeckResponse | null;
    isDisabled: boolean;
    onClose: () => void;
}

const ScoreBar = ({ label, value, color, icon: Icon }: { label: string, value: number, color: string, icon: any }) => (
    <ScoreBarContainer>
        <ScoreHeader>
            <div style={{display:'flex', gap:'6px', alignItems:'center'}}>
                <Icon size={14} color={color} /> {label}
            </div>
            <span style={{color:'white', fontWeight:'bold'}}>{value}/10</span>
        </ScoreHeader>
        <BarBackground>
            <BarFill $width={value * 10} $color={color} />
        </BarBackground>
    </ScoreBarContainer>
);

export const AiAnalysisPanel: React.FC<AiAnalysisPanelProps> = ({ onAnalyze, isLoading, result, isDisabled, onClose }) => {
    const [openCombo, setOpenCombo] = useState<number | null>(null);

    return (
        <PanelContainer>
            <HeaderRow>
                <BackButton onClick={onClose} aria-label="Voltar para o Deck">
                    <ArrowLeft size={20} />
                </BackButton>
                <h3 style={{margin:0, color:'white', fontSize:'1.1rem'}}>AI Deck Coach</h3>
            </HeaderRow>

            <AnalyzeButton onClick={onAnalyze} disabled={isLoading || isDisabled}>
                {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                {isLoading ? 'ANALISANDO ESTRATÉGIAS...' : 'INICIAR ANÁLISE DO DECK'}
            </AnalyzeButton>

            {result && (
                <ResultsContainer>
                     <div style={{textAlign:'center', marginBottom:'1rem'}}>
                        <h2 style={{
                            margin:0, 
                            fontSize:'1.8rem', 
                            background: 'linear-gradient(to right, #fff, #94a3b8)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontFamily: 'var(--font-heading)'
                        }}>{result.arquetipo || 'Deck Sem Nome'}</h2>
                     </div>

                    <div style={{marginBottom:'1rem'}}>
                        <SectionHeader><Shield size={16} /> Meta Matchups</SectionHeader>
                        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.8rem'}}>
                          {result.matchups?.map((m, i) => (
                            <div key={i} style={{background:'rgba(255,255,255,0.03)', padding:'0.8rem', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.05)'}}>
                              <div style={{fontSize:'0.8rem', color:'#94a3b8', textTransform:'uppercase', marginBottom:'4px'}}>{m.deckName}</div>
                              <div style={{fontSize:'1.2rem', fontWeight:'bold', color: m.winRate >= 50 ? '#22c55e' : '#ef4444', marginBottom:'6px'}}>
                                {m.winRate}% VR
                              </div>
                              <p style={{fontSize:'0.75rem', margin:0, color:'#cbd5e1', lineHeight:1.4}}>{m.estrategia}</p>
                            </div>
                          ))}
                        </div>
                    </div>

                    <ScoreGrid>
                        <ScoreBar label="Poder Ofensivo" value={result.metaScore.poderOfensivo} color="#ef4444" icon={Zap} />
                        <ScoreBar label="Consistência" value={result.metaScore.consistencia} color="#eab308" icon={Target} />
                        <ScoreBar label="Resiliência" value={result.metaScore.resiliencia} color="#3b82f6" icon={Shield} />
                        <ScoreBar label="Controle" value={result.metaScore.controle} color="#a855f7" icon={Lock} />
                    </ScoreGrid>

                    <div>
                        <SectionHeader><BrainCircuit size={16} /> Análise Geral</SectionHeader>
                        <ReviewText>{result.analiseGeral}</ReviewText>
                    </div>

                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <GamePlanCard $mode="turn1">
                            <PlanTitle $color="#60a5fa">Turno 1 (Going First)</PlanTitle>
                            <p style={{margin:0, fontSize:'0.9rem', color:'#cbd5e1', lineHeight:1.5}}>
                                {result.planoDeJogo?.turno1 || 'N/A'}
                            </p>
                        </GamePlanCard>
                        <GamePlanCard $mode="turn2">
                            <PlanTitle $color="#f87171">Turno 2 (Going Second)</PlanTitle>
                            <p style={{margin:0, fontSize:'0.9rem', color:'#cbd5e1', lineHeight:1.5}}>
                                {result.planoDeJogo?.turno2 || 'N/A'}
                            </p>
                        </GamePlanCard>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <SectionHeader>Pontos Fortes</SectionHeader>
                            <PointList>
                                {result.pontosFortes.map((p, i) => (
                                    <PointItem key={i} $type="good"><ThumbsUp size={14} /> {p}</PointItem>
                                ))}
                            </PointList>
                        </div>
                        <div>
                            <SectionHeader>Fraquezas</SectionHeader>
                            <PointList>
                                {result.pontosFracos.map((p, i) => (
                                    <PointItem key={i} $type="bad"><ThumbsDown size={14} /> {p}</PointItem>
                                ))}
                            </PointList>
                        </div>
                    </div>

                    <div>
                        <SectionHeader><Layers size={16} /> Combos Principais</SectionHeader>
                        {result.combosChave.map((combo, idx) => (
                            <Accordion key={idx}>
                                <AccordionHeader onClick={() => setOpenCombo(openCombo === idx ? null : idx)}>
                                    <span>{combo.nome}</span>
                                    {openCombo === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </AccordionHeader>
                                <AccordionContent $isOpen={openCombo === idx}>
                                    <StepList>
                                        {combo.passos.map((step, sIdx) => (
                                            <li key={sIdx}>{step}</li>
                                        ))}
                                    </StepList>
                                </AccordionContent>
                            </Accordion>
                        ))}
                    </div>

                    <div>
                        <SectionHeader><ArrowRight size={16} /> Sugestões</SectionHeader>
                        {result.sugestoesMelhoria.map((sug, idx) => (
                            <SuggestionCard key={idx} $action={sug.acao}>
                                <div style={{flex: 1}}>
                                    <div style={{fontWeight: 'bold', fontSize: '0.9rem'}}>
                                        {sug.acao} {sug.qtd}x {sug.carta}
                                    </div>
                                    <div style={{fontSize: '0.8rem', color: '#94a3b8'}}>{sug.motivo}</div>
                                </div>
                            </SuggestionCard>
                        ))}
                    </div>
                </ResultsContainer>
            )}
        </PanelContainer>
    );
};
