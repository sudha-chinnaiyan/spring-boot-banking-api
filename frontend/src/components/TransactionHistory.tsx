import React, { useState, useEffect } from 'react';
import type { Account } from '../types/account';
import type { Transaction, PageResponse } from '../types/transaction';
import { transactionService } from '../services/transactionService';
import { formatCurrency } from '../utils/currency';
import { formatDateTime } from '../utils/date';
import { ArrowRightLeft, ArrowLeftRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface TransactionHistoryProps {
  accounts: Account[];
  refreshTrigger: number;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ accounts, refreshTrigger }) => {
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [transactionsPage, setTransactionsPage] = useState<PageResponse<Transaction> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const [sortBy] = useState<string>('createdAt,desc');

  // Automatically select first account if none is selected
  useEffect(() => {
    if (accounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(accounts[0].id.toString());
    }
  }, [accounts, selectedAccountId]);

  useEffect(() => {
    if (!selectedAccountId) {
      setTransactionsPage(null);
      return;
    }

    const loadTransactions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await transactionService.getTransactionsByAccount(
          Number(selectedAccountId),
          currentPage,
          pageSize,
          sortBy
        );
        setTransactionsPage(data);
      } catch (err: any) {
        setError(err.message || 'Failed to retrieve transaction records.');
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, [selectedAccountId, currentPage, pageSize, sortBy, refreshTrigger]);

  const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAccountId(e.target.value);
    setCurrentPage(0); // Reset page to index 0 on swap
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" aria-label="Status: Success">
            <span>✓ COMPLETED</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-rose-500/10 border border-rose-500/20 text-rose-400" aria-label="Status: Failed">
            <span>! FAILED</span>
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-400" aria-label="Status: Pending">
            <span className="h-1 w-1 bg-amber-400 rounded-full animate-pulse mr-1" />
            <span>↻ PENDING</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-slate-800 border border-slate-700 text-slate-400">
            <span>{status}</span>
          </span>
        );
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'TRANSFER':
        return (
          <span className="inline-flex items-center space-x-1 text-slate-300">
            <ArrowRightLeft className="h-3.5 w-3.5 text-indigo-400" />
            <span>Transfer</span>
          </span>
        );
      case 'DEPOSIT':
        return (
          <span className="inline-flex items-center space-x-1 text-slate-300">
            <ArrowLeftRight className="h-3.5 w-3.5 text-emerald-400" />
            <span>Deposit</span>
          </span>
        );
      case 'WITHDRAWAL':
        return (
          <span className="inline-flex items-center space-x-1 text-slate-300">
            <ArrowLeftRight className="h-3.5 w-3.5 text-rose-400" />
            <span>Withdrawal</span>
          </span>
        );
      default:
        return <span className="text-slate-400">{type}</span>;
    }
  };



  const selectedAccount = accounts.find(a => a.id === Number(selectedAccountId)) || null;

  return (
    <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-950/60">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white tracking-tight">Audit & Transaction Log</h2>
          <p className="text-xs text-slate-400">
            Monitor real-time ledger audits linked with your accounts.
          </p>
        </div>

        {accounts.length > 0 && (
          <div className="flex items-center space-x-3.5">
            <label htmlFor="audit-account-select" className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
              Audit Target:
            </label>
            <select
              id="audit-account-select"
              value={selectedAccountId}
              onChange={handleAccountChange}
              disabled={isLoading}
              className="bg-slate-950/80 border border-slate-850 text-white rounded-xl px-3.5 py-2 text-xs focus:border-indigo-500 focus:outline-none transition-colors"
            >
              {accounts.map(a => (
                <option key={a.id} value={a.id}>
                  {a.accountType} - {a.accountNumber}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-rose-950/20 border border-rose-900/40 p-4 rounded-xl flex items-start space-x-3 text-rose-200 text-xs">
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        /* Loading skeleton rows */
        <div className="space-y-4 py-4 animate-pulse">
          <div className="h-10 bg-slate-950/60 rounded-xl" />
          <div className="h-16 bg-slate-950/40 rounded-xl" />
          <div className="h-16 bg-slate-950/40 rounded-xl" />
          <div className="h-16 bg-slate-950/40 rounded-xl" />
        </div>
      ) : !transactionsPage || transactionsPage.content.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12 space-y-3 bg-slate-950/20 border border-dashed border-slate-850 rounded-2xl">
          <p className="font-semibold text-slate-400 text-sm">No transaction records found</p>
          <p className="text-xs text-slate-500">
            Audit logs will compile automatically once transfer tasks are initiated.
          </p>
        </div>
      ) : (
        /* Transaction Table */
        <div className="space-y-4">
          <div className="overflow-x-auto border border-slate-900 rounded-xl bg-slate-950/40">
            <table className="min-w-full divide-y divide-slate-900/60 text-left text-xs text-slate-300">
              <thead className="bg-slate-900/40 font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th scope="col" className="px-6 py-4">Reference</th>
                  <th scope="col" className="px-6 py-4">Date</th>
                  <th scope="col" className="px-6 py-4">Type</th>
                  <th scope="col" className="px-6 py-4">Amount</th>
                  <th scope="col" className="px-6 py-4 text-center">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/40">
                {transactionsPage.content.map(txn => {
                  // Determine debit vs credit style
                  const isDebit = txn.sourceAccountId === selectedAccount?.id;
                  return (
                    <tr key={txn.id} className="hover:bg-slate-900/10 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-slate-400">
                        <span title={txn.transactionReference} className="truncate max-w-[120px] block">
                          {txn.transactionReference}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {formatDateTime(txn.createdAt)}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {getTypeBadge(txn.transactionType)}
                      </td>
                      <td className={`px-6 py-4 font-mono font-bold text-sm ${isDebit ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {isDebit ? '-' : '+'}{formatCurrency(txn.amount)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(txn.status)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 text-xs text-slate-400">
            <p className="text-center sm:text-left">
              Showing <span className="font-semibold text-slate-200">{currentPage * pageSize + 1}</span>–
              <span className="font-semibold text-slate-200">
                {Math.min((currentPage + 1) * pageSize, transactionsPage.totalElements)}
              </span> of <span className="font-semibold text-slate-200">{transactionsPage.totalElements}</span> transactions
            </p>

            <div className="flex items-center justify-center space-x-3.5">
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                disabled={transactionsPage.first || isLoading}
                className="bg-slate-950 hover:bg-slate-900 disabled:opacity-30 border border-slate-850 px-3.5 py-2 rounded-xl flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed transition-colors font-medium text-slate-200"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Prev</span>
              </button>

              <span className="font-semibold text-slate-300">
                Page {currentPage + 1} of {transactionsPage.totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, transactionsPage.totalPages - 1))}
                disabled={transactionsPage.last || isLoading}
                className="bg-slate-950 hover:bg-slate-900 disabled:opacity-30 border border-slate-850 px-3.5 py-2 rounded-xl flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed transition-colors font-medium text-slate-200"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default TransactionHistory;
