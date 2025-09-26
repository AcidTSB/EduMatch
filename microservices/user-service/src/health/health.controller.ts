import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiResponse({ 
    status: 200, 
    description: 'Service health check' 
  })
  check() {
    return {
      status: 'ok',
      service: 'user-service',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}