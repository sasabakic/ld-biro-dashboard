import { useState } from "react"
import { useQuery } from "@apollo/client/react"
import { GET_CLIENTS } from "@/graphql/queries"
import AddClientDialog from "@/components/AddClientDialog"

export default function Clients() {
  const { data, loading, error } = useQuery(GET_CLIENTS)
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold">Klijenti</h1>
        <AddClientDialog open={open} onOpenChange={setOpen} />
      </div>

      {loading && <p className="text-muted-foreground">Učitavanje klijenata...</p>}
      {error && <p className="text-destructive">Greška: {error.message}</p>}
      {data?.clients && (
        <ul className="space-y-2">
          {data.clients.map((client) => (
            <li key={client.id} className="rounded-md border p-3">
              {client.name}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
