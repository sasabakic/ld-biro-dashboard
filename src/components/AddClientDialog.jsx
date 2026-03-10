import { useState } from "react"
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
]

const initialForm = { ime: "", pib: "", maticniBroj: "", status: "" }
const initialErrors = { ime: "", pib: "", maticniBroj: "", status: "" }

function validate(form) {
  const errors = { ...initialErrors }
  let valid = true

  if (!form.ime.trim()) {
    errors.ime = "Ime je obavezno"
    valid = false
  }

  if (!form.pib) {
    errors.pib = "PIB je obavezan"
    valid = false
  } else if (!/^\d{9}$/.test(form.pib)) {
    errors.pib = "PIB mora imati tačno 9 cifara"
    valid = false
  }

  if (!form.maticniBroj) {
    errors.maticniBroj = "Matični broj je obavezan"
    valid = false
  } else if (!/^\d{8}$/.test(form.maticniBroj)) {
    errors.maticniBroj = "Matični broj mora imati tačno 8 cifara"
    valid = false
  }

  if (!form.status) {
    errors.status = "Status je obavezan"
    valid = false
  }

  return { errors, valid }
}

export default function AddClientDialog({ open, onOpenChange }) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState(initialErrors)

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  function handleDigitInput(field, value, maxLen) {
    const digits = value.replace(/\D/g, "").slice(0, maxLen)
    handleChange(field, digits)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const { errors: newErrors, valid } = validate(form)
    setErrors(newErrors)
    if (!valid) return

    // TODO: submit mutation
    console.log("submit", form)
    setForm(initialForm)
    setErrors(initialErrors)
    onOpenChange(false)
  }

  function handleOpenChange(value) {
    if (!value) {
      setForm(initialForm)
      setErrors(initialErrors)
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
        <form className="space-y-4 pt-2" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="ime">Ime *</Label>
            <Input
              id="ime"
              placeholder="Naziv klijenta"
              value={form.ime}
              onChange={(e) => handleChange("ime", e.target.value)}
              aria-invalid={!!errors.ime}
            />
            {errors.ime && <p className="text-sm text-destructive">{errors.ime}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="pib">PIB *</Label>
            <Input
              id="pib"
              inputMode="numeric"
              placeholder="Broj od 9 cifara"
              value={form.pib}
              onChange={(e) => handleDigitInput("pib", e.target.value, 9)}
              aria-invalid={!!errors.pib}
            />
            {errors.pib && <p className="text-sm text-destructive">{errors.pib}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="maticniBroj">Matični broj *</Label>
            <Input
              id="maticniBroj"
              inputMode="numeric"
              placeholder="Broj od 8 cifara"
              value={form.maticniBroj}
              onChange={(e) => handleDigitInput("maticniBroj", e.target.value, 8)}
              aria-invalid={!!errors.maticniBroj}
            />
            {errors.maticniBroj && <p className="text-sm text-destructive">{errors.maticniBroj}</p>}
          </div>
          <div className="space-y-2">
            <Label>Status klijenta *</Label>
            <Select value={form.status} onValueChange={(v) => handleChange("status", v)}>
              <SelectTrigger className="w-full" aria-invalid={!!errors.status}>
                <SelectValue placeholder="Izaberite status" />
              </SelectTrigger>
              <SelectContent>
                {CLIENT_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Otkaži
            </Button>
            <Button type="submit">
              Sačuvaj
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
