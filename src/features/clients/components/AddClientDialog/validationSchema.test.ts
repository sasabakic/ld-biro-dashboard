import { describe, it, expect } from "vitest";
import { addClientSchema } from "./validationSchema";

const validData = {
  ime: "Acme Corp",
  pib: "123456789",
  maticniBroj: "12345678",
  status: "active",
};

describe("addClientSchema", () => {
  it("passes when all fields are filled correctly", async () => {
    await expect(addClientSchema.validate(validData)).resolves.toBeTruthy();
  });

  it("fails when ime is missing", async () => {
    await expect(
      addClientSchema.validate({ ...validData, ime: "" })
    ).rejects.toThrow("Ime je obavezno");
  });

  it("fails when ime is only whitespace", async () => {
    await expect(
      addClientSchema.validate({ ...validData, ime: "   " })
    ).rejects.toThrow("Ime je obavezno");
  });

  it("fails when pib is missing", async () => {
    await expect(
      addClientSchema.validate({ ...validData, pib: "" })
    ).rejects.toThrow("PIB je obavezan");
  });

  it("fails when pib has wrong number of digits", async () => {
    await expect(
      addClientSchema.validate({ ...validData, pib: "12345" })
    ).rejects.toThrow("PIB mora imati tačno 9 cifara");
  });

  it("fails when maticniBroj is missing", async () => {
    await expect(
      addClientSchema.validate({ ...validData, maticniBroj: "" })
    ).rejects.toThrow("Matični broj je obavezan");
  });

  it("fails when maticniBroj has wrong number of digits", async () => {
    await expect(
      addClientSchema.validate({ ...validData, maticniBroj: "1234" })
    ).rejects.toThrow("Matični broj mora imati tačno 8 cifara");
  });

  it("fails when status is missing", async () => {
    await expect(
      addClientSchema.validate({ ...validData, status: "" })
    ).rejects.toThrow("Status je obavezan");
  });
});
