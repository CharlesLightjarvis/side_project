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
  createFormationSchema,
  createFormationDefaultValues,
  type CreateFormationFormData,
} from '@/schemas/formation-schema'
import { useFormationStore } from '@/stores/formation-store'

interface CreateFormationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateFormation({ open, onOpenChange }: CreateFormationProps) {
  const { createFormation, loading } = useFormationStore()

  // Initialize form with Zod schema validation
  const form = useForm<CreateFormationFormData>({
    resolver: zodResolver(createFormationSchema),
    defaultValues: createFormationDefaultValues,
    mode: 'onChange',
  })

  // Handle form submission
  const onSubmit = async (data: CreateFormationFormData) => {
    const result = await createFormation(data)

    if (result.success) {
      toast.success(result.message || 'Formation créée avec succès')
      form.reset()
      onOpenChange(false)
    } else {
      if (result.message) {
        toast.error(result.message)
      }
      // Set field-level errors from API
      if (result.errors) {
        Object.entries(result.errors).forEach(([field, messages]) => {
          form.setError(field as keyof CreateFormationFormData, {
            type: 'manual',
            message: messages[0],
          })
        })
      }
    }
  }

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle formation</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer une nouvelle formation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="create-formation-title">Titre</FieldLabel>
                  <Input
                    {...field}
                    id="create-formation-title"
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
                  <FieldLabel htmlFor="create-formation-description">
                    Description
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="create-formation-description"
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
              {loading ? 'Création...' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
