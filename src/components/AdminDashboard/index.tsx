import { useState } from 'react';
import { useDebug } from '../../contexts/DebugContext';
import { X, Activity, Server, Globe } from 'lucide-react';
import {
  DashboardContainer,
  Header,
  Title,
  CloseButton,
  StatsGrid,
  StatCard,
  CardTitle,
  MetricRow,
  MetricValue,
  LoginOverlay,
  LoginTitle,
  PasswordInput,
  ActionButton,
  LoginActions
} from './styles';

export const AdminDashboard = ({ onClose }: { onClose: () => void }) => {
    const { systemMetrics, externalMetrics } = useDebug();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');

    const handleLogin = () => {
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

      if (password === adminPassword) {
          setIsAuthenticated(true);
      } else {
          alert('Senha incorreta');
      }
    };

    if (!isAuthenticated) {
        return (
            <DashboardContainer>
                 <Header>
                    <Title><Activity size={24} /> Admin Access</Title>
                    <CloseButton onClick={onClose}><X size={20} /></CloseButton>
                </Header>
                <LoginOverlay>
                    <LoginTitle>Painel Administrativo</LoginTitle>
                    <PasswordInput 
                        type="password" 
                        placeholder="Digite a senha de acesso"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                        autoFocus
                    />
                    <LoginActions>
                      <ActionButton $variant="primary" onClick={handleLogin}>
                          Acessar Painel
                      </ActionButton>
                      <ActionButton $variant="secondary" onClick={onClose}>
                          Cancelar
                      </ActionButton>
                    </LoginActions>
                </LoginOverlay>
            </DashboardContainer>
        );
    }

    return (
        <DashboardContainer>
            <Header>
                <Title><Activity size={24} /> Monitoramento de API</Title>
                <CloseButton onClick={onClose}><X size={20} /></CloseButton>
            </Header>

            <StatsGrid>
                <StatCard $type="system">
                    <CardTitle><Server size={20} color="#3b82f6"/> Backend (System)</CardTitle>
                    
                    <MetricRow>
                      <span>Requests Totais</span>
                      <MetricValue>{systemMetrics.requests}</MetricValue>
                    </MetricRow>
                    
                    <MetricRow>
                      <span>Sucessos</span>
                      <MetricValue $color="#4ade80">{systemMetrics.successes}</MetricValue>
                    </MetricRow>
                    
                    <MetricRow>
                      <span>Erros</span>
                      <MetricValue $color="#f87171">{systemMetrics.errors}</MetricValue>
                    </MetricRow>
                    
                    <MetricRow>
                      <span>Latência Média</span>
                      <MetricValue>
                        {systemMetrics.requests ? Math.round(systemMetrics.totalLatency / systemMetrics.requests) : 0}ms
                      </MetricValue>
                    </MetricRow>
                </StatCard>

                <StatCard $type="external">
                    <CardTitle><Globe size={20} color="#ec4899"/> Yu-Gi-Oh API (External)</CardTitle>
                    
                    <MetricRow>
                      <span>Requests Totais</span>
                      <MetricValue>{externalMetrics.requests}</MetricValue>
                    </MetricRow>
                    
                    <MetricRow>
                      <span>Sucessos</span>
                      <MetricValue $color="#4ade80">{externalMetrics.successes}</MetricValue>
                    </MetricRow>
                    
                    <MetricRow>
                      <span>Erros</span>
                      <MetricValue $color="#f87171">{externalMetrics.errors}</MetricValue>
                    </MetricRow>
                    
                    <MetricRow>
                      <span>Latência Média</span>
                      <MetricValue>
                         {externalMetrics.requests ? Math.round(externalMetrics.totalLatency / externalMetrics.requests) : 0}ms
                      </MetricValue>
                    </MetricRow>
                </StatCard>
            </StatsGrid>
        </DashboardContainer>
    );
};

