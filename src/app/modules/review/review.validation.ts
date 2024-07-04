import { z } from 'zod';

const CreateReviewValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'name is required',
    }),

    rating: z.number({
      required_error: 'rating is required',
    }),
    productId: z.string({
      required_error: 'productId is required',
    }),
    isDeleted: z.boolean({
      required_error: 'isDeleted is required',
    }).optional(),

    description: z.string({
      required_error: 'description is required',
    }),
  }),
});

export const reviewValidations = {
  CreateReviewValidationSchema,
};
