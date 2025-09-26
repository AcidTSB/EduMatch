import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { ProxyService } from '../gateway/proxy.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get()
  @ApiResponse({ 
    status: 200, 
    description: 'API Gateway health check with service status' 
  })
  async check() {
    const services = this.proxyService.getServiceRegistry();
    const serviceHealth = {};

    // Check health of all registered services
    for (const [serviceName, serviceUrl] of Object.entries(services)) {
      serviceHealth[serviceName] = {
        url: serviceUrl,
        healthy: await this.proxyService.checkServiceHealth(serviceName),
      };
    }

    return {
      status: 'ok',
      service: 'api-gateway',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: serviceHealth,
    };
  }

  @Get('services')
  @ApiResponse({ 
    status: 200, 
    description: 'Get all registered services' 
  })
  getServices() {
    return {
      services: this.proxyService.getServiceRegistry(),
      timestamp: new Date().toISOString(),
    };
  }
}