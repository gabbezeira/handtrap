import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Cpu, X, Shield, Zap, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import {
  Overlay,
  Modal,
  Header,
  Title,
  CloseButton,
  Body,
  Section,
  SectionTitle,
  ProviderSelector,
  ProviderOption,
  ProviderName,
  ProviderIcon,
  InputGroup,
  Label,
  Input,
  TextArea,
  WarningBanner,
  WarningText,
  Footer,
  Button,
  ToggleRow,
  ToggleLabel,
  ToggleTitle,
  ToggleDescription,
  Toggle,
  TestButton,
  InputRow,
  InputWrapper,
  ModelHelperText
} from './styles';
import {
  AiProvider,
  CustomApiConfig,
  getCustomApiConfig,
  saveCustomApiConfig,
  clearCustomApiConfig,
  testCustomApiConnection
} from '../../services/customAiService';

interface CustomApiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROVIDERS: { id: AiProvider; name: string; icon: string }[] = [
  { id: 'gemini', name: 'Gemini', icon: '✨' },
  { id: 'openai', name: 'ChatGPT', icon: '🤖' },
  { id: 'anthropic', name: 'Claude', icon: '🧠' }
];

export const CustomApiModal: React.FC<CustomApiModalProps> = ({ isOpen, onClose }) => {
  const [provider, setProvider] = useState<AiProvider>('gemini');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');
  
  useEffect(() => {
    const config = getCustomApiConfig();
    if (config) {
      setProvider(config.provider);
      setApiKey(config.apiKey);
      setModel(config.model || '');
      setAdditionalInstructions(config.additionalInstructions);
      setEnabled(config.enabled);
    }
  }, [isOpen]);

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setTestStatus('error');
      setTestMessage('Insira uma API key');
      return;
    }

    setTestStatus('testing');
    setTestMessage('');

    const result = await testCustomApiConnection(provider, apiKey, model);
    
    if (result.success) {
      setTestStatus('success');
      setTestMessage(result.message);
    } else {
      setTestStatus('error');
      setTestMessage(result.message);
    }
  };

  const handleSave = () => {
    if (!apiKey.trim()) {
      setTestStatus('error');
      setTestMessage('API key é obrigatória');
      return;
    }

    const config: CustomApiConfig = {
      provider,
      apiKey,
      additionalInstructions,
      enabled,
      model
    };

    saveCustomApiConfig(config);
    onClose();
  };

  const handleClear = () => {
    clearCustomApiConfig();
    setProvider('gemini');
    setApiKey('');
    setModel('');
    setAdditionalInstructions('');
    setEnabled(false);
    setTestStatus('idle');
    setTestMessage('');
  };

  if (!isOpen) return null;

  return createPortal(
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          <Title>
            <Cpu size={22} />
            API Personalizada
          </Title>
          <CloseButton onClick={onClose}>
            <X size={18} />
          </CloseButton>
        </Header>

        <Body>
          <Section>
            <WarningBanner>
              <Shield size={20} />
              <WarningText>
                <strong>Sua API key é armazenada apenas localmente</strong> no seu navegador. 
                Ela nunca é enviada para nossos servidores ou salva em banco de dados.
              </WarningText>
            </WarningBanner>
          </Section>

          <Section>
            <ToggleRow>
              <ToggleLabel>
                <ToggleTitle>Usar API Personalizada</ToggleTitle>
                <ToggleDescription>
                  Desativado usa o sistema padrão gratuito
                </ToggleDescription>
              </ToggleLabel>
              <Toggle 
                $active={enabled} 
                onClick={() => setEnabled(!enabled)}
              />
            </ToggleRow>
          </Section>

          <Section>
            <SectionTitle>Provedor de IA</SectionTitle>
            <ProviderSelector>
              {PROVIDERS.map(p => (
                <ProviderOption
                  key={p.id}
                  $selected={provider === p.id}
                  onClick={() => {
                    setProvider(p.id);
                    setTestStatus('idle');
                  }}
                >
                  <ProviderIcon>{p.icon}</ProviderIcon>
                  <ProviderName>{p.name}</ProviderName>
                </ProviderOption>
              ))}
            </ProviderSelector>
          </Section>

          <Section>
            <SectionTitle>API Key</SectionTitle>
            <InputGroup>
              <InputRow>
                <InputWrapper>
                  <Input
                    type="password"
                    placeholder={`Insira sua ${provider === 'openai' ? 'OpenAI' : provider === 'anthropic' ? 'Anthropic' : 'Google AI'} API key`}
                    value={apiKey}
                    onChange={e => {
                      setApiKey(e.target.value);
                      setTestStatus('idle');
                    }}
                  />
                </InputWrapper>
                <TestButton
                  onClick={handleTestConnection}
                  disabled={testStatus === 'testing' || !apiKey.trim()}
                  $success={testStatus === 'success'}
                  $error={testStatus === 'error'}
                >
                  {testStatus === 'testing' ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : testStatus === 'success' ? (
                    <CheckCircle size={14} />
                  ) : testStatus === 'error' ? (
                    <XCircle size={14} />
                  ) : (
                    <Zap size={14} />
                  )}
                  Testar
                </TestButton>
              </InputRow>
              {testMessage && (
                <Label $variant={testStatus === 'success' ? 'success' : 'error'}>
                  {testMessage}
                </Label>
              )}
            </InputGroup>
            
            {provider === 'gemini' && (
              <InputGroup>
                <Label>Modelo (Opcional)</Label>
                <Input
                  type="text"
                  placeholder="Ex: gemini-2.0-flash-exp, gemini-1.5-pro"
                  value={model}
                  onChange={e => {
                    setModel(e.target.value);
                    setTestStatus('idle');
                  }}
                />
                <ModelHelperText>
                   Padrão: gemini-1.5-flash. Se usar "gemini-2.0-flash", digite exatamente o nome do modelo.
                </ModelHelperText>
              </InputGroup>
            )}
          </Section>

          <Section>
            <SectionTitle>Instruções Adicionais (Opcional)</SectionTitle>
            <InputGroup>
              <TextArea
                placeholder="Ex: Foque mais em combos going second, ignore sugestões de hand traps..."
                value={additionalInstructions}
                onChange={e => setAdditionalInstructions(e.target.value)}
                rows={4}
              />
              <Label>
                Essas instruções serão adicionadas ao prompt padrão do sistema.
              </Label>
            </InputGroup>
          </Section>
        </Body>

        <Footer>
          <Button $variant="danger" onClick={handleClear}>
            Limpar
          </Button>
          <Button $variant="primary" onClick={handleSave} disabled={!apiKey.trim()}>
            Salvar
          </Button>
        </Footer>
      </Modal>
    </Overlay>,
    document.body
  );
};
