import type {
  IPaginationOptions,
  IPaginationMeta,
} from 'nestjs-typeorm-paginate';

import type { EnvType } from 'src/config/env.config';
import type { UserTypeEnum } from 'src/modules/user/enum/user-type.enum';
import type { UserAuthProviders } from 'src/modules/user/enum/user-auth-providers.enum';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvType {}
  }

  export type NullableValue<T> = T | null;

  export type Maybe<T> = NullableValue<T> | undefined;

  export interface IJwtPayload {
    id: string;
    email: string;
    name: string;
    user_type: UserTypeEnum;
    user_auth_provider: UserAuthProviders;
  }

  export type DecodedTokenType = IJwtPayload & {
    iat: number;
    exp: number;
  };

  export type PaginationArgs<T extends Record<string, any> = Record> = T &
    Omit<IPaginationOptions<IPaginationMeta>, 'limit' | 'page'> & {
      limit?: string | number;
      page?: string | number;
    };
}
