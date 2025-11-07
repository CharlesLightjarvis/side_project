import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  updateSessionSchema,
  type UpdateSessionSchema,
} from '@/schemas/session-schema'
import { useSessionStore } from '@/stores/session-store'
import { useFormations } from '@/hooks/use-formations'
import { useUsers } from '@/hooks/use-users'
import type { Session } from '@/types/session'

interface UpdateSessionProps {
  session: Session | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateSession({
  session,
  open,
  onOpenChange,
}: UpdateSessionProps) {
  const { updateSession, loading } = useSessionStore()
  const { formations, fetchFormations } = useFormations()
  const { users, fetchUsers } = useUsers()

  // Filter only instructors
  const instructors = users.filter((user) => user.role === 'instructor')

  const form = useForm<UpdateSessionSchema>({
    resolver: zodResolver(updateSessionSchema),
    defaultValues: {
      formation_id: session?.formation.id || '',
      instructor_id: session?.instructor.id ? String(session.instructor.id) : '',
      start_date: session?.start_date
        ? new Date(session.start_date).toISOString().slice(0, 16)
        : '',
      end_date: session?.end_date
        ? new Date(session.end_date).toISOString().slice(0, 16)
        : '',
      max_students: session?.max_students || 25,
      location: session?.location || '',
    },
    mode: 'onChange',
  })

  React.useEffect(() => {
    if (open) {
      fetchFormations()
      fetchUsers()
    }
  }, [open, fetchFormations, fetchUsers])

  React.useEffect(() => {
    if (session) {
      form.reset({
        formation_id: session.formation.id,
        instructor_id: String(session.instructor.id),
        start_date: new Date(session.start_date).toISOString().slice(0, 16),
        end_date: new Date(session.end_date).toISOString().slice(0, 16),
        max_students: session.max_students,
        location: session.location || '',
      })
    }
  }, [session, form])

  const onSubmit = async (data: UpdateSessionSchema) => {
    if (!session) return

    const result = await updateSession(session.id, data)

    if (result.success) {
      toast.success(result.message || 'Session mise à jour avec succès')
      onOpenChange(false)
    } else {
      toast.error(
        result.message || 'Erreur lors de la mise à jour de la session',
      )
    }
  }

  if (!session) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent key={session?.id} className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier la session</DialogTitle>
          <DialogDescription>
            Modifiez les informations de la session. Cliquez sur enregistrer
            quand vous avez terminé.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Controller
              name="formation_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="update-session-formation">
                    Formation
                  </FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loading}
                  >
                    <SelectTrigger id="update-session-formation">
                      <SelectValue placeholder="Sélectionnez une formation" />
                    </SelectTrigger>
                    <SelectContent>
                      {formations.map((formation) => (
                        <SelectItem key={formation.id} value={formation.id}>
                          {formation.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="instructor_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="update-session-instructor">
                    Instructeur
                  </FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loading}
                  >
                    <SelectTrigger id="update-session-instructor">
                      <SelectValue placeholder="Sélectionnez un instructeur" />
                    </SelectTrigger>
                    <SelectContent>
                      {instructors.map((instructor) => (
                        <SelectItem
                          key={instructor.id}
                          value={String(instructor.id)}
                        >
                          {instructor.first_name} {instructor.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="start_date"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="update-session-start-date">
                    Date de Début
                  </FieldLabel>
                  <Input
                    {...field}
                    id="update-session-start-date"
                    type="datetime-local"
                    disabled={loading}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="end_date"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="update-session-end-date">
                    Date de Fin
                  </FieldLabel>
                  <Input
                    {...field}
                    id="update-session-end-date"
                    type="datetime-local"
                    disabled={loading}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="max_students"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="update-session-max-students">
                    Nombre Maximum d'Étudiants
                  </FieldLabel>
                  <Input
                    {...field}
                    id="update-session-max-students"
                    type="number"
                    min="1"
                    max="100"
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10))
                    }
                    disabled={loading}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="location"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="update-session-location">
                    Localisation
                  </FieldLabel>
                  <Input
                    {...field}
                    id="update-session-location"
                    placeholder="Ex: Salle 103"
                    disabled={loading}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
