import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import { stringSchema } from 'src/shared/schemas.shared';

export const createActivityTypeSchema = z.object({
  activity_name: stringSchema,
  activity_description: stringSchema,
});

export type CreateActivityTypePayload = z.infer<
  typeof createActivityTypeSchema
>;

export class CreateActivityTypeDTO extends createZodDto(
  createActivityTypeSchema,
) {
  /**
   * activity_name.
   * @example Feriado
   */
  activity_name: string;
  /**
   * activity_description
   * @example Sei la
   */
  activity_description: string;
}
