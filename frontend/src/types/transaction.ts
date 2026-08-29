export type TransactionType = 'TRANSFER' | 'WITHDRAWAL' | 'DEPOSIT';
export type TransactionStatus = 'COMPLETED' | 'FAILED' | 'PENDING';

export interface TransferRequest {
  sourceAccountId: number;
  destinationAccountId: number;
  amount: number;
}

export interface Transaction {
  id: number;
  transactionReference: string;
  transactionType: TransactionType;
  amount: number;
  status: TransactionStatus;
  sourceAccountId: number | null;
  destinationAccountId: number | null;
  createdAt: string;
}
