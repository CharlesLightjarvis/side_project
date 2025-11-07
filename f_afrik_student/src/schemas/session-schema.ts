import { z } from 'zod'

export const createSessionSchema = z
  .object({
    formation_id: z
      .string()
      .min(1, 'Veuillez sélectionner une formation')
      .uuid('Veuillez sélectionner une formation valide'),
    instructor_id: z
      .string()
      .min(1, 'Veuillez sélectionner un instructeur')
      .uuid('Veuillez sélectionner un instructeur valide'),
    start_date: z.string().min(1, 'La date de début est requise'),
    end_date: z.string().min(1, 'La date de fin est requise'),
    max_students: z
      .number()
      .int('Le nombre maximum doit être un entier')
      .min(1, 'Le nombre minimum est 1')
      .max(100, 'Le nombre maximum est 100')
      .optional(),
    location: z.string().max(255, 'La localisation ne peut pas dépasser 255 caractères').optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.start_date)
      const end = new Date(data.end_date)
      return end > start
    },
    {
      message: 'La date de fin doit être après la date de début',
      path: ['end_date'],
    }
  )

export const updateSessionSchema = z
  .object({
    formation_id: z
      .string()
      .min(1, 'Veuillez sélectionner une formation')
      .uuid('Veuillez sélectionner une formation valide')
      .optional()
      .or(z.literal('')),
    instructor_id: z
      .string()
      .min(1, 'Veuillez sélectionner un instructeur')
      .uuid('Veuillez sélectionner un instructeur valide')
      .optional()
      .or(z.literal('')),
    start_date: z.string().min(1, 'La date de début est requise').optional(),
    end_date: z.string().min(1, 'La date de fin est requise').optional(),
    max_students: z
      .number()
      .int('Le nombre maximum doit être un entier')
      .min(1, 'Le nombre minimum est 1')
      .max(100, 'Le nombre maximum est 100')
      .optional(),
    location: z.string().max(255, 'La localisation ne peut pas dépasser 255 caractères').optional(),
  })
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        const start = new Date(data.start_date)
        const end = new Date(data.end_date)
        return end > start
      }
      return true
    },
    {
      message: 'La date de fin doit être après la date de début',
      path: ['end_date'],
    }
  )

export type CreateSessionSchema = z.infer<typeof createSessionSchema>
export type UpdateSessionSchema = z.infer<typeof updateSessionSchema>
