import styled from 'styled-components';
import { Smartphone } from 'lucide-react';

const BlockerContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #0f172a;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  text-align: center;
  color: #e2e8f0;

  @media (min-width: 1024px) {
    display: none;
  }
`;

const IconWrapper = styled.div`
  margin-bottom: 2rem;
  color: var(--accent-color);
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% { opacity: 0.6; transform: scale(0.95); }
    50% { opacity: 1; transform: scale(1.05); }
    100% { opacity: 0.6; transform: scale(0.95); }
  }
`;

const Title = styled.h2`
  font-family: var(--font-heading);
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const Message = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  max-width: 300px;
  color: #94a3b8;
`;

export const MobileBlocker = () => {
    return (
        <BlockerContainer>
            <IconWrapper>
                <Smartphone size={64} />
            </IconWrapper>
            <Title>Desktop Only</Title>
            <Message>
                A versão mobile deste Deck Builder está em desenvolvimento. 
                <br /><br />
                Por favor, acesse através de um computador para a experiêcia completa de duelo.
            </Message>
        </BlockerContainer>
    );
};
