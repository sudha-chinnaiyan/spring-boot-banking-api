import React from 'react';
import type { Transaction } from '../types/transaction';
import { formatCurrency } from '../utils/currency';
import { formatDateTime } from '../utils/date';
import { CheckCircle2, ArrowRight, Calendar, Hash, ShieldCheck } from 'lucide-react';

interface TransferSuccessProps {
  transaction: Transaction;
  sourceNumber: string;
  destinationNumber: string;
  onClose: () => void;
}

export const TransferSuccess: React.FC<TransferSuccessProps> = ({
  transaction,
  sourceNumber,
  destinationNumber,
  onClose
}) => {
  return (
    <div className="space-y-6 text-center font-sans">
      <div className="inline-flex bg-emerald-500/10 p-4 rounded-full text-emerald-500 border border-emerald-500/20 mb-2">
        <CheckCircle2 className="h-12 w-12" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white">Transfer Successful</h3>
        <p className="text-sm text-slate-400">
          Funds have been securely routed and committed.
        </p>
      </div>

      <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-6 text-left space-y-4">
        <div className="text-center pb-4 border-b border-slate-900/60">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Transferred Amount</span>
          <h2 className="text-3xl font-extrabold text-white mt-1 font-mono">
            {formatCurrency(transaction.amount)}
          </h2>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-slate-900/40 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">From Account</span>
            <p className="font-semibold text-slate-200 font-mono">{sourceNumber}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-500" />
          <div className="space-y-1 text-right">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">To Account</span>
            <p className="font-semibold text-slate-200 font-mono">{destinationNumber}</p>
          </div>
        </div>

        <div className="space-y-2.5 pt-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Hash className="h-3.5 w-3.5" /> Reference
            </span>
            <span className="font-semibold text-slate-300 font-mono truncate max-w-[180px]">
              {transaction.transactionReference}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> Date & Time
            </span>
            <span className="font-semibold text-slate-300 font-mono">
              {formatDateTime(transaction.createdAt)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> Security Status
            </span>
            <span className="font-semibold text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/30">
              Committed (ACID)
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold py-3 rounded-xl border border-slate-800 transition-colors text-sm cursor-pointer"
      >
        Dismiss Report
      </button>
    </div>
  );
};
export default TransferSuccess;
