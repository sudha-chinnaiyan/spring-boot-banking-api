import React, { useState } from 'react';
import type { Account } from '../types/account';
import type { Transaction } from '../types/transaction';
import { transactionService } from '../services/transactionService';
import { validateTransfer } from '../utils/validation';
import { formatCurrency } from '../utils/currency';
import { TransferSuccess } from './TransferSuccess';
import { TransferError } from './TransferError';
import { ArrowRightLeft, ArrowRight, Loader2, AlertCircle, Eye } from 'lucide-react';

interface TransferFormProps {
  accounts: Account[];
  onTransferSuccess: () => void;
}

export const TransferForm: React.FC<TransferFormProps> = ({ accounts, onTransferSuccess }) => {
  const [sourceId, setSourceId] = useState<string>('');
  const [destinationId, setDestinationId] = useState<string>('');
  const [amountStr, setAmountStr] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  
  const [validationError, setValidationError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<any | null>(null);
  const [successTransaction, setSuccessTransaction] = useState<Transaction | null>(null);

  const sourceAccount = accounts.find(a => a.id === Number(sourceId)) || null;
  const destinationAccount = accounts.find(a => a.id === Number(destinationId)) || null;

  const maskAccountNumber = (num: string) => {
    const cleanNum = num.replace('ACCT-', '').replace(/[^a-zA-Z0-9]/g, '');
    if (cleanNum.length > 4) {
      return `XXXX XXXX ${cleanNum.substring(cleanNum.length - 4)}`;
    }
    return `XXXX XXXX ${cleanNum}`;
  };

  const handleInitiate = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setApiError(null);

    const validation = validateTransfer(sourceAccount, destinationAccount, amountStr);
    if (!validation.isValid) {
      setValidationError(validation.message);
      return;
    }

    setIsConfirming(true);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      const response = await transactionService.transferFunds({
        sourceAccountId: Number(sourceId),
        destinationAccountId: Number(destinationId),
        amount: Number(amountStr)
      });
      setSuccessTransaction(response);
      setIsConfirming(false);
      onTransferSuccess();
    } catch (err: any) {
      setApiError(err);
      setIsConfirming(false); // return to edit form if transaction fails
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSourceId('');
    setDestinationId('');
    setAmountStr('');
    setValidationError(null);
    setApiError(null);
    setSuccessTransaction(null);
    setIsConfirming(false);
  };

  if (successTransaction && sourceAccount && destinationAccount) {
    return (
      <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <TransferSuccess 
          transaction={successTransaction}
          sourceNumber={maskAccountNumber(sourceAccount.accountNumber)}
          destinationNumber={maskAccountNumber(destinationAccount.accountNumber)}
          onClose={handleReset}
        />
      </div>
    );
  }

  if (isConfirming && sourceAccount && destinationAccount) {
    return (
      <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-6 font-sans">
        <div className="flex items-start space-x-3.5 pb-4 border-b border-slate-950/60">
          <div className="bg-indigo-600/10 p-2.5 rounded-xl text-indigo-400 border border-indigo-500/15">
            <Eye className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Confirm Transfer</h3>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              Review transaction details carefully before authorization.
            </p>
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-5 space-y-4 text-sm">
          <div className="flex justify-between py-2 border-b border-slate-900/40">
            <span className="text-slate-500 text-xs">Source Account</span>
            <div className="text-right">
              <p className="font-semibold text-slate-200">{sourceAccount.accountType}</p>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{maskAccountNumber(sourceAccount.accountNumber)}</p>
            </div>
          </div>

          <div className="flex justify-between py-2 border-b border-slate-900/40">
            <span className="text-slate-500 text-xs">Destination Account</span>
            <div className="text-right">
              <p className="font-semibold text-slate-200">{destinationAccount.accountType}</p>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{maskAccountNumber(destinationAccount.accountNumber)}</p>
            </div>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-slate-500 text-xs">Amount to Send</span>
            <span className="font-bold text-white font-mono text-base">
              {formatCurrency(Number(amountStr))}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => setIsConfirming(false)}
            disabled={isSubmitting}
            className="w-1/2 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-300 font-semibold py-3 px-4 rounded-xl text-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="w-1/2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all flex items-center justify-center space-x-2 text-sm cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <span>Confirm & Send</span>
            )}
          </button>
        </div>
      </div>
    );
  }

  const destinationOptions = accounts.filter(a => a.id !== Number(sourceId));

  return (
    <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-6 font-sans">
      <div className="flex items-start space-x-3.5 pb-4 border-b border-slate-950/60">
        <div className="bg-indigo-600/10 p-2.5 rounded-xl text-indigo-400 border border-indigo-500/15">
          <ArrowRightLeft className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Transfer Money</h3>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
            Move funds instantly between checking and savings accounts.
          </p>
        </div>
      </div>

      {apiError && (
        <TransferError 
          error={apiError} 
          onDismiss={() => setApiError(null)} 
        />
      )}

      {validationError && (
        <div className="bg-rose-950/20 border border-rose-900/40 p-4 rounded-xl flex items-start space-x-3 text-rose-200 text-xs">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-rose-500" />
          <span>{validationError}</span>
        </div>
      )}

      <form onSubmit={handleInitiate} className="space-y-5">
        <div>
          <label htmlFor="source-account-select" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            From Account (Source)
          </label>
          <select
            id="source-account-select"
            value={sourceId}
            onChange={(e) => {
              setSourceId(e.target.value);
              setValidationError(null);
            }}
            disabled={isSubmitting}
            className="w-full bg-slate-950/80 border border-slate-850 text-white rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
          >
            <option value="">Select source account</option>
            {accounts.map(a => (
              <option key={a.id} value={a.id}>
                {a.accountType} - {maskAccountNumber(a.accountNumber)} ({formatCurrency(a.balance)}) {a.status !== 'ACTIVE' ? `[${a.status}]` : ''}
              </option>
            ))}
          </select>
          {sourceAccount && (
            <p className="text-[10px] text-slate-400 mt-1.5 pl-1 flex items-center gap-1.5 font-sans">
              Available Balance: <span className="font-semibold text-slate-200 font-mono">{formatCurrency(sourceAccount.balance)}</span>
            </p>
          )}
        </div>

        <div className="flex justify-center -my-2.5">
          <div className="bg-slate-950 p-2 rounded-full border border-slate-850 text-slate-500">
            <ArrowRight className="h-4 w-4 rotate-90" />
          </div>
        </div>

        <div>
          <label htmlFor="destination-account-select" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            To Account (Destination)
          </label>
          <select
            id="destination-account-select"
            value={destinationId}
            onChange={(e) => {
              setDestinationId(e.target.value);
              setValidationError(null);
            }}
            disabled={isSubmitting}
            className="w-full bg-slate-950/80 border border-slate-850 text-white rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
          >
            <option value="">Select destination account</option>
            {destinationOptions.map(a => (
              <option key={a.id} value={a.id}>
                {a.accountType} - {maskAccountNumber(a.accountNumber)} ({formatCurrency(a.balance)}) {a.status !== 'ACTIVE' ? `[${a.status}]` : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="transfer-amount-input" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold">$</span>
            <input
              id="transfer-amount-input"
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={amountStr}
              onChange={(e) => {
                setAmountStr(e.target.value);
                setValidationError(null);
              }}
              disabled={isSubmitting}
              className="w-full bg-slate-950/80 border border-slate-850 text-white rounded-xl pl-8 pr-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition-colors font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all flex items-center justify-center space-x-2 text-sm cursor-pointer disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing Transfer...</span>
            </>
          ) : (
            <span>Initiate Transfer</span>
          )}
        </button>
      </form>
    </div>
  );
};
export default TransferForm;
