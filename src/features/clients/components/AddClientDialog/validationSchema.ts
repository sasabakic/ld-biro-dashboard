import * as yup from "yup";

export const addClientSchema = yup.object({
  ime: yup
    .string()
    .trim()
    .required("Ime je obavezno"),
  pib: yup
    .string()
    .required("PIB je obavezan")
    .matches(/^\d{9}$/, "PIB mora imati tačno 9 cifara"),
  maticniBroj: yup
    .string()
    .required("Matični broj je obavezan")
    .matches(/^\d{8}$/, "Matični broj mora imati tačno 8 cifara"),
  status: yup
    .string()
    .required("Status je obavezan"),
});

export type AddClientFormValues = yup.InferType<typeof addClientSchema>;

export const addClientInitialValues: AddClientFormValues = {
  ime: "",
  pib: "",
  maticniBroj: "",
  status: "",
};
