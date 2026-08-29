export type AccountType = 'SAVINGS' | 'CURRENT';
export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'CLOSED';

export interface Account {
  id: number;
  accountNumber: string;
  accountType: AccountType;
  balance: number;
  status: AccountStatus;
  customerId: number;
  createdAt: string;
  updatedAt: string;
}

export interface AccountCreate {
  customerId: number;
  accountType: AccountType;
  initialBalance: number;
}
