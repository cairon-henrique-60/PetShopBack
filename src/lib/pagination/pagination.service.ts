import { ZodError } from 'nestjs-zod/z';
import {
  type IPaginationMeta,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Injectable } from '@nestjs/common';
import {
  type ObjectLiteral,
  Repository,
  type FindOptionsWhere,
  type FindManyOptions,
  SelectQueryBuilder,
} from 'typeorm';

import { paginationParamSchema } from 'src/shared/schemas.shared';

import { BadRequestError } from '../http-exceptions/errors/types/bad-request-error';

@Injectable()
export class PaginationService {
  private parseLimitAndPage(limit?: string | number, page?: string | number) {
    try {
      const parsedLimit = paginationParamSchema.default(10).parse(limit);
      const parsedPage = paginationParamSchema.default(1).parse(page);

      return { parsedLimit, parsedPage };
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestError();
      }

      throw new Error(error);
    }
  }

  public async paginate<T extends ObjectLiteral>(
    entityRepository: Repository<T>,
    { limit, page, ...options }: PaginationArgs,
    searchOptions?: FindOptionsWhere<T> | FindManyOptions<T>,
  ): Promise<Pagination<T, IPaginationMeta>> {
    const { parsedLimit, parsedPage } = this.parseLimitAndPage(limit, page);

    return paginate<T>(
      entityRepository,
      {
        ...options,
        limit: parsedLimit,
        page: parsedPage,
      },
      searchOptions,
    );
  }

  public async paginateWithQueryBuilder<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    { limit, page, ...options }: PaginationArgs,
  ): Promise<Pagination<T, IPaginationMeta>> {
    const { parsedLimit, parsedPage } = this.parseLimitAndPage(limit, page);

    return paginate<T>(queryBuilder, {
      ...options,
      limit: parsedLimit,
      page: parsedPage,
    });
  }
}
