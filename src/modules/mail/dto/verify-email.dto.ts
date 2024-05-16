import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import { stringSchema } from 'src/shared/schemas.shared';

export const verifyEmailSchema = z.object({
  user_email: stringSchema,
  notification: stringSchema,
  verfication_code: stringSchema,
});

export type VerifyEmailPayload = z.infer<typeof verifyEmailSchema>;

export class VerifyEmailDTO extends createZodDto(verifyEmailSchema) {
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
  verfication_code: string;
}
