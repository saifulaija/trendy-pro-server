import { z } from 'zod';

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'user name must be string',
    }),
    email: z.string({
      invalid_type_error: 'email must be string',
    }),
    pasword: z
      .string({
        invalid_type_error: 'Password must be string',
      })
      .max(20, { message: 'Password can not be more than 20 characters' }),

    role: z.string().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const UserValidation = {
  createUserValidationSchema,
};
