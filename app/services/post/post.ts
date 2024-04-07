import { z } from 'zod'

// structure for a blog post
export const postCreateSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(10, 'Title is too short'),
  body: z
    .string({ required_error: 'Body is required' })
    .min(10, 'Message is too short')
    .max(15, 'Message is too long'),
})

export const postUpdateSchema = postCreateSchema.merge(
  z.object({
    id: z.string(),
  }),
)
