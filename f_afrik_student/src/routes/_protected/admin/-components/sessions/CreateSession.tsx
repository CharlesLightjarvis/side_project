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
  createSessionSchema,
  type CreateSessionSchema,
} from '@/schemas/session-schema'
import { useSessionStore } from '@/stores/session-store'
import { useFormations } from '@/hooks/use-formations'
import { useUsers } from '@/hooks/use-users'

interface CreateSessionProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateSession({ open, onOpenChange }: CreateSessionProps) {
  const { createSession, loading } = useSessionStore()
  const { formations, fetchFormations } = useFormations()
  const { users, fetchUsers } = useUsers()

  // Filter only instructors
  const instructors = users.filter((user) => user.role === 'instructor')

  const form = useForm<CreateSessionSchema>({
    resolver: zodResolver(createSessionSchema),
    defaultValues: {
      formation_id: '',
      instructor_id: '',
      start_date: '',
      end_date: '',
      max_students: 25,
      location: '',
    },
    mode: 'onChange',
  })

  React.useEffect(() => {
    if (open) {
      fetchFormations()
      fetchUsers()
    }
  }, [open, fetchFormations, fetchUsers])

  const onSubmit = async (data: CreateSessionSchema) => {
    const result = await createSession(data)

    if (result.success) {
      toast.success(result.message || 'Session créée avec succès')
      form.reset()
      onOpenChange(false)
    } else {
      toast.error(result.message || 'Erreur lors de la création de la session')
    }
  }

  React.useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle session</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer une nouvelle session de
            formation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Controller
              name="formation_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="create-session-formation">
                    Formation
                  </FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loading}
                  >
                    <SelectTrigger id="create-session-formation">
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
                  <FieldLabel htmlFor="create-session-instructor">
                    Instructeur
                  </FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loading}
                  >
                    <SelectTrigger id="create-session-instructor">
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
                  <FieldLabel htmlFor="create-session-start-date">
                    Date de Début
                  </FieldLabel>
                  <Input
                    {...field}
                    id="create-session-start-date"
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
                  <FieldLabel htmlFor="create-session-end-date">
                    Date de Fin
                  </FieldLabel>
                  <Input
                    {...field}
                    id="create-session-end-date"
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
                  <FieldLabel htmlFor="create-session-max-students">
                    Nombre Maximum d'Étudiants
                  </FieldLabel>
                  <Input
                    {...field}
                    id="create-session-max-students"
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
                  <FieldLabel htmlFor="create-session-location">
                    Localisation
                  </FieldLabel>
                  <Input
                    {...field}
                    id="create-session-location"
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
              {loading ? 'Création...' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
