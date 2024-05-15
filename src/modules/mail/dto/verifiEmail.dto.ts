import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import { stringSchema } from 'src/shared/schemas.shared';

export const verifiEmailSchema = z.object({
  user_email: stringSchema,
  notification: stringSchema,
  code_verification: stringSchema,
});

export type VerifiEmailPayload = z.infer<typeof verifiEmailSchema>;

export class VerifyEmailDTO extends createZodDto(verifiEmailSchema) {
  /**
   *Email of the user.
   *@example pauloSalvatore@gmail.com
   */
  user_email: string;
  /**
   *Email of the user.
   *@example pauloSalvatore@gmail.com
   */
  notification: string;
  /**
   * Code verify email.
   * @example a2B5ac
   */
  code_verification: string;
}
