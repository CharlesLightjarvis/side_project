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

// ============================================
// TYPES POUR INSTRUCTEUR (ses propres sessions)
// ============================================

// Interface pour une session vue par l'instructeur (sans instructor)
export interface InstructorSession {
  id: string
  formation: {
    id: string
    title: string
    description: string
    created_at: string
    updated_at: string
  }
  formation_id: string
  instructor_id: string
  start_date: string
  end_date: string
  status: SessionStatus
  statusLabel?: string
  max_students: number
  enrolled_count?: number
  available_spots?: number
  is_full?: boolean
  location: string | null
  created_at: string
  updated_at: string
}

// Interface pour la session instructeur venant du backend
export interface InstructorSessionFromBackend {
  id: string
  formation: {
    id: string
    title: string
    description: string
    created_at: string
    updated_at: string
  }
  formation_id: string
  instructor_id: string
  start_date: string
  end_date: string
  status: string | StatusObject // Peut être string ou objet selon le backend
  max_students: number
  enrolled_count?: number
  location: string | null
  created_at: string
  updated_at: string
}

// Helper pour transformer InstructorSessionFromBackend en InstructorSession
export function transformInstructorSession(
  sessionFromBackend: InstructorSessionFromBackend,
): InstructorSession {
  // Gérer le status qui peut être string ou objet {value, label}
  const status =
    typeof sessionFromBackend.status === 'string'
      ? sessionFromBackend.status
      : sessionFromBackend.status.value

  const statusLabel =
    typeof sessionFromBackend.status === 'string'
      ? sessionFromBackend.status
      : sessionFromBackend.status.label

  return {
    id: sessionFromBackend.id,
    formation: sessionFromBackend.formation,
    formation_id: sessionFromBackend.formation_id,
    instructor_id: sessionFromBackend.instructor_id,
    start_date: sessionFromBackend.start_date,
    end_date: sessionFromBackend.end_date,
    status: status as SessionStatus,
    statusLabel: statusLabel,
    max_students: sessionFromBackend.max_students,
    enrolled_count: sessionFromBackend.enrolled_count,
    location: sessionFromBackend.location,
    created_at: sessionFromBackend.created_at,
    updated_at: sessionFromBackend.updated_at,
  }
}

// ============================================
// TYPES POUR ÉTUDIANT (ses sessions inscrites)
// ============================================

// Interface pour une session vue par l'étudiant
export interface StudentSession {
  id: string
  formation: {
    id: string
    title: string
    description: string
    created_at: string
    updated_at: string
  }
  instructor: {
    id: string
    first_name: string
    last_name: string
    email: string
    role: string
    created_at: string
    updated_at: string
  }
  start_date: string
  end_date: string
  status: SessionStatus
  statusLabel?: string
  max_students: number
  location: string | null
  created_at: string
  updated_at: string
}

// Interface pour la session étudiant venant du backend
export interface StudentSessionFromBackend {
  id: string
  formation: {
    id: string
    title: string
    description: string
    duration: string
    price: number
    created_at: string
    updated_at: string
  }
  instructor: {
    id: string
    first_name: string
    last_name: string
    email: string
    role: string
    created_at: string
    updated_at: string
  }
  start_date: string
  end_date: string
  status: StatusObject
  max_students: number
  location: string | null
  created_at: string
  updated_at: string
}

// Helper pour transformer StudentSessionFromBackend en StudentSession
export function transformStudentSession(
  sessionFromBackend: StudentSessionFromBackend,
): StudentSession {
  // Gérer le status qui peut être string ou objet {value, label}
  const status =
    typeof sessionFromBackend.status === 'string'
      ? sessionFromBackend.status
      : sessionFromBackend.status.value

  const statusLabel =
    typeof sessionFromBackend.status === 'string'
      ? sessionFromBackend.status
      : sessionFromBackend.status.label

  return {
    id: sessionFromBackend.id,
    formation: sessionFromBackend.formation,
    instructor: sessionFromBackend.instructor,
    start_date: sessionFromBackend.start_date,
    end_date: sessionFromBackend.end_date,
    status: status as SessionStatus,
    statusLabel: statusLabel,
    max_students: sessionFromBackend.max_students,
    location: sessionFromBackend.location,
    created_at: sessionFromBackend.created_at,
    updated_at: sessionFromBackend.updated_at,
  }
}
