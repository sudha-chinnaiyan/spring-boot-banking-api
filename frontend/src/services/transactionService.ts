import { api } from './api';
import type { TransferRequest, Transaction } from '../types/transaction';

export const transactionService = {
  transferFunds: async (request: TransferRequest): Promise<Transaction> => {
    const response = await api.post<Transaction>('/transactions/transfer', request);
    return response.data;
  }
};
