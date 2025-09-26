import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GatewayController } from './gateway.controller';
import { ProxyService } from './services/proxy.service';
import { AuthService } from './services/auth.service';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [GatewayController, HealthController],
  providers: [ProxyService, AuthService],
})
export class AppModule {}