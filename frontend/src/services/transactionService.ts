import { api } from './api';
import type { TransferRequest, Transaction, PageResponse } from '../types/transaction';

export const transactionService = {
  transferFunds: async (request: TransferRequest): Promise<Transaction> => {
    const response = await api.post<Transaction>('/transactions/transfer', request);
    return response.data;
  },

  getTransactionsByAccount: async (
    accountId: number,
    page: number = 0,
    size: number = 10,
    sort: string = 'createdAt,desc'
  ): Promise<PageResponse<Transaction>> => {
    const response = await api.get<PageResponse<Transaction>>(`/transactions/account/${accountId}`, {
      params: { page, size, sort }
    });
    return response.data;
  }
};
