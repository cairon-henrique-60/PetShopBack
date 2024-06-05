import { z } from 'nestjs-zod/z';

import { createNullableTransform } from 'src/utils/create-nullable-transform.util';

/**
 * -----------------------------------------------------------------------------
 * Default Schemas
 * -----------------------------------------------------------------------------
 */
export const stringSchema = z.string().trim();
export const emailStringSchema = stringSchema.email();
export const urlStringSchema = stringSchema.url();
export const uuidSchema = stringSchema.uuid();
export const orderParamSchema = z.enum(['ASC', 'DESC']);
export const genderStringSchema = z.enum(['M', 'F']);

export const numberSchema = z
  .number()
  .refine((value) => !Number.isNaN(value), { message: 'NaN is not valid' });

export const stringToNumberSchema = stringSchema
  .refine((value) => !Number.isNaN(+value))
  .transform(Number);

export const paginationParamSchema = z
  .union([stringSchema, numberSchema])
  .refine((value) => !Number.isNaN(+value))
  .transform(Number);

export const booleanStringSchema = z
  .enum(['true', 'false'])
  .transform((value) => value === 'true');

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

export const datetimeStringSchema = stringSchema
  .datetime()
  .transform((value) => new Date(value));

export const dateStringSchema = stringSchema
  .date()
  .transform((value) => new Date(value));

export const endDateStringSchema = dateStringSchema.transform((endDate) => {
  endDate.setDate(endDate.getDate() + 1);

  return endDate;
});

/**
 * -----------------------------------------------------------------------------
 * Optional Schemas
 * -----------------------------------------------------------------------------
 */
export const optionalEmailStringSchema =
  createNullableTransform(emailStringSchema);

export const optionalStringSchema = createNullableTransform(stringSchema);

export const optionalStringToNumberSchema =
  createNullableTransform(stringToNumberSchema);

export const optionalPhoneNumberStringSchema = createNullableTransform(
  phoneNumberStringSchema,
);

export const optionalUuidSchema = createNullableTransform(uuidSchema);

export const optionalUrlStringSchema = createNullableTransform(urlStringSchema);

export const optionalNumberSchema = createNullableTransform(numberSchema);

export const optionalPaginationParamSchema = createNullableTransform(
  paginationParamSchema,
);

export const optionalDatetimeStringSchema =
  createNullableTransform(datetimeStringSchema);

export const optionalEndDateStringSchema =
  createNullableTransform(endDateStringSchema);

export const optionalDateStringSchema =
  createNullableTransform(dateStringSchema);

export const optionalBooleanStringSchema =
  createNullableTransform(booleanStringSchema);

export const optionalOrderParamSchema =
  createNullableTransform(orderParamSchema);

export const optionalGenderStringSchema =
  createNullableTransform(genderStringSchema);
