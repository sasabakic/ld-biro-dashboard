export interface Client {
  id: number;
  name: string;
  pib: number;
  mbr: number;
  servicesPrice: string;
  status: string;
  dedicatedEmployee: {
    id: number;
    name: string;
  } | null;
}

export interface User {
  id: number;
  name: string;
}
