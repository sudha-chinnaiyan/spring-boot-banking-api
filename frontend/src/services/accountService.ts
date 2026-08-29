import { api } from './api';
import type { Account, AccountCreate } from '../types/account';

export const accountService = {
  getCustomerAccounts: async (customerId: number): Promise<Account[]> => {
    const response = await api.get<Account[]>(`/accounts/customer/${customerId}`);
    return response.data;
  },

  createAccount: async (account: AccountCreate): Promise<Account> => {
    const response = await api.post<Account>('/accounts', account);
    return response.data;
  }
};
