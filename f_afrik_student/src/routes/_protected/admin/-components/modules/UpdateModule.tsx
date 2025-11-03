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
  updateModuleSchema,
  getUpdateModuleDefaultValues,
  type UpdateModuleFormData,
} from '@/schemas/module-schema'
import { useModuleStore } from '@/stores/module-store'
import { useFormations } from '@/hooks/use-formations'
import type { Module } from '@/types/module'

interface UpdateModuleProps {
  module: Module | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateModule({ module, open, onOpenChange }: UpdateModuleProps) {
  const { updateModule, loading } = useModuleStore()
  const { formations } = useFormations()

  const form = useForm<UpdateModuleFormData>({
    resolver: zodResolver(updateModuleSchema),
    mode: 'onChange',
  })

  React.useEffect(() => {
    if (module) {
      const defaultValues = getUpdateModuleDefaultValues({
        title: module.title,
        description: module.description,
        formation_id: module.formation_id,
      })
      form.reset(defaultValues)
    }
  }, [module, form])

  const onSubmit = async (data: UpdateModuleFormData) => {
    if (!module) return

    const result = await updateModule(module.id, data)

    if (result.success) {
      toast.success(result.message || 'Module mis à jour avec succès')
      onOpenChange(false)
    } else {
      if (result.message) {
        toast.error(result.message)
      }
      if (result.errors) {
        Object.entries(result.errors).forEach(([field, messages]) => {
          form.setError(field as keyof UpdateModuleFormData, {
            type: 'manual',
            message: messages[0],
          })
        })
      }
    }
  }

  if (!module) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier le module</DialogTitle>
          <DialogDescription>
            Modifiez les informations du module "{module.title}".
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="update-module-title">Titre</FieldLabel>
                  <Input
                    {...field}
                    id="update-module-title"
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
                  <FieldLabel htmlFor="update-module-description">
                    Description
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="update-module-description"
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
                  <FieldLabel htmlFor="update-module-formation">Formation</FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loading}
                  >
                    <SelectTrigger id="update-module-formation">
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
              {loading ? 'Mise à jour...' : 'Mettre à jour'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
