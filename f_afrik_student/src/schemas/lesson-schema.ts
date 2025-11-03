import { z } from 'zod'

export const createLessonSchema = z.object({
  title: z
    .string()
    .min(1, 'Le titre est requis')
    .max(255, 'Le titre ne peut pas dépasser 255 caractères'),
  content: z
    .string()
    .min(10, 'Le Contenu requiert au moins 10 caractères')
    .max(1000, 'Le Contenu ne doit pas dépasser 1000 caractères'),
  module_id: z.string().uuid('Veuillez sélectionner un module'),
})

export const updateLessonSchema = z.object({
  title: z
    .string()
    .min(1, 'Le titre est requis')
    .max(255, 'Le titre ne peut pas dépasser 255 caractères')
    .optional(),
  content: z
    .string()
    .min(10, 'Le Contenu requiert au moins 10 caractères')
    .max(1000, 'Le Contenu ne doit pas dépasser 1000 caractères')
    .optional(),
  module_id: z.string().uuid('Veuillez sélectionner un module').optional(),
})

export type CreateLessonSchema = z.infer<typeof createLessonSchema>
export type UpdateLessonSchema = z.infer<typeof updateLessonSchema>
