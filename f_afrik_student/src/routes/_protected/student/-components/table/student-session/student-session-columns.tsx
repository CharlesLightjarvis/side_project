import { type ColumnDef } from '@tanstack/react-table'
import type { StudentSession } from '@/types/session'
import { cn } from '@/lib/utils'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'

const statusColors: Record<string, string> = {
  scheduled: 'text-blue-600 bg-blue-50 border-blue-200',
  in_progress: 'text-green-600 bg-green-50 border-green-200',
  ongoing: 'text-green-600 bg-green-50 border-green-200',
  completed: 'text-gray-600 bg-gray-50 border-gray-200',
  cancelled: 'text-red-600 bg-red-50 border-red-200',
}

export const studentSessionColumns: ColumnDef<StudentSession>[] = [
  {
    id: 'formation',
    accessorFn: (row) => row.formation?.title,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Formation" />
    ),
    cell: ({ row }) => {
      const formation = row.original.formation
      return <div className="font-medium">{formation?.title || '-'}</div>
    },
  },
  {
    id: 'instructor',
    accessorFn: (row) =>
      row.instructor
        ? `${row.instructor.first_name} ${row.instructor.last_name}`
        : '-',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Instructeur" />
    ),
    cell: ({ row }) => {
      const instructor = row.original.instructor
      return (
        <div>
          {instructor
            ? `${instructor.first_name} ${instructor.last_name}`
            : '-'}
        </div>
      )
    },
  },
  {
    accessorKey: 'start_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date de Début" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('start_date'))
      return (
        <div className="text-sm">
          {date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      )
    },
  },
  {
    accessorKey: 'end_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date de Fin" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('end_date'))
      return (
        <div className="text-sm">
          {date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Statut" />
    ),
    cell: ({ row }) => {
      const status = row.original.status
      const statusLabel = row.original.statusLabel || status
      if (!status) return <div className="text-sm">-</div>
      return (
        <div
          className={cn(
            'inline-flex items-center gap-2 rounded-md border px-2.5 py-0.5',
            statusColors[status] || 'text-gray-600 bg-gray-50 border-gray-200',
          )}
        >
          <span className="text-xs font-medium">{statusLabel}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'location',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Localisation" />
    ),
    cell: ({ row }) => {
      const location = row.original.location
      return <div className="text-sm">{location || '-'}</div>
    },
  },
]
