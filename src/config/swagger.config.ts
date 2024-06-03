import { DocumentBuilder } from '@nestjs/swagger';

import type { Params } from 'src/shared/decorators/api-pagination-query.decorator';

export enum OrderByEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export const orderByFields: Params = [
  {
    name: 'order_by_created_at',
    description: 'Order by created date.',
    required: false,
    enum: OrderByEnum,
    example: OrderByEnum.ASC,
  },
  {
    name: 'order_by_updated_at',
    description: 'Order by updated date',
    required: false,
    enum: OrderByEnum,
    example: OrderByEnum.DESC,
  },
];

export const swaggerConfig = new DocumentBuilder()
  .setTitle('ikut-backend')
  .setVersion('0.0.1')
  .addTag('auth')
  .addTag('user')
  .addTag('pet')
  .addTag('pet-species')
  .addTag('pet-breed')
  .addTag('mail')
  .addTag('google')
  .addTag('calendar')
  .addBearerAuth()
  .addSecurityRequirements('bearer')
  .build();
