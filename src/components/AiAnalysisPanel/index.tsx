import React, { useState } from 'react';
import { BrainCircuit, Sparkles, Zap, Target, Layers, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, ArrowRight, ArrowLeft, Shield, Lock, Users, RefreshCw, Key } from 'lucide-react';
import { AiDeckResponse } from '../../services/aiAnalysisService';
import { AiLoader } from '../AiLoader';
import { getCustomApiConfig } from '../../services/customAiService';
import * as S from './styles';

interface AiAnalysisPanelProps {
    onAnalyze: () => void;
    onForceAnalyze: () => void;
    isLoading: boolean;
    result: AiDeckResponse | null;
    isDisabled: boolean;
    onClose: () => void;
    usageLimit?: { used: number; limit: number };
}

const ScoreBar = ({ label, value, color, icon: Icon }: { label: string, value: number, color: string, icon: any }) => (
    <S.ScoreBarContainer>
        <S.ScoreHeader>
            <S.ScoreLabel>
                <Icon size={14} color={color} /> {label}
            </S.ScoreLabel>
            <S.ScoreValue>{value}/10</S.ScoreValue>
        </S.ScoreHeader>
        <S.BarBackground>
            <S.BarFill $width={value * 10} $color={color} />
        </S.BarBackground>
    </S.ScoreBarContainer>
);

