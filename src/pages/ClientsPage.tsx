import { useState } from "react"
import { useQuery } from "@apollo/client/react"
import { GET_CLIENTS } from "@/features/clients/graphql/queries"
import type { Client } from "@/features/clients/types"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import AddClientDialog from "@/features/clients/components/AddClientDialog"
import EditClientDialog from "@/features/clients/components/EditClientDialog"
import DeleteClientDialog from "@/features/clients/components/DeleteClientDialog"

export default function ClientsPage() {
  const { data, loading, error } = useQuery<{ clients: Client[] }>(GET_CLIENTS)
  const [addOpen, setAddOpen] = useState(false)
  const [editClient, setEditClient] = useState<Client | null>(null)
  const [deleteClient, setDeleteClient] = useState<Client | null>(null)

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold">Klijenti</h1>
        <AddClientDialog open={addOpen} onOpenChange={setAddOpen} />
      </div>

      {loading && <p className="text-muted-foreground">Učitavanje klijenata...</p>}
      {error && <p className="text-destructive">Greška: {error.message}</p>}
      {data?.clients && (
        <ul className="space-y-2">
          {data.clients.map((client) => (
            <li key={client.id} className="rounded-md border p-3 flex items-center justify-between">
              <span>{client.name}</span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditClient(client)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteClient(client)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editClient && (
        <EditClientDialog
          client={editClient}
          open={!!editClient}
          onOpenChange={(open) => { if (!open) setEditClient(null) }}
        />
      )}

      {deleteClient && (
        <DeleteClientDialog
          client={deleteClient}
          open={!!deleteClient}
          onOpenChange={(open) => { if (!open) setDeleteClient(null) }}
        />
      )}
    </>
  )
}
