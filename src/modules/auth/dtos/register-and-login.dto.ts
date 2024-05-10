import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

export const registerAndLoginSchema = z.object({
  user_email: z.string().email(),
  password: z.string(),
  user_name: z.string(),
});

export type RegisterAndLoginPayload = z.infer<typeof registerAndLoginSchema>;

export class RegisterAndLoginDTO extends createZodDto(registerAndLoginSchema) {
  /**
   *Email of the user.
   *@example levis@gmail.com
   */
  user_email: string;
  /**
   * Password of the user.
   * @example 909090
   */
  password: string;

  /**
   * User Name.
   * @example Gu
   */
  user_name: string;
}
