import { z } from 'nestjs-zod/z';

import { isNullableValue } from 'src/utils/is-nullable-value.util';

export const stringSchema = z.string().trim();

export const emailStringSchema = stringSchema.email();

export const optionalEmailStringSchema = emailStringSchema
  .optional()
  .nullable()
  .transform((value) => (isNullableValue(value) ? undefined : value));

export const stringToNumberSchema = stringSchema
  .refine((value) => {
    const numberfyedValue = +value;

    return !Number.isNaN(numberfyedValue);
  })
  .transform(Number);

export const optionalStringSchema = stringSchema
  .optional()
  .nullable()
  .transform((value) => (isNullableValue(value) ? undefined : value));

export const optionalStringToNumberSchema = optionalStringSchema
  .refine((value) => {
    if (value) {
      const numberfyedValue = +value;

      return !Number.isNaN(numberfyedValue);
    }

    return true;
  })
  .transform((value) => (value ? Number(value) : undefined));

export const uuidSchema = stringSchema.uuid();

export const optionalUuidSchema = uuidSchema
  .optional()
  .nullable()
  .transform((value) => (isNullableValue(value) ? undefined : value));

export const optionalUrlStringSchema = optionalStringSchema.refine(
  (value) => {
    if (value) {
      const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

      return urlRegex.test(value);
    }

    return true;
  },
  { message: 'Invalid URL' },
);

export const optionalNumberSchema = z
  .number()
  .optional()
  .nullable()
  .refine((value) => {
    if (value) {
      return !Number.isNaN(value);
    }

    return true;
  })
  .transform((value) => (isNullableValue(value) ? undefined : value));

export const paginationParamSchema = z
  .union([z.string(), z.number()])
  .refine((value) => {
    if (value) {
      if (typeof value === 'string') {
        const numberfyedValue = +value;

        return !Number.isNaN(numberfyedValue);
      }

      return true;
    }
    return true;
  })
  .transform(Number);

export const dateStringSchema = stringSchema
  .refine(
    (value) => {
      const dateRegex =
        /(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})/;

      return dateRegex.test(value);
    },
    { message: 'Invalid Date!' },
  )
  .transform((value) => new Date(value));

export const optionalDateStringSchema = dateStringSchema
  .optional()
  .nullable()
  .transform((value) => (isNullableValue(value) ? undefined : value));

export const booleanParamSchema = z
  .union([z.literal('true'), z.literal('false')])
  .optional()
  .transform((value) =>
    !isNullableValue(value) ? value === 'true' : undefined,
  );

export const orderParamSchema = z.union([z.literal('ASC'), z.literal('DESC')]);
