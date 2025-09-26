import { ProxyService } from '../gateway/proxy.service';
export declare class HealthController {
    private readonly proxyService;
    constructor(proxyService: ProxyService);
    check(): Promise<{
        status: string;
        service: string;
        timestamp: string;
        uptime: number;
        services: {};
    }>;
    getServices(): {
        services: {
            [k: string]: string;
        };
        timestamp: string;
    };
}
