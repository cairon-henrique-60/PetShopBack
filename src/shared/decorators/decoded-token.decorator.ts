import { ExecutionContext, createParamDecorator } from '@nestjs/common';

/**
 * Get the decoded token from the http context.
 */
export const DecodedToken = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const decoded_token = context.switchToHttp().getRequest().decoded_token;

    return decoded_token;
  },
);
