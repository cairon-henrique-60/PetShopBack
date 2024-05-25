import { z } from 'nestjs-zod/z';

import { isNullableValue } from 'src/utils/is-nullable-value.util';

export const stringSchema = z.string().trim();

export const emailStringSchema = stringSchema.email();

export const urlStringSchema = stringSchema.url();

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

export const phoneNumberStringSchema = stringSchema.refine(
  (data) => {
    const phoneNumberRegex =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

    return phoneNumberRegex.test(data);
  },
  {
    message: 'Invalid phone number format',
  },
);

export const optionalPhoneNumberStringSchema = phoneNumberStringSchema
  .optional()
  .nullable()
  .transform((value) => (isNullableValue(value) ? undefined : value));

export const optionalUuidSchema = uuidSchema
  .optional()
  .nullable()
  .transform((value) => (isNullableValue(value) ? undefined : value));

export const optionalUrlStringSchema = urlStringSchema
  .optional()
  .nullable()
  .transform((value) => (isNullableValue(value) ? undefined : value));

export const numberSchema = z
  .number()
  .refine((value) => !Number.isNaN(value), { message: 'NaN is not valid' });

export const optionalNumberSchema = numberSchema
  .optional()
  .nullable()
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

export const optionalPaginationParamSchema = paginationParamSchema
  .optional()
  .nullable()
  .transform((value) => (isNullableValue(value) ? undefined : value));

export const datetimeStringSchema = stringSchema
  .datetime()
  .transform((value) => new Date(value));

export const optionalDatetimeStringSchema = datetimeStringSchema
  .optional()
  .nullable()
  .transform((value) => (isNullableValue(value) ? undefined : value));

export const dateStringSchema = stringSchema
  .date()
  .transform((value) => new Date(value));

export const endDateStringSchema = dateStringSchema.transform((endDate) => {
  endDate.setDate(endDate.getDate() + 1);

  return endDate;
});

export const optionalEndDateStringSchema = endDateStringSchema
  .optional()
  .nullable()
  .transform((value) => (isNullableValue(value) ? undefined : value));

export const optionalDateStringSchema = dateStringSchema
  .optional()
  .nullable()
  .transform((value) => (isNullableValue(value) ? undefined : value));

export const booleanParamSchema = z
  .union([z.literal('true'), z.literal('false')])
  .optional()
  .nullable()
  .transform((value) =>
    !isNullableValue(value) ? value === 'true' : undefined,
  );

export const orderParamSchema = z.union([z.literal('ASC'), z.literal('DESC')]);

export const optionalOrderParamSchema = orderParamSchema
  .optional()
  .nullable()
  .transform((value) => (isNullableValue(value) ? undefined : value));

export const genderStringSchema = z.enum(['M', 'F']);

export const optionalGenderStringSchema = genderStringSchema
  .optional()
  .nullable()
  .transform((value) => (isNullableValue(value) ? undefined : value));
