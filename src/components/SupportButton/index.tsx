import { Heart, X, Copy } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  ButtonContainer,
  SupportLabel,
  ModalOverlay,
  ModalContent,
  CloseButton,
  Title,
  Subtitle,
  QrPlaceholder,
  PixKeyBox,
  KeyText,
  CopyButton,
  CopiedText
} from './styles';

import qrcodePix from '../../assets/images/qrcode-pix.png';

// Use local image
const QR_IMAGE_URL = qrcodePix;
const PIX_KEY = 'ac588dff-1efa-43ee-a34e-483fd1813602'; // Replace with real key if extracted from QR later, for now keeping placeholder logic safe or user provided one? 
// Actually user didn't provide key text, just image. I will keep the key variable but maybe user wants me to extract it? 
// For now I will just use the image.
// User didn't give me the text key string, so I will put a generic message or keep the one that might be there?
// The previous code had a long PIX string in the URL. I'll define PIX_KEY as generic for now until user provides the text string for copy-paste.
 

export const SupportButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showLabel, setShowLabel] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PIX_KEY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
        setShowLabel(true);
        setTimeout(() => setShowLabel(false), 4000); // Show for 4 seconds
    }, 60000); // Trigger every 1 minute

    // Initial trigger
    setTimeout(() => setShowLabel(true), 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <SupportLabel $visible={showLabel}>Doe para ajudar</SupportLabel>
      <ButtonContainer onClick={() => setIsOpen(true)} title="Apoiar o Projeto">
        <Heart fill="white" size={24} />
      </ButtonContainer>

      {isOpen && createPortal(
        <ModalOverlay onClick={() => setIsOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <CloseButton onClick={() => setIsOpen(false)}>
              <X size={24} />
            </CloseButton>
            
            <Title>Apoie o Projeto 💖</Title>
            <Subtitle>
              Ajude a manter o Handtrap Xyz online e recebendo atualizações com qualquer valor!
            </Subtitle>

            <QrPlaceholder>
              <img src={QR_IMAGE_URL} alt="QR Code Pix" />
            </QrPlaceholder>

            <PixKeyBox>
              <KeyText>{PIX_KEY}</KeyText>
              <CopyButton onClick={handleCopy} title="Copiar Chave">
                 {copied ? <CopiedText>Copiado!</CopiedText> : <Copy size={18} />}
              </CopyButton>
            </PixKeyBox>

          </ModalContent>
        </ModalOverlay>,
        document.body
      )}
    </>
  );
};
