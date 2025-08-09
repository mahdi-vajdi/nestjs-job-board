import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  INestApplication,
  Logger,
  LoggerService,
  ValidationPipe,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  HTTP_CONFIG_TOKEN,
  httpConfig,
  IHttpConfig,
} from './presentation/http/config/http.config';
import { LOGGER_PROVIDER } from '@common/logger/provider/logger.provider';
import { LoggerModule } from '@common/logger/logger.module';
import { WinstonLoggerService } from '@common/logger/winston/winston-logger.service';

async function loadConfig(): Promise<ConfigService> {
  const appContext = await NestFactory.createApplicationContext(
    ConfigModule.forRoot({
      load: [httpConfig],
    }),
  );

  return appContext.get<ConfigService>(ConfigService);
}

async function loadLogger(): Promise<LoggerService> {
  const appContext = await NestFactory.createApplicationContext(LoggerModule);

  return appContext.get<WinstonLoggerService>(LOGGER_PROVIDER);
}

function setUpSwagger(app: INestApplication) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Chatterbox API Gateway')
    .setVersion('1')
    .addBearerAuth({ 'x-tokenName': 'Authorization', type: 'http' }, 'Token')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig, {
    deepScanRoutes: true,
  });

  SwaggerModule.setup('swagger', app, swaggerDocument, {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}

async function bootstrap() {
  const configService = await loadConfig();
  const appLogger = await loadLogger();
  const bootstrapLogger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger: appLogger,
  });

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  setUpSwagger(app);

  await app.init();

  const httpConfig = configService.get<IHttpConfig>(HTTP_CONFIG_TOKEN);
  bootstrapLogger.log(`App is running on port ${httpConfig.port}`);

  await app.listen(httpConfig.port);
}

bootstrap();
