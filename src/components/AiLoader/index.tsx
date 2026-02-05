import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import * as S from './styles';

// Tips that rotate during loading
const TIPS = [
  { label: 'Dica:', text: 'Decks consistentes têm pelo menos 3 cópias de seus starters.' },
  { label: 'Meta:', text: 'Dracotail, Mitsurugi e Yummy dominam o formato atual.' },
  { label: 'Dica:', text: 'Hand traps como Ash Blossom e Maxx "C" são essenciais no MD.' },
  { label: 'Sistema:', text: 'A análise é salva para a comunidade após gerada.' },
  { label: 'Dica:', text: 'Teste sua mão inicial antes de jogar ranked!' },
  { label: 'Meta:', text: 'Nibiru é devastador contra decks que invocam muito.' },
  { label: 'Sistema:', text: 'Você tem 10 análises gratuitas por dia.' },
  { label: 'Dica:', text: 'Cartas genéricas aumentam a flexibilidade do deck.' },
  { label: 'Meta:', text: 'Called by the Grave é limitada - use com sabedoria.' },
  { label: 'Dica:', text: 'Um Extra Deck bem construído complementa qualquer strategy.' },
  { label: 'Sistema:', text: 'Análises da comunidade podem ser atualizadas a qualquer momento.' },
  { label: 'Dica:', text: 'Sempre tenha um plano para going first E going second.' },
];

interface AiLoaderProps {
  message?: string;
}

export const AiLoader: React.FC<AiLoaderProps> = ({ 
  message = 'Analisando com IA...' 
}) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    // Start with a random tip
    setCurrentTipIndex(Math.floor(Math.random() * TIPS.length));
    
    // Rotate tips every 4 seconds
    const interval = setInterval(() => {
      setCurrentTipIndex(prev => (prev + 1) % TIPS.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentTip = TIPS[currentTipIndex];

  return (
    <S.LoaderContainer>
      <S.IconWrapper>
        <S.GlowRing />
        <S.IconCircle>
          <S.SpinnerIcon>
            <Sparkles size={28} color="white" />
          </S.SpinnerIcon>
        </S.IconCircle>
      </S.IconWrapper>

      <S.TextContainer>
        <S.MainText>{message}</S.MainText>
        <S.TipContainer key={currentTipIndex}>
          <S.TipText>
            <S.TipLabel>{currentTip.label}</S.TipLabel>
            {currentTip.text}
          </S.TipText>
        </S.TipContainer>
      </S.TextContainer>

      <S.DotsContainer>
        {[0, 1, 2].map((i) => (
          <S.Dot 
            key={i} 
            $active={Math.floor(currentTipIndex / 4) % 3 === i} 
          />
        ))}
      </S.DotsContainer>
    </S.LoaderContainer>
  );
};
