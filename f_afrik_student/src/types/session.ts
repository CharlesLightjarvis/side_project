// Interface pour l'instructeur dans une session (version frontend)
export interface SessionInstructor {
  id: string
  first_name: string
  last_name: string
  email: string
  role: string | null
  roleLabel?: string
  permissions: string[]
  created_at: string
  updated_at: string
}

// Interface pour le status (version frontend)
export type SessionStatus =
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled'

// Interface pour l'instructeur venant du backend
export interface SessionInstructorFromBackend {
  id: string
  first_name: string
  last_name: string
  email: string
  role: {
    value: string
    label: string
  }
  permissions: string[]
  created_at: string
  updated_at: string
}

// Interface pour le status venant du backend
export interface StatusObject {
  value: string
  label: string
}

export interface Session {
  id: string
  formation: {
    id: string
    title: string
    description: string
    created_at: string
    updated_at: string
  }
  instructor: SessionInstructor
  start_date: string
  end_date: string
  status: SessionStatus
  statusLabel?: string
  max_students: number
  enrolled_count: number
  available_spots: number
  is_full: boolean
  location: string | null
  created_at: string
  updated_at: string
}

export interface SessionFromBackend {
  id: string
  formation: {
    id: string
    title: string
    description: string
    created_at: string
    updated_at: string
  }
  instructor: SessionInstructorFromBackend
  start_date: string
  end_date: string
  status: StatusObject
  max_students: number
  enrolled_count: number
  available_spots: number
  is_full: boolean
  location: string | null
  created_at: string
  updated_at: string
}

// Helper pour transformer SessionFromBackend en Session
export function transformSession(
  sessionFromBackend: SessionFromBackend,
): Session {
  return {
    id: sessionFromBackend.id,
    formation: sessionFromBackend.formation,
    instructor: {
      id: sessionFromBackend.instructor.id,
      first_name: sessionFromBackend.instructor.first_name,
      last_name: sessionFromBackend.instructor.last_name,
      email: sessionFromBackend.instructor.email,
      role: sessionFromBackend.instructor.role?.value || null,
      roleLabel: sessionFromBackend.instructor.role?.label,
      permissions: sessionFromBackend.instructor.permissions,
      created_at: sessionFromBackend.instructor.created_at,
      updated_at: sessionFromBackend.instructor.updated_at,
    },
    start_date: sessionFromBackend.start_date,
    end_date: sessionFromBackend.end_date,
    status: sessionFromBackend.status.value as SessionStatus,
    statusLabel: sessionFromBackend.status.label,
    max_students: sessionFromBackend.max_students,
    enrolled_count: sessionFromBackend.enrolled_count,
    available_spots: sessionFromBackend.available_spots,
    is_full: sessionFromBackend.is_full,
    location: sessionFromBackend.location,
    created_at: sessionFromBackend.created_at,
    updated_at: sessionFromBackend.updated_at,
  }
}

export interface CreateSessionData {
  formation_id: string
  instructor_id: string
  start_date: string
  end_date: string
  max_students?: number
  location?: string
}

export interface UpdateSessionData {
  formation_id?: string
  instructor_id?: string
  start_date?: string
  end_date?: string
  max_students?: number
  location?: string
}
