import { Controller, All, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ProxyService } from './proxy.service';

@ApiTags('gateway')
@Controller()
export class GatewayController {
  constructor(private readonly proxyService: ProxyService) {}

  // Auth Service Routes
  @All('auth/*')
  @ApiOperation({ summary: 'Proxy to Auth Service' })
  async proxyToAuth(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxyRequest(req, res, 'auth-service', 3002);
  }

  // User Service Routes  
  @All('users/*')
  @ApiOperation({ summary: 'Proxy to User Service' })
  async proxyToUsers(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxyRequest(req, res, 'user-service', 3003);
  }

  @All('profiles/*')
  @ApiOperation({ summary: 'Proxy to User Service for Profiles' })
  async proxyToProfiles(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxyRequest(req, res, 'user-service', 3003);
  }

  // Scholarship Service Routes
  @All('scholarships/*')
  @ApiOperation({ summary: 'Proxy to Scholarship Service' })
  async proxyToScholarships(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxyRequest(req, res, 'scholarship-service', 3004);
  }

  // Application Service Routes
  @All('applications/*')
  @ApiOperation({ summary: 'Proxy to Application Service' })
  async proxyToApplications(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxyRequest(req, res, 'application-service', 3005);
  }

  // Matching Service Routes
  @All('matching/*')
  @ApiOperation({ summary: 'Proxy to Matching Service' })
  async proxyToMatching(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxyRequest(req, res, 'matching-service', 3006);
  }

  // Notification Service Routes
  @All('notifications/*')
  @ApiOperation({ summary: 'Proxy to Notification Service' })
  async proxyToNotifications(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxyRequest(req, res, 'notification-service', 3007);
  }

  // Messages routes (can be handled by notification service)
  @All('messages/*')
  @ApiOperation({ summary: 'Proxy to Notification Service for Messages' })
  async proxyToMessages(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxyRequest(req, res, 'notification-service', 3007);
  }
}