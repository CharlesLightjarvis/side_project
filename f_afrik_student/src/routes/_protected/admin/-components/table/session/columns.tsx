import { type Session } from '@/types/session'
import { type ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { cn } from '@/lib/utils'

interface ColumnsProps {
  onEdit: (session: Session) => void
  onDelete: (session: Session) => void
}

const statusColors: Record<string, string> = {
  scheduled: 'text-blue-600 bg-blue-50 border-blue-200',
  ongoing: 'text-green-600 bg-green-50 border-green-200',
  completed: 'text-gray-600 bg-gray-50 border-gray-200',
  cancelled: 'text-red-600 bg-red-50 border-red-200',
}

export const createColumns = ({
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<Session>[] => [
  {
    id: 'formation',
    accessorFn: (row) => row.formation?.title,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Formation" />,
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
    cell: ({ row }) => {
      const status = row.original.status
      const statusLabel = row.original.statusLabel
      if (!status) return <div className="text-sm">-</div>
      return (
        <div
          className={cn(
            'inline-flex items-center gap-2 rounded-md border px-2.5 py-0.5',
            statusColors[status] || 'text-gray-600 bg-gray-50 border-gray-200'
          )}
        >
          <span className="text-xs font-medium">{statusLabel || status}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'enrolled_count',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inscrits / Max" />
    ),
    cell: ({ row }) => {
      const session = row.original
      return (
        <div className="text-sm">
          {session.enrolled_count} / {session.max_students}
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
      const location = row.getValue('location') as string | null
      return <div className="text-sm">{location || '-'}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const session = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(session)}>
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(session)}
            >
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
