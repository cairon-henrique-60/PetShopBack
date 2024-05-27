import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ZodValidationPipe } from 'nestjs-zod';

import { IKutModule } from './modules/ikut.module';
import { AppDataSource } from './lib/database/database.providers';
import { PaginationModule } from './lib/pagination/pagination.module';

@Module({
  imports: [ConfigModule.forRoot(), IKutModule, PaginationModule],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {
  constructor() {
    this.initializeAppDataSource();
  }

  async initializeAppDataSource() {
    try {
      await AppDataSource.initialize();
    } catch (err) {
      throw err;
    }
  }
}
