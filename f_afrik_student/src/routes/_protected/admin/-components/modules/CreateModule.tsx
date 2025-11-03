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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  createModuleSchema,
  createModuleDefaultValues,
  type CreateModuleFormData,
} from '@/schemas/module-schema'
import { useModuleStore } from '@/stores/module-store'
import { useFormations } from '@/hooks/use-formations'

interface CreateModuleProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateModule({ open, onOpenChange }: CreateModuleProps) {
  const { createModule, loading } = useModuleStore()
  const { formations } = useFormations()

  const form = useForm<CreateModuleFormData>({
    resolver: zodResolver(createModuleSchema),
    defaultValues: createModuleDefaultValues,
    mode: 'onChange',
  })

  const onSubmit = async (data: CreateModuleFormData) => {
    const result = await createModule(data)

    if (result.success) {
      toast.success(result.message || 'Module créé avec succès')
      form.reset()
      onOpenChange(false)
    } else {
      if (result.message) {
        toast.error(result.message)
      }
      if (result.errors) {
        Object.entries(result.errors).forEach(([field, messages]) => {
          form.setError(field as keyof CreateModuleFormData, {
            type: 'manual',
            message: messages[0],
          })
        })
      }
    }
  }

  React.useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau module</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer un nouveau module.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="create-module-title">Titre</FieldLabel>
                  <Input
                    {...field}
                    id="create-module-title"
                    placeholder="Entrez le titre du module"
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
                  <FieldLabel htmlFor="create-module-description">
                    Description
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="create-module-description"
                    placeholder="Entrez la description du module"
                    rows={4}
                    disabled={loading}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="formation_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="create-module-formation">Formation</FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loading}
                  >
                    <SelectTrigger id="create-module-formation">
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
