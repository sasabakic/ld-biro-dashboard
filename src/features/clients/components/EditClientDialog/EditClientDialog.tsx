import { useEffect, useState } from "react"
import { useMutation, useQuery } from "@apollo/client/react"
import { useFormik } from "formik"
import { UPDATE_CLIENT, GET_CLIENTS } from "../../graphql/queries"
import { GET_USERS } from "@/graphql/queries"
import { editClientSchema, type EditClientFormValues } from "./validationSchema"
import type { Client, User } from "../../types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const CLIENT_STATUSES = [
  { value: "ACTIVE", label: "Aktivan" },
  { value: "CANCELLED", label: "Otkazan" },
  { value: "ON_HOLD", label: "Na čekanju" },
] as const

function clientToForm(client: Client): EditClientFormValues {
  return {
    name: client.name ?? "",
    pib: client.pib != null ? String(client.pib) : "",
    mbr: client.mbr != null ? String(client.mbr) : "",
    servicesPrice: client.servicesPrice ?? "",
    status: client.status ?? "",
    dedicatedEmployeeId: client.dedicatedEmployee?.id != null
      ? String(client.dedicatedEmployee.id)
      : "",
  }
}

function getChangedFields(original: Client, current: EditClientFormValues): Record<string, unknown> {
  const input: Record<string, unknown> = {}

  if (current.name.trim() !== (original.name ?? "")) {
    input.name = current.name.trim()
  }
  if (current.pib !== String(original.pib ?? "")) {
    input.pib = Number(current.pib)
  }
  if (current.mbr !== String(original.mbr ?? "")) {
    input.mbr = Number(current.mbr)
  }
  if (current.servicesPrice !== (original.servicesPrice ?? "")) {
    input.servicesPrice = current.servicesPrice
  }
  if (current.status !== (original.status ?? "")) {
    input.status = current.status
  }
  if (current.dedicatedEmployeeId !== String(original.dedicatedEmployee?.id ?? "")) {
    if (current.dedicatedEmployeeId) {
      input.dedicatedEmployeeId = Number(current.dedicatedEmployeeId)
    }
  }
  return input
}

interface EditClientDialogProps {
  client: Client;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditClientDialog({ client, open, onOpenChange }: EditClientDialogProps) {
  const [serverError, setServerError] = useState("")
  const { data: usersData } = useQuery<{ users: User[] }>(GET_USERS)
  const [updateClient, { loading }] = useMutation(UPDATE_CLIENT, {
    refetchQueries: [{ query: GET_CLIENTS }],
  })

  const formik = useFormik<EditClientFormValues>({
    initialValues: clientToForm(client),
    enableReinitialize: true,
    validationSchema: editClientSchema,
    onSubmit: async (values) => {
      setServerError("")

      const changedFields = getChangedFields(client, values)

      if (Object.keys(changedFields).length === 0) {
        onOpenChange(false)
        return
      }

      try {
        await updateClient({
          variables: {
            input: {
              id: client.id,
              ...changedFields,
            },
          },
        })
        onOpenChange(false)
      } catch (err) {
        setServerError(err instanceof Error ? err.message : "Greška pri čuvanju")
      }
    },
  })

  useEffect(() => {
    if (open) {
      setServerError("")
    }
  }, [open])

  function handleDigitInput(field: keyof EditClientFormValues, value: string, maxLen: number) {
    const digits = value.replace(/\D/g, "").slice(0, maxLen)
    formik.setFieldValue(field, digits)
  }

  function handlePriceInput(value: string) {
    const cleaned = value.replace(/[^\d.]/g, "")
    formik.setFieldValue("servicesPrice", cleaned)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Izmeni klijenta</DialogTitle>
        </DialogHeader>
        <form className="space-y-4 pt-2" onSubmit={formik.handleSubmit}>
          {serverError && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-md p-2">
              {serverError}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="edit-name">Ime</Label>
            <Input
              id="edit-name"
              name="name"
              placeholder="Naziv klijenta"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-pib">PIB</Label>
            <Input
              id="edit-pib"
              name="pib"
              inputMode="numeric"
              placeholder="Broj od 9 cifara"
              value={formik.values.pib}
              onChange={(e) => handleDigitInput("pib", e.target.value, 9)}
              onBlur={formik.handleBlur}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-mbr">Matični broj</Label>
            <Input
              id="edit-mbr"
              name="mbr"
              inputMode="numeric"
              placeholder="Broj od 8 cifara"
              value={formik.values.mbr}
              onChange={(e) => handleDigitInput("mbr", e.target.value, 8)}
              onBlur={formik.handleBlur}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-servicesPrice">Cena usluga</Label>
            <Input
              id="edit-servicesPrice"
              name="servicesPrice"
              inputMode="decimal"
              placeholder="npr. 1500.00"
              value={formik.values.servicesPrice}
              onChange={(e) => handlePriceInput(e.target.value)}
              onBlur={formik.handleBlur}
            />
          </div>
          <div className="space-y-2">
            <Label>Status klijenta</Label>
            <Select
              value={formik.values.status}
              onValueChange={(v) => formik.setFieldValue("status", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Izaberite status" />
              </SelectTrigger>
              <SelectContent>
                {CLIENT_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Zaduženi zaposleni</Label>
            <Select
              value={formik.values.dedicatedEmployeeId}
              onValueChange={(v) => formik.setFieldValue("dedicatedEmployeeId", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Izaberite zaposlenog" />
              </SelectTrigger>
              <SelectContent>
                {usersData?.users?.map((user) => (
                  <SelectItem key={user.id} value={String(user.id)}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Otkaži
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Čuvanje..." : "Sačuvaj"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
