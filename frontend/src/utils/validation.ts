import type { Account } from '../types/account';

export interface ValidationResult {
  isValid: boolean;
  message: string | null;
}

export const validateTransfer = (
  sourceAccount: Account | null,
  destinationAccount: Account | null,
  amountStr: string
): ValidationResult => {
  if (!sourceAccount) {
    return { isValid: false, message: 'Please select a source account.' };
  }

  if (!destinationAccount) {
    return { isValid: false, message: 'Please select a destination account.' };
  }

  if (sourceAccount.id === destinationAccount.id) {
    return { isValid: false, message: 'Source and destination accounts must be different.' };
  }

  if (!amountStr || amountStr.trim() === '') {
    return { isValid: false, message: 'Please enter a transfer amount.' };
  }

  const amount = Number(amountStr);
  if (isNaN(amount)) {
    return { isValid: false, message: 'Transfer amount must be a valid number.' };
  }

  if (amount <= 0) {
    return { isValid: false, message: 'Transfer amount must be greater than zero.' };
  }

  const amountRegex = /^\d+(\.\d{1,2})?$/;
  if (!amountRegex.test(amountStr)) {
    return { isValid: false, message: 'Transfer amount must be a valid monetary value (maximum 2 decimal places).' };
  }

  if (sourceAccount.status !== 'ACTIVE') {
    return { isValid: false, message: 'The source account is not active and cannot perform transfers.' };
  }

  if (destinationAccount.status !== 'ACTIVE') {
    return { isValid: false, message: 'The destination account is not active and cannot receive transfers.' };
  }

  if (amount > sourceAccount.balance) {
    return { isValid: false, message: 'The transfer amount exceeds the available balance in your source account.' };
  }

  return { isValid: true, message: null };
};
