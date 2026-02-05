import React from 'react';
import { createPortal } from 'react-dom';
import { X, BrainCircuit, Trophy, Target, PlayCircle, Key } from 'lucide-react';
import { AiHandResponse } from '../../services/aiAnalysisService';
import { getCustomApiConfig } from '../../services/customAiService';
import { CardData } from '../../services/cardDatabase';
import * as S from './styles';

interface HandAnalysisResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: AiHandResponse | null;
  hand?: CardData[];
}

export const HandAnalysisResultModal: React.FC<HandAnalysisResultModalProps> = ({
  isOpen,
  onClose,
  analysis,
}) => {
  if (!isOpen || !analysis) return null;

  return createPortal(
    <S.AnalysisOverlay onClick={onClose}>
      <S.AnalysisContent onClick={(e) => e.stopPropagation()}>
        <S.AnalysisHeader>
          <S.AnalysisTitle>
            <BrainCircuit size={28} />
            Análise da Mão
          </S.AnalysisTitle>
          <S.AnalysisCloseBtn onClick={onClose}>
            <X size={18} />
          </S.AnalysisCloseBtn>
        </S.AnalysisHeader>

        <S.AnalysisScrollableBody>
          {analysis.source === 'custom' && (
            <S.CustomApiBanner>
              <Key size={18} />
              <S.CustomApiBannerText>
                <S.CustomApiBannerTitle>
                  Análise via API Personalizada (
                  {getCustomApiConfig()?.provider?.toUpperCase() || 'Custom'})
                </S.CustomApiBannerTitle>
                <S.CustomApiBannerSubtitle>
                  Usando sua própria chave de API. Não consome créditos.
                </S.CustomApiBannerSubtitle>
              </S.CustomApiBannerText>
            </S.CustomApiBanner>
          )}

          <S.ScoreSection>
            <S.ScoreCircle>
              <span>{analysis.score}</span>
              <span>/ 10</span>
            </S.ScoreCircle>
            <S.ScoreText>
              <h4>
                {analysis.score >= 8
                  ? 'Mão Excelente'
                  : analysis.score >= 5
                    ? 'Mão Jogável'
                    : 'Mão Fraca / Brick'}
              </h4>
              <p>
                {analysis.score >= 8
                  ? 'Esta mão tem alto potencial de combo e acesso a starters.'
                  : analysis.score >= 5
                    ? 'Permite jogar, mas pode ser interrompida ou é sub-ótima.'
                    : 'Falta de iniciadores ou excesso de cartas mortas.'}
              </p>
              {analysis.bricks && analysis.bricks.length > 0 && (
                <S.BricksText>
                  <strong>Bricks:</strong> {analysis.bricks.join(', ')}
                </S.BricksText>
              )}
            </S.ScoreText>
          </S.ScoreSection>

          <S.GridSection>
            <S.StrategyCard $variant="first">
              <h3>
                <PlayCircle size={18} /> Going First
              </h3>
              <p>{analysis.strategy_going_first}</p>
            </S.StrategyCard>
            <S.StrategyCard $variant="second">
              <h3>
                <S.RotatedIcon>
                  <PlayCircle size={18} />
                </S.RotatedIcon>{' '}
                Going Second
              </h3>
              <p>{analysis.strategy_going_second}</p>
            </S.StrategyCard>
          </S.GridSection>

          {analysis.key_combos && analysis.key_combos.length > 0 && (
            <S.CombosSection>
              <S.SectionTitle>
                <Trophy size={18} /> Combos Chave
              </S.SectionTitle>
              {analysis.key_combos.map((combo, idx) => (
                <S.ComboItem key={idx}>
                  <Target size={16} />
                  <span>{combo}</span>
                </S.ComboItem>
              ))}
            </S.CombosSection>
          )}
        </S.AnalysisScrollableBody>
      </S.AnalysisContent>
    </S.AnalysisOverlay>,
    document.body,
  );
};
