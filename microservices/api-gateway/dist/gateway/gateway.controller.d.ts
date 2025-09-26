import { Request, Response } from 'express';
import { ProxyService } from './proxy.service';
export declare class GatewayController {
    private readonly proxyService;
    constructor(proxyService: ProxyService);
    proxyToAuth(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    proxyToUsers(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    proxyToProfiles(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    proxyToScholarships(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    proxyToApplications(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    proxyToMatching(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    proxyToNotifications(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    proxyToMessages(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
