import { api } from './api';
import type { Customer, CustomerCreate } from '../types/customer';

export const customerService = {
  getCustomer: async (id: number): Promise<Customer> => {
    const response = await api.get<Customer>(`/customers/${id}`);
    return response.data;
  },

  createCustomer: async (customer: CustomerCreate): Promise<Customer> => {
    const response = await api.post<Customer>('/customers', customer);
    return response.data;
  }
};
