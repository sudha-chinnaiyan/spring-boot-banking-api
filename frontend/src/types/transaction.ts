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

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