export const AiAnalysisPanel: React.FC<AiAnalysisPanelProps> = ({ onAnalyze, onForceAnalyze, isLoading, result, isDisabled, onClose, usageLimit }) => {
    const [openCombo, setOpenCombo] = useState<number | null>(null);

    const isLimitReached = usageLimit ? usageLimit.used >= usageLimit.limit : false;

    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedbackVote, setFeedbackVote] = useState<'accurate' | 'inaccurate' | null>(null);
    const [feedbackReason, setFeedbackReason] = useState('');
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    const [feedbackError, setFeedbackError] = useState<string | null>(null);

    const handleVote = (vote: 'accurate' | 'inaccurate') => {
        setFeedbackVote(vote);
        setFeedbackError(null);
        setShowFeedbackModal(true);
    };

    const submitFeedbackVote = async () => {
        if (!result) {
            setFeedbackError('Erro: Análise não encontrada.');
            return;
        }
        
        if (!result.deckHash) {
            setFeedbackError('Erro: Hash do deck não disponível.');
            return;
        }
        
        if (!feedbackVote) {
            setFeedbackError('Erro: Selecione uma opção.');
            return;
        }
        
        if (feedbackReason.length < 5) {
            setFeedbackError('A justificativa deve ter pelo menos 5 caracteres.');
            return;
        }
        
        setIsSubmittingFeedback(true);
        setFeedbackError(null);
        
        try {
            const { submitFeedback } = await import('../../services/aiAnalysisService');
            await submitFeedback(result.deckHash, feedbackVote, feedbackReason);
            setHasVoted(true);
            setShowFeedbackModal(false);
            setFeedbackReason('');
        } catch (error: any) {
            console.error("Failed to submit feedback", error);
            setFeedbackError(error.response?.data?.message || 'Erro ao enviar feedback. Tente novamente.');
        } finally {
            setIsSubmittingFeedback(false);
        }
    };

    return (
        <S.PanelContainer>
            <S.HeaderRow>
                <S.HeaderLeftSection>
                    <S.BackButton onClick={onClose} aria-label="Voltar para o Deck">
                        <ArrowLeft size={20} />
                    </S.BackButton>
                    <S.HeaderTitle>Deck Builder</S.HeaderTitle>
                </S.HeaderLeftSection>
                
                {usageLimit && (
                    <S.HeaderCredits $isLimitReached={isLimitReached}>
                        <S.CreditsIcon>
                            <Sparkles size={16} color="white" />
                        </S.CreditsIcon>
                        <S.CreditsInfo>
                            <S.CreditsCount $isLimitReached={isLimitReached}>
                                {usageLimit.used}/{usageLimit.limit}
                            </S.CreditsCount>
                            <S.CreditsDescription>
                                {isLimitReached ? 'Limite Atingido' : 'Análises Realizadas'}
                            </S.CreditsDescription>
                        </S.CreditsInfo>
                    </S.HeaderCredits>
                )}
            </S.HeaderRow>

            {!result && !isLoading && (
                 <S.EmptyStateContainer>
                    <S.EmptyStateIconWrapper>
                        <BrainCircuit size={48} color="#94a3b8" />
                    </S.EmptyStateIconWrapper>
                    <S.EmptyStateText>Este deck ainda não possui análise.</S.EmptyStateText>
                    
                    <S.AnalyzeButton onClick={onAnalyze} disabled={isDisabled || isLimitReached}>
                        <Sparkles size={20} />
                        REALIZAR ANÁLISE INICIAL
                    </S.AnalyzeButton>
                    <S.UsageText>
                        Consome 1 crédito diário.
                        {usageLimit && (
                            <S.UsageCredits $isLimitReached={isLimitReached}>
                                {isLimitReached ? 'Limite Diário Atingido' : `Uso Hoje: ${usageLimit.used}/${usageLimit.limit}`}
                            </S.UsageCredits>
                        )}
                    </S.UsageText>
                 </S.EmptyStateContainer>
            )}

            {isLoading && (
                <AiLoader message="Analisando Estratégias do Deck..." />
            )}

            {result && !isLoading && (
                <S.ResultsContainer>
                    {result.source === 'custom' && (
                        <S.CustomApiBanner>
                            <Key size={20} />
                            <S.CustomApiBannerText>
                                <S.CustomApiBannerTitle>
                                    Análise via API Personalizada ({getCustomApiConfig()?.provider?.toUpperCase() || 'Custom'})
                                </S.CustomApiBannerTitle>
                                <S.CustomApiBannerSubtitle>
                                    Usando sua própria chave de API. Não consome créditos.
                                </S.CustomApiBannerSubtitle>
                            </S.CustomApiBannerText>
                        </S.CustomApiBanner>
                    )}

                    {result.source === 'cache' && (
                        <S.CommunityBanner>
                             <S.CommunityBannerHeader>
                                <S.CommunityBannerInfo>
                                    <S.CommunityIconWrapper>
                                        <Users size={20} color="#a855f7" />
                                    </S.CommunityIconWrapper>
                                    <div>
                                        <S.CommunityBannerTitle>Análise da Comunidade</S.CommunityBannerTitle>
                                        <S.CommunityBannerSubtitle>
                                            Análise baseada em decks similares. Pode conter imprecisões.
                                        </S.CommunityBannerSubtitle>
                                    </div>
                                </S.CommunityBannerInfo>
                                <S.CommunityBannerActions>
                                    <S.ForceRefreshButton onClick={onForceAnalyze} title="Gerar nova análise com IA" disabled={isLimitReached}>
                                        <RefreshCw size={14} /> Gerar Nova Análise (1 Crédito)
                                    </S.ForceRefreshButton>
                                </S.CommunityBannerActions>
                             </S.CommunityBannerHeader>

                             {!hasVoted && (
                                 <S.FeedbackContainer>
                                    <S.FeedbackLabel>Esta análise foi útil?</S.FeedbackLabel>
                                    <S.FeedbackButtons>
                                        <S.VoteButton 
                                            $type="accurate"
                                            onClick={() => handleVote('accurate')}
                                        >
                                            <ThumbsUp size={14} /> Sim
                                        </S.VoteButton>
                                        <S.VoteButton 
                                            $type="inaccurate"
                                            onClick={() => handleVote('inaccurate')}
                                        >
                                            <ThumbsDown size={14} /> Não
                                        </S.VoteButton>
                                    </S.FeedbackButtons>
                                 </S.FeedbackContainer>
                             )}
                             {hasVoted && (
                                 <S.FeedbackSuccess>
                                     ✓ Obrigado pelo seu feedback!
                                 </S.FeedbackSuccess>
                             )}
                        </S.CommunityBanner>
                    )}
                    
                     <S.ArchetypeTitleWrapper>
                        <S.ArchetypeTitle>{result.arquetipo || 'Deck Sem Nome'}</S.ArchetypeTitle>
                     </S.ArchetypeTitleWrapper>

                    <div>
                        <S.SectionHeader><Shield size={16} /> Meta Matchups</S.SectionHeader>
                        <S.MatchupsGrid>
                          {result.matchups?.map((m, i) => (
                            <S.MatchupCard key={i}>
                              <S.MatchupDeckName>{m.deckName}</S.MatchupDeckName>
                              <S.MatchupWinRate $winRate={m.winRate}>
                                {m.winRate}% VR
                              </S.MatchupWinRate>
                              <S.MatchupStrategy>{m.estrategia}</S.MatchupStrategy>
                            </S.MatchupCard>
                          ))}
                        </S.MatchupsGrid>
                    </div>

                    <S.ScoreGrid>
                        <ScoreBar label="Poder Ofensivo" value={result.metaScore.poderOfensivo} color="#ef4444" icon={Zap} />
                        <ScoreBar label="Consistência" value={result.metaScore.consistencia} color="#eab308" icon={Target} />
                        <ScoreBar label="Resiliência" value={result.metaScore.resiliencia} color="#3b82f6" icon={Shield} />
                        <ScoreBar label="Controle" value={result.metaScore.controle} color="#a855f7" icon={Lock} />
                    </S.ScoreGrid>

                    <div>
                        <S.SectionHeader><BrainCircuit size={16} /> Análise Geral</S.SectionHeader>
                        <S.ReviewText>{result.analiseGeral}</S.ReviewText>
                    </div>

                     <S.GamePlanGrid>
                        <S.GamePlanCard $mode="turn1">
                            <S.PlanTitle $color="#60a5fa">Turno 1 (Going First)</S.PlanTitle>
                            <S.PlanDescription>
                                {result.planoDeJogo?.turno1 || 'N/A'}
                            </S.PlanDescription>
                        </S.GamePlanCard>
                        <S.GamePlanCard $mode="turn2">
                            <S.PlanTitle $color="#f87171">Turno 2 (Going Second)</S.PlanTitle>
                            <S.PlanDescription>
                                {result.planoDeJogo?.turno2 || 'N/A'}
                            </S.PlanDescription>
                        </S.GamePlanCard>
                    </S.GamePlanGrid>

                    <S.PointsGrid>
                        <div>
                            <S.SectionHeader>Pontos Fortes</S.SectionHeader>
                            <S.PointList>
                                {result.pontosFortes.map((p, i) => (
                                    <S.PointItem key={i} $type="good"><ThumbsUp size={14} /> {p}</S.PointItem>
                                ))}
                            </S.PointList>
                        </div>
                        <div>
                            <S.SectionHeader>Fraquezas</S.SectionHeader>
                            <S.PointList>
                                {result.pontosFracos.map((p, i) => (
                                    <S.PointItem key={i} $type="bad"><ThumbsDown size={14} /> {p}</S.PointItem>
                                ))}
                            </S.PointList>
                        </div>
                    </S.PointsGrid>

                    <div>
                        <S.SectionHeader><Layers size={16} /> Combos Principais</S.SectionHeader>
                        {result.combosChave.map((combo, idx) => (
                            <S.Accordion key={idx}>
                                <S.AccordionHeader onClick={() => setOpenCombo(openCombo === idx ? null : idx)}>
                                    <span>{combo.nome}</span>
                                    {openCombo === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </S.AccordionHeader>
                                <S.AccordionContent $isOpen={openCombo === idx}>
                                    <S.StepList>
                                        {combo.passos.map((step, sIdx) => (
                                            <li key={sIdx}>{step}</li>
                                        ))}
                                    </S.StepList>
                                </S.AccordionContent>
                            </S.Accordion>
                        ))}
                    </div>

                    <div>
                        <S.SectionHeader><ArrowRight size={16} /> Sugestões</S.SectionHeader>
                        {result.sugestoesMelhoria.map((sug, idx) => (
                            <S.SuggestionCard key={idx} $action={sug.acao}>
                                <S.SuggestionContent>
                                    <S.SuggestionHeader>
                                        {sug.acao} {sug.qtd}x {sug.carta}
                                    </S.SuggestionHeader>
                                    <S.SuggestionReason>{sug.motivo}</S.SuggestionReason>
                                </S.SuggestionContent>
                            </S.SuggestionCard>
                        ))}
                    </div>
                </S.ResultsContainer>
            )}

            {/* Feedback Modal */}
            {showFeedbackModal && (
                <S.FeedbackModalOverlay>
                    <S.FeedbackModalContent>
                        <S.FeedbackTitle>
                            {feedbackVote === 'accurate' ? 'O que foi preciso?' : 'O que está errado?'}
                        </S.FeedbackTitle>
                        <S.FeedbackSubtitle>
                            Ajude a IA a aprender. Sua justificativa é obrigatória (mín. 5 caracteres).
                        </S.FeedbackSubtitle>
                        <S.FeedbackTextArea 
                            value={feedbackReason}
                            onChange={(e) => {
                                setFeedbackReason(e.target.value);
                                if (feedbackError) setFeedbackError(null);
                            }}
                            placeholder="Descreva brevemente..."
                        />
                        {feedbackError && (
                            <S.FeedbackErrorMessage>
                                {feedbackError}
                            </S.FeedbackErrorMessage>
                        )}
                        <S.FeedbackActions>
                            <S.CancelButton 
                                onClick={() => {
                                    setShowFeedbackModal(false);
                                    setFeedbackError(null);
                                }}
                                disabled={isSubmittingFeedback}
                            >
                                Cancelar
                            </S.CancelButton>
                            <S.SubmitButton 
                                onClick={submitFeedbackVote}
                                disabled={isSubmittingFeedback || feedbackReason.length < 5}
                            >
                                {isSubmittingFeedback ? 'Enviando...' : 'Enviar Feedback'}
                            </S.SubmitButton>
                        </S.FeedbackActions>
                    </S.FeedbackModalContent>
                </S.FeedbackModalOverlay>
            )}

        </S.PanelContainer>
    );
};
