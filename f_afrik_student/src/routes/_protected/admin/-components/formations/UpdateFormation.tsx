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
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  updateFormationSchema,
  getUpdateFormationDefaultValues,
  type UpdateFormationFormData,
} from '@/schemas/formation-schema'
import { useFormationStore } from '@/stores/formation-store'
import type { Formation } from '@/types/formation'

interface UpdateFormationProps {
  formation: Formation | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateFormation({
  formation,
  open,
  onOpenChange,
}: UpdateFormationProps) {
  const { updateFormation, loading } = useFormationStore()

  // Initialize form with Zod schema validation
  const form = useForm<UpdateFormationFormData>({
    resolver: zodResolver(updateFormationSchema),
    mode: 'onChange',
  })

  // Update form values when formation changes
  React.useEffect(() => {
    if (formation) {
      const defaultValues = getUpdateFormationDefaultValues({
        title: formation.title,
        description: formation.description,
      })
      form.reset(defaultValues)
    }
  }, [formation, form])

  // Handle form submission
  const onSubmit = async (data: UpdateFormationFormData) => {
    if (!formation) return

    const result = await updateFormation(formation.id, data)

    if (result.success) {
      toast.success(result.message || 'Formation mise à jour avec succès')
      onOpenChange(false)
    } else {
      if (result.message) {
        toast.error(result.message)
      }
      // Set field-level errors from API
      if (result.errors) {
        Object.entries(result.errors).forEach(([field, messages]) => {
          form.setError(field as keyof UpdateFormationFormData, {
            type: 'manual',
            message: messages[0],
          })
        })
      }
    }
  }

  if (!formation) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier la formation</DialogTitle>
          <DialogDescription>
            Modifiez les informations de la formation "{formation.title}".
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="update-formation-title">Titre</FieldLabel>
                  <Input
                    {...field}
                    id="update-formation-title"
                    placeholder="Entrez le titre de la formation"
                    disabled={loading}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="update-formation-description">
                    Description
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="update-formation-description"
                    placeholder="Entrez la description de la formation"
                    rows={6}
                    disabled={loading}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
              {loading ? 'Mise à jour...' : 'Mettre à jour'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
