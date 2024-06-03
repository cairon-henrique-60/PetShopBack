import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  optionalOrderParamSchema,
  optionalPaginationParamSchema,
} from 'src/shared/schemas.shared';

import { FriendshipStatus } from '../enums/friendship-status.enum';

export const paginateFriendshipsSchema = z.object({
  status: z.nativeEnum(FriendshipStatus).optional().nullable(),
  order_by_created_at: optionalOrderParamSchema,
  order_by_updated_at: optionalOrderParamSchema,
  page: optionalPaginationParamSchema,
  limit: optionalPaginationParamSchema,
});

export type PaginateFriendshipsPayload = z.infer<
  typeof paginateFriendshipsSchema
>;

export class PaginateFriendshipsDTO extends createZodDto(
  paginateFriendshipsSchema,
) {
  /**
   * Name of the user.
   * @example pending
   */
  @ApiPropertyOptional({
    enum: FriendshipStatus,
    description: 'Status of the friendship',
    example: FriendshipStatus.PENDING,
  })
  status?: FriendshipStatus | null;
}
