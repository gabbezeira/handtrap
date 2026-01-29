import React, { createContext, useContext, useEffect, useState } from 'react';
import { metricsManager, MetricState } from '../services/metrics';

interface DebugContextType {
    systemMetrics: MetricState;
    externalMetrics: MetricState;
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

export const DebugProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [metrics, setMetrics] = useState(metricsManager.getMetrics());

    useEffect(() => {
        const unsubscribe = metricsManager.subscribe(() => {
            // Force re-render with new reference to trigger updates
            setMetrics({ ...metricsManager.getMetrics() });
        });
        return () => { unsubscribe(); };
    }, []);

    return (
        <DebugContext.Provider value={{ 
            systemMetrics: metrics.system,
            externalMetrics: metrics.external 
        }}>
            {children}
        </DebugContext.Provider>
    );
};

export const useDebug = () => {
    const context = useContext(DebugContext);
    if (!context) {
        throw new Error('useDebug must be used within a DebugProvider');
    }
    return context;
};
