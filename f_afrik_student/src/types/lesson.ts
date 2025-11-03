export interface Lesson {
  id: string
  title: string
  content: string
  module_id: string
  created_at: string
  updated_at: string
}

export interface LessonFromBackend {
  id: string
  title: string
  content: string
  module_id: string
  created_at: string
  updated_at: string
}

export interface CreateLessonData {
  title: string
  content: string
  module_id: string
}

export interface UpdateLessonData {
  title?: string
  content?: string
  module_id?: string
}
