// Interface pour la formation
export interface Formation {
  id: string
  title: string
  description: string
  created_at: string
  updated_at: string
}

// Types pour la gestion des formations (CRUD)
export interface CreateFormationData {
  title: string
  description: string
}

export interface UpdateFormationData {
  title?: string
  description?: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  errors?: Record<string, string[]>
}
