import { Request, Response } from 'express';
export declare class ProxyService {
    private services;
    proxy(req: Request, res: Response, serviceName: string, port: number): Promise<void>;
    checkServiceHealth(serviceName: string): Promise<boolean>;
    getServiceStatus(): {
        target: string;
        name: string;
        host: string;
        port: number;
        healthEndpoint?: string;
    }[];
}
