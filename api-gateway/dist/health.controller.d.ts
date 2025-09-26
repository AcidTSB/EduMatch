import { ProxyService } from './services/proxy.service';
export declare class HealthController {
    private readonly proxyService;
    constructor(proxyService: ProxyService);
    getHealth(): Promise<{
        status: string;
        timestamp: string;
        gateway: string;
        version: string;
    }>;
    getServicesHealth(): Promise<{
        status: string;
        timestamp: string;
        services: {
            name: string;
            target: string;
            healthy: boolean;
            timestamp: string;
        }[];
        summary: {
            total: number;
            healthy: number;
            unhealthy: number;
        };
    }>;
}
