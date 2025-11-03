// Interface pour le module
export interface Module {
  id: string
  title: string
  description: string
  formation_id: string
  created_at: string
  updated_at: string
}

// Types pour la gestion des modules (CRUD)
export interface CreateModuleData {
  title: string
  description: string
  formation_id: string
}

export interface UpdateModuleData {
  title?: string
  description?: string
  formation_id?: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  errors?: Record<string, string[]>
}
