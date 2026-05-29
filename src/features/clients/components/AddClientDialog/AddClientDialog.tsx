import { useMutation } from "@apollo/client/react"
import { useFormik } from "formik"
import { CREATE_CLIENT, GET_CLIENTS } from "../../graphql/queries"
import { addClientSchema, addClientInitialValues, type AddClientFormValues } from "./validationSchema"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const CLIENT_STATUSES = [
  { value: "active", label: "Aktivan" },
  { value: "cancelled", label: "Otkazan" },
  { value: "on_hold", label: "Na čekanju" },
] as const

const STATUS_MAP: Record<string, string> = {
  active: "ACTIVE",
  cancelled: "CANCELLED",
  on_hold: "ON_HOLD",
}

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddClientDialog({ open, onOpenChange }: AddClientDialogProps) {
  const [createClient, { loading }] = useMutation(CREATE_CLIENT, {
    refetchQueries: [{ query: GET_CLIENTS }],
  })

  const formik = useFormik<AddClientFormValues>({
    initialValues: addClientInitialValues,
    validationSchema: addClientSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await createClient({
          variables: {
            input: {
              name: values.ime.trim(),
              pib: Number(values.pib),
              mbr: Number(values.maticniBroj),
              status: STATUS_MAP[values.status],
            },
          },
        })
        resetForm()
        onOpenChange(false)
      } catch (err) {
        console.error("CreateClient error:", err)
      }
    },
  })

  function handleDigitInput(field: keyof AddClientFormValues, value: string, maxLen: number) {
    const digits = value.replace(/\D/g, "").slice(0, maxLen)
    formik.setFieldValue(field, digits)
  }

  function handleOpenChange(value: boolean) {
    if (!value) {
      formik.resetForm()
    }
    onOpenChange(value)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200">
          <Plus />
          Dodaj klijenta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novi klijent</DialogTitle>
        </DialogHeader>
        <form className="space-y-4 pt-2" onSubmit={formik.handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="ime">Ime *</Label>
            <Input
              id="ime"
              name="ime"
              placeholder="Naziv klijenta"
              value={formik.values.ime}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={!!(formik.touched.ime && formik.errors.ime)}
            />
            {formik.touched.ime && formik.errors.ime && (
              <p className="text-sm text-destructive">{formik.errors.ime}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="pib">PIB *</Label>
            <Input
              id="pib"
              name="pib"
              inputMode="numeric"
              placeholder="Broj od 9 cifara"
              value={formik.values.pib}
              onChange={(e) => handleDigitInput("pib", e.target.value, 9)}
              onBlur={formik.handleBlur}
              aria-invalid={!!(formik.touched.pib && formik.errors.pib)}
            />
            {formik.touched.pib && formik.errors.pib && (
              <p className="text-sm text-destructive">{formik.errors.pib}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="maticniBroj">Matični broj *</Label>
            <Input
              id="maticniBroj"
              name="maticniBroj"
              inputMode="numeric"
              placeholder="Broj od 8 cifara"
              value={formik.values.maticniBroj}
              onChange={(e) => handleDigitInput("maticniBroj", e.target.value, 8)}
              onBlur={formik.handleBlur}
              aria-invalid={!!(formik.touched.maticniBroj && formik.errors.maticniBroj)}
            />
            {formik.touched.maticniBroj && formik.errors.maticniBroj && (
              <p className="text-sm text-destructive">{formik.errors.maticniBroj}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Status klijenta *</Label>
            <Select
              value={formik.values.status}
              onValueChange={(v) => formik.setFieldValue("status", v)}
            >
              <SelectTrigger
                className="w-full"
                aria-invalid={!!(formik.touched.status && formik.errors.status)}
                onBlur={() => formik.setFieldTouched("status", true)}
              >
                <SelectValue placeholder="Izaberite status" />
              </SelectTrigger>
              <SelectContent>
                {CLIENT_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.status && formik.errors.status && (
              <p className="text-sm text-destructive">{formik.errors.status}</p>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
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
