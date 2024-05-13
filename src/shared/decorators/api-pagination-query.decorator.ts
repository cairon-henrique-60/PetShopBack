import { ApiQuery, type ApiQueryOptions } from '@nestjs/swagger';

export type Params = ApiQueryOptions[];

export function ApiPaginationQuery(params?: Params): MethodDecorator {
  return (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    ApiQuery({
      type: 'number',
      description:
        'The limit of items. If not passed the default limit will be 10',
      required: false,
      name: 'limit',
    })(target, key, descriptor);

    ApiQuery({
      type: 'number',
      description: 'The Current Page. If not passed the default page will be 1',
      required: false,
      name: 'page',
    })(target, key, descriptor);

    if (!params || !params.length) return;

    for (const param of params) {
      ApiQuery(param)(target, key, descriptor);
    }
  };
}
