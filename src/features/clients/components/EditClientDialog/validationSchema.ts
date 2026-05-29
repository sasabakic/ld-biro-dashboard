import * as yup from "yup";

export const editClientSchema = yup.object({
  name: yup.string().trim().defined(),
  pib: yup.string().defined(),
  mbr: yup.string().defined(),
  servicesPrice: yup.string().defined(),
  status: yup.string().defined(),
  dedicatedEmployeeId: yup.string().defined(),
});

export type EditClientFormValues = yup.InferType<typeof editClientSchema>;
