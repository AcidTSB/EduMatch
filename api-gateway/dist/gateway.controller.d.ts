import { Request, Response } from 'express';
import { ProxyService } from './services/proxy.service';
export declare class GatewayController {
    private readonly proxyService;
    constructor(proxyService: ProxyService);
    proxyAuth(req: Request, res: Response): Promise<void>;
    proxyUsers(req: Request, res: Response): Promise<void>;
    proxyProfiles(req: Request, res: Response): Promise<void>;
    proxyScholarships(req: Request, res: Response): Promise<void>;
    proxyApplications(req: Request, res: Response): Promise<void>;
    proxyMatching(req: Request, res: Response): Promise<void>;
    proxyNotifications(req: Request, res: Response): Promise<void>;
    proxyMessages(req: Request, res: Response): Promise<void>;
    proxyAdmin(req: Request, res: Response): Promise<void>;
}
