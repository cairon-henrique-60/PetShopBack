import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ZodValidationPipe } from 'nestjs-zod';

import { IKutModule } from './modules/ikut.module';
import { DatabaseModule } from './lib/database/database.module';
import { PaginationModule } from './lib/pagination/pagination.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    IKutModule,
    DatabaseModule,
    PaginationModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
