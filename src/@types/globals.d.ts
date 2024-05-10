import { type IPaginationOptions } from 'nestjs-typeorm-paginate';
/* eslint-disable @typescript-eslint/ban-types */
import type { EnvType } from 'src/config/env.config';

declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ProcessEnv extends EnvType {}
  }

  export type NullableValue<T> = T | null;

  export type DecodedTokenType = {
    id: string;
    name: string;
    email: string;
    iat: number;
    exp: number;
  };

  export interface IJwtPayload {
    id: string;
    email: string;
    name: string;
  }

  export type PaginationArgs<T extends Record<string, any> = {}> = T &
    Omit<IPaginationOptions, 'limit' | 'page'> & {
      limit?: string | number;
      page?: string | number;
    };
}
