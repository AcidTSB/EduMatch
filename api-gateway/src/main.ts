import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security middleware
  app.use(helmet());
  app.use(compression());
  
  // CORS configuration
  app.enableCors({
    origin: ['http://localhost:3000', 'https://edumatch.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // API versioning
  app.setGlobalPrefix('api');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('EduMatch API Gateway')
    .setDescription('Gateway for EduMatch Microservices')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Gateway', 'API Gateway endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  
  console.log('🚀 EduMatch API Gateway is running on: http://localhost:3000');
  console.log('📚 API Documentation: http://localhost:3000/api/docs');
}

bootstrap();