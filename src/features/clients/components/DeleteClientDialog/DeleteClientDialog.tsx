import { useMutation } from "@apollo/client/react"
import { DELETE_CLIENT, GET_CLIENTS } from "../../graphql/queries"
import type { Client } from "../../types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeleteClientDialogProps {
  client: Client;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteClientDialog({ client, open, onOpenChange }: DeleteClientDialogProps) {
  const [deleteClient, { loading }] = useMutation(DELETE_CLIENT, {
    refetchQueries: [{ query: GET_CLIENTS }],
  })

  async function handleDelete() {
    try {
      await deleteClient({
        variables: { input: { id: client.id } },
      })
      onOpenChange(false)
    } catch (err) {
      console.error("DeleteClient error:", err)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Obrisati klijenta?</AlertDialogTitle>
          <AlertDialogDescription>
            Da li ste sigurni da želite da obrišete klijenta <strong>{client?.name}</strong>? Ova akcija se ne može poništiti.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Otkaži</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? "Brisanje..." : "Obriši"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
