import { useState, useEffect } from 'react';
import { useDebug } from '../../contexts/DebugContext';
import { X, Activity, Server, Globe, DollarSign, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
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
  LoginActions,
  OperationLabel
} from './styles';

interface UsageStats {
  totalCost: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCalls: number;
  byOperation: Record<string, { calls: number; cost: number; tokens: number }>;
  byModel: Record<string, { calls: number; cost: number; tokens: number }>;
}

export const AdminDashboard = ({ onClose }: { onClose: () => void }) => {
    const { systemMetrics, externalMetrics } = useDebug();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
    const [loadingUsage, setLoadingUsage] = useState(false);

    const handleLogin = () => {
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

      if (password === adminPassword) {
          setIsAuthenticated(true);
      } else {
          alert('Senha incorreta');
      }
    };

    useEffect(() => {
      if (isAuthenticated) {
        fetchUsageStats();
      }
    }, [isAuthenticated]);

    const fetchUsageStats = async () => {
      setLoadingUsage(true);
      try {
        const response = await api.get('/admin/usage?period=30');
        setUsageStats(response.data);
      } catch (error) {
        console.error('Failed to fetch usage stats:', error);
      } finally {
        setLoadingUsage(false);
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
                {/* Gemini API Costs */}
                <StatCard $type="cost">
                    <CardTitle><DollarSign size={20} color="#10b981"/> Custos Gemini API (30 dias)</CardTitle>
                    
                    {loadingUsage ? (
                      <MetricRow>
                        <span>Carregando...</span>
                        <Loader2 size={16} className="animate-spin" />
                      </MetricRow>
                    ) : usageStats ? (
                      <>
                        <MetricRow>
                          <span>💰 Custo Total</span>
                          <MetricValue $color="#10b981">${usageStats.totalCost.toFixed(4)}</MetricValue>
                        </MetricRow>
                        
                        <MetricRow>
                          <span>📊 Chamadas Totais</span>
                          <MetricValue>{usageStats.totalCalls}</MetricValue>
                        </MetricRow>
                        
                        <MetricRow>
                          <span>📥 Input Tokens</span>
                          <MetricValue>{(usageStats.totalInputTokens / 1000).toFixed(1)}K</MetricValue>
                        </MetricRow>
                        
                        <MetricRow>
                          <span>📤 Output Tokens</span>
                          <MetricValue>{(usageStats.totalOutputTokens / 1000).toFixed(1)}K</MetricValue>
                        </MetricRow>

                        {usageStats.byOperation && Object.entries(usageStats.byOperation).map(([op, data]) => (
                          <MetricRow key={op}>
                            <OperationLabel>
                              {op}: {data.calls}x
                            </OperationLabel>
                            <MetricValue $color="#94a3b8" $small>
                              ${data.cost.toFixed(4)}
                            </MetricValue>
                          </MetricRow>
                        ))}
                      </>
                    ) : (
                      <MetricRow>
                        <span>Sem dados</span>
                      </MetricRow>
                    )}
                </StatCard>

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
