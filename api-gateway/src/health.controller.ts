import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProxyService } from './services/proxy.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get()
  @ApiOperation({ summary: 'Gateway health check' })
  async getHealth() {
    return {
      status: 'UP',
      timestamp: new Date().toISOString(),
      gateway: 'EduMatch API Gateway',
      version: '1.0.0'
    };
  }

  @Get('services')
  @ApiOperation({ summary: 'Check all microservices health' })
  async getServicesHealth() {
    const services = this.proxyService.getServiceStatus();
    
    const healthChecks = await Promise.all(
      services.map(async (service) => ({
        name: service.name,
        target: service.target,
        healthy: await this.proxyService.checkServiceHealth(service.name),
        timestamp: new Date().toISOString()
      }))
    );

    const overallHealthy = healthChecks.every(check => check.healthy);

    return {
      status: overallHealthy ? 'UP' : 'DEGRADED',
      timestamp: new Date().toISOString(),
      services: healthChecks,
      summary: {
        total: healthChecks.length,
        healthy: healthChecks.filter(s => s.healthy).length,
        unhealthy: healthChecks.filter(s => !s.healthy).length
      }
    };
  }
}