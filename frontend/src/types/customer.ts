export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerCreate {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}
