import { Request, Response } from 'express';
export declare class ProxyService {
    private readonly serviceRegistry;
    constructor();
    proxyRequest(req: Request, res: Response, serviceName: string, port: number): Promise<Response<any, Record<string, any>>>;
    checkServiceHealth(serviceName: string): Promise<boolean>;
    getServiceRegistry(): {
        [k: string]: string;
    };
}
