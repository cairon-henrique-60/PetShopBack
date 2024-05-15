import 'dotenv/config';
import { z } from 'nestjs-zod/z';

import {
  stringSchema,
  optionalStringSchema,
  optionalStringToNumberSchema,
  urlStringSchema,
} from 'src/shared/schemas.shared';

export const envSchema = z.object({
  DATABASE_ROOT_PASSWORD: stringSchema,
  DATABASE_DATABASE_NAME: stringSchema,
  DB_PORT: optionalStringToNumberSchema.default('1433'),
  DATABASE_HOST: optionalStringSchema.default('localhost'),
  DB_USER: stringSchema,
  JWT_SECRET: stringSchema,
  JWT_EXPIRES_IN: stringSchema,
  PORT: optionalStringToNumberSchema.default('5000'),
  ENV: z.union([z.literal('dev'), z.literal('prod')]).default('dev'),
  GOOGLE_OAUTH_CLIENT_ID: stringSchema,
  GOOGLE_OAUTH_CLIENT_SECRET: stringSchema,
  GOOGLE_OAUTH_CALLBACK_URL: urlStringSchema,
});

export type EnvType = z.infer<typeof envSchema>;

export const ENV_VARIABLES = envSchema.parse(process.env);
