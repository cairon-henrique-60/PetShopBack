import * as fs from 'fs';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';

import { ENV_VARIABLES } from 'src/config/env.config';
import { swaggerConfig } from 'src/config/swagger.config';

import { AppModule } from './app.module';
import { DataBaseInterceptor } from './lib/http-exceptions/errors/interceptors/dataBase.interceptor';
import { NotFoundInterceptor } from './lib/http-exceptions/errors/interceptors/not-found.interceptor';
import { BadRequestInterceptor } from './lib/http-exceptions/errors/interceptors/bad-request.interceptor';
import { UnauthorizedInterceptor } from './lib/http-exceptions/errors/interceptors/unauthorized.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  try {
    app.enableCors();
    app.enableShutdownHooks();
    app.setGlobalPrefix('server');

    /**
     * -----------------------------------------------------------------------------
     * HTTP Interceptor
     * -----------------------------------------------------------------------------
     */
    app.useGlobalInterceptors(new UnauthorizedInterceptor());
    app.useGlobalInterceptors(new BadRequestInterceptor());
    app.useGlobalInterceptors(new NotFoundInterceptor());
    app.useGlobalInterceptors(new DataBaseInterceptor());

    /**
     * -----------------------------------------------------------------------------
     * Swagger
     * -----------------------------------------------------------------------------
     */
    const document = SwaggerModule.createDocument(app, swaggerConfig);

    /**
     * -----------------------------------------------------------------------------
     * Swagger documents
     * -----------------------------------------------------------------------------
     */
    fs.writeFileSync(
      'swagger-document.json',
      JSON.stringify(document, null, 2),
    );

    SwaggerModule.setup('server', app, document);

    await app.listen(ENV_VARIABLES.PORT);
  } catch (err) {
    Logger.debug(JSON.stringify({ err }, null, 2));
    process.exit();
  }
}
bootstrap();
