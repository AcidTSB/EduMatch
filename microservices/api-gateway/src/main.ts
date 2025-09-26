import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3001'], // Frontend
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  // API prefix
  app.setGlobalPrefix('api');

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('EduMatch API Gateway')
    .setDescription('Central API Gateway for EduMatch Microservices')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 API Gateway running on port ${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
  console.log(`🔗 Routing to microservices:`);
  console.log(`  - Auth Service: http://localhost:3002`);
  console.log(`  - User Service: http://localhost:3003`);
  console.log(`  - Scholarship Service: http://localhost:3004`);
  console.log(`  - Application Service: http://localhost:3005`);
  console.log(`  - Matching Service: http://localhost:3006`);
  console.log(`  - Notification Service: http://localhost:3007`);
}

bootstrap();