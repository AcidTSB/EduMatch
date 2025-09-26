import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GatewayController } from './gateway/gateway.controller';
import { ProxyService } from './gateway/proxy.service';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [GatewayController, HealthController],
  providers: [ProxyService],
})
export class AppModule {}