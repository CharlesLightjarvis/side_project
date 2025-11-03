import { z } from 'zod'

// Zod schema pour CREATE FORMATION
export const createFormationSchema = z.object({
  title: z
    .string()
    .min(3, 'Le titre requiert au moins 3 caractères')
    .max(255, 'Le titre ne doit pas dépasser 255 caractères'),
  description: z
    .string()
    .min(10, 'La description requiert au moins 10 caractères')
    .max(1000, 'La description ne doit pas dépasser 1000 caractères'),
})

// Zod schema pour UPDATE FORMATION (tous les champs optionnels)
export const updateFormationSchema = z.object({
  title: z
    .string()
    .min(3, 'Le titre requiert au moins 3 caractères')
    .max(255, 'Le titre ne doit pas dépasser 255 caractères')
    .optional(),
  description: z
    .string()
    .min(10, 'La description requiert au moins 10 caractères')
    .max(1000, 'La description ne doit pas dépasser 1000 caractères')
    .optional(),
})

// Inférer les types depuis les schémas
export type CreateFormationFormData = z.infer<typeof createFormationSchema>
export type UpdateFormationFormData = z.infer<typeof updateFormationSchema>

// Valeurs par défaut pour le formulaire de création
export const createFormationDefaultValues: CreateFormationFormData = {
  title: '',
  description: '',
}

// Fonction pour obtenir les valeurs par défaut pour la mise à jour
export const getUpdateFormationDefaultValues = (formation: {
  title: string
  description: string
}): UpdateFormationFormData => ({
  title: formation.title,
  description: formation.description,
})
