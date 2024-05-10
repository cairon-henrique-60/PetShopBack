import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import { paginationParamSchema } from 'src/shared/schemas.shared';

export const paginateUsersSchema = z.object({
  page: paginationParamSchema.optional(),
  limit: paginationParamSchema.optional(),
});

export type PaginateUsersPayload = z.infer<typeof paginateUsersSchema>;

export class PaginateUsersDTO extends createZodDto(paginateUsersSchema) {}
