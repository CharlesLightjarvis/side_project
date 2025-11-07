import { createColumns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import { useSessions } from '@/hooks/use-sessions'
import { usePermissions } from '@/hooks/use-permissions'
import { PermissionGuard } from '@/components/PermissionGuard'
import { useEffect, useState, useRef } from 'react'
import { CreateSession } from '../../sessions/CreateSession'
import { UpdateSession } from '../../sessions/UpdateSession'
import { DeleteSession } from '../../sessions/DeleteSession'
import type { Session } from '@/types/session'
import { toast } from 'sonner'
import { PERMISSIONS } from '@/lib/permissions'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'

export default function SessionList() {
  const { sessions, loading, fetchSessions } = useSessions()
  const { can } = usePermissions()
  const hasFetched = useRef(false)

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)

  useEffect(() => {
    if (!hasFetched.current) {
      fetchSessions()
      hasFetched.current = true
    }
  }, [fetchSessions])

  const handleEdit = (session: Session) => {
    if (!can.update('session')) {
      toast.error("Vous n'avez pas la permission de modifier les sessions")
      return
    }
    setSelectedSession(session)
    setUpdateDialogOpen(true)
  }

  const handleDelete = (session: Session) => {
    if (!can.delete('session')) {
      toast.error("Vous n'avez pas la permission de supprimer les sessions")
      return
    }
    setSelectedSession(session)
    setDeleteDialogOpen(true)
  }

  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  })

  if (loading && sessions.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Chargement des sessions...</p>
        </div>
      </div>
    )
  }

  if (!loading && sessions.length === 0) {
    return (
      <>
        <div className="container mx-auto space-y-6 p-4">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Gestion des sessions de formation
            </h1>
            <p className="text-muted-foreground">
              Créez, modifiez et gérez toutes les sessions de formation
            </p>
          </div>

          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <Calendar className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                Aucune session pour le moment
              </h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                Vous n'avez pas encore créé de session de formation. Commencez par
                ajouter votre première session.
              </p>
              {can.create('session') && (
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Créer une session
                </Button>
              )}
            </div>
          </div>
        </div>

        <PermissionGuard permissions={PERMISSIONS.SESSION.CREATE}>
          <CreateSession open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
        </PermissionGuard>
      </>
    )
  }

  return (
    <>
      <div className="container mx-auto space-y-6 p-4">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des sessions de formation
          </h1>
          <p className="text-muted-foreground">
            Créez, modifiez et gérez toutes les sessions de formation
          </p>
        </div>

        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={sessions}
            searchFilter={{
              columnId: 'formation',
              placeholder: 'Rechercher par formation...',
            }}
            actionButton={
              can.create('session')
                ? {
                    label: 'Ajouter une session',
                    onClick: () => setCreateDialogOpen(true),
                  }
                : undefined
            }
          />
        </div>
      </div>

      <PermissionGuard permissions={PERMISSIONS.SESSION.CREATE}>
        <CreateSession open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      </PermissionGuard>

      <PermissionGuard permissions={PERMISSIONS.SESSION.UPDATE}>
        <UpdateSession
          session={selectedSession}
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
        />
      </PermissionGuard>

      <PermissionGuard permissions={PERMISSIONS.SESSION.DELETE}>
        <DeleteSession
          session={selectedSession}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
      </PermissionGuard>
    </>
  )
}
