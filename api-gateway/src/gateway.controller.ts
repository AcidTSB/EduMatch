import { Controller, All, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ProxyService } from './services/proxy.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Gateway')
@Controller()
export class GatewayController {
  constructor(private readonly proxyService: ProxyService) {}

  @All('/v1/auth/*')
  @ApiOperation({ summary: 'Proxy to Auth Service' })
  async proxyAuth(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxy(req, res, 'auth-service', 3001);
  }

  @All('/v1/users/*')
  @ApiOperation({ summary: 'Proxy to User Service' })
  async proxyUsers(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxy(req, res, 'user-service', 3002);
  }

  @All('/v1/profiles/*')
  @ApiOperation({ summary: 'Proxy to Profile Service' })
  async proxyProfiles(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxy(req, res, 'profile-service', 3002);
  }

  @All('/v1/scholarships/*')
  @ApiOperation({ summary: 'Proxy to Scholarship Service' })
  async proxyScholarships(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxy(req, res, 'scholarship-service', 3003);
  }

  @All('/v1/applications/*')
  @ApiOperation({ summary: 'Proxy to Application Service' })
  async proxyApplications(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxy(req, res, 'application-service', 3004);
  }

  @All('/v1/matching/*')
  @ApiOperation({ summary: 'Proxy to AI Matching Service' })
  async proxyMatching(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxy(req, res, 'matching-service', 5000);
  }

  @All('/v1/notifications/*')
  @ApiOperation({ summary: 'Proxy to Notification Service' })
  async proxyNotifications(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxy(req, res, 'notification-service', 3006);
  }

  @All('/v1/messages/*')
  @ApiOperation({ summary: 'Proxy to Message Service' })
  async proxyMessages(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxy(req, res, 'message-service', 3007);
  }

  @All('/v1/admin/*')
  @ApiOperation({ summary: 'Proxy to Admin Service' })
  async proxyAdmin(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxy(req, res, 'admin-service', 3008);
  }
}