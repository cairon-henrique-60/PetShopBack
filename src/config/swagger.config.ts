import { DocumentBuilder } from '@nestjs/swagger';

import type { Params } from 'src/shared/decorators/api-pagination-query.decorator';

export const orderByFields: Params = [
  {
    name: 'order_by_created_at',
    description: 'Order by created date.',
    required: false,
    type: String,
  },
  {
    name: 'order_by_updated_at',
    description: 'Order by updated date',
    required: false,
    type: String,
  },
];

export const swaggerConfig = new DocumentBuilder()
  .setTitle('ikut-backend')
  .setVersion('0.0.1')
  .addTag('auth')
  .addTag('user')
  .addTag('pet')
  .addTag('pet-species')
  .addBearerAuth()
  .addSecurityRequirements('bearer')
  .build();
