type ApiType = 'system' | 'external';

export interface MetricState {
    requests: number;
    successes: number;
    errors: number;
    totalLatency: number;
}

type Listener = () => void;

class MetricsManager {
    private static instance: MetricsManager;
    
    private metrics: Record<ApiType, MetricState> = {
        system: { requests: 0, successes: 0, errors: 0, totalLatency: 0 },
        external: { requests: 0, successes: 0, errors: 0, totalLatency: 0 }
    };

    private listeners: Set<Listener> = new Set();
    private requestStartTimes: Map<string, number> = new Map();

    private constructor() {}

    public static getInstance(): MetricsManager {
        if (!MetricsManager.instance) {
            MetricsManager.instance = new MetricsManager();
        }
        return MetricsManager.instance;
    }

    public getMetrics() {
        return this.metrics;
    }

    public subscribe(listener: Listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notify() {
        this.listeners.forEach(l => l());
    }

    public startRequest(requestId: string) {
        this.requestStartTimes.set(requestId, performance.now());
    }

    public endRequest(requestId: string, type: ApiType, isError: boolean) {
        const startTime = this.requestStartTimes.get(requestId);
        let duration = 0;
        
        if (startTime) {
            duration = performance.now() - startTime;
            this.requestStartTimes.delete(requestId);
        }

        const target = this.metrics[type];
        target.requests++;
        target.totalLatency += duration;

        if (isError) {
            target.errors++;
        } else {
            target.successes++;
        }

        this.notify();
    }
}

export const metricsManager = MetricsManager.getInstance();
