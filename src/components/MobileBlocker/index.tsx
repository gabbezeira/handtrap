import { MonitorX } from 'lucide-react';
import * as S from './styles';

export const MobileBlocker = () => {
  return (
    <S.Container>
      <S.Scanline />
      <S.IconWrapper>
        <MonitorX size={64} color="#ef4444" />
      </S.IconWrapper>
      <S.Title>Acesso Restrito</S.Title>
      <S.Description>
        Esta aplicação foi desenvolvida para experiência Desktop. Por favor, acesse através de um
        computador para utilizar todas as funcionalidades de análise e construção de decks.
      </S.Description>
    </S.Container>
  );
};
