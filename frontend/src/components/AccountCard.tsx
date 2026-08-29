import React from 'react';
import type { Account } from '../types/account';
import { formatCurrency } from '../utils/currency';
import { ShieldCheck, ShieldAlert, Ban } from 'lucide-react';

interface AccountCardProps {
  account: Account;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
  const getStatusStyles = () => {
    switch (account.status) {
      case 'ACTIVE':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
          icon: <ShieldCheck className="h-4 w-4" />,
          label: 'Active'
        };
      case 'BLOCKED':
        return {
          bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
          icon: <Ban className="h-4 w-4" />,
          label: 'Blocked'
        };
      case 'INACTIVE':
        return {
          bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
          icon: <ShieldAlert className="h-4 w-4" />,
          label: 'Inactive'
        };
      default:
        return {
          bg: 'bg-slate-800/40 border-slate-800 text-slate-400',
          icon: <ShieldAlert className="h-4 w-4" />,
          label: account.status
        };
    }
  };

  const status = getStatusStyles();

  const formatAccountNumber = (num: string) => {
    if (num.startsWith('ACCT-')) {
      return num;
    }
    return `ACCT-${num.substring(0, 4)}-${num.substring(num.length - 4)}`;
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-850 p-6 rounded-2xl shadow-xl flex flex-col justify-between h-48 transition-all hover:border-slate-800 hover:shadow-indigo-500/5 group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-2xl group-hover:bg-indigo-600/10 transition-all pointer-events-none" />

      <div className="flex items-start justify-between">
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
            {account.accountType === 'SAVINGS' ? 'Savings Account' : 'Current Account'}
          </span>
          <p className="text-sm font-semibold tracking-wider text-slate-300 font-mono">
            {formatAccountNumber(account.accountNumber)}
          </p>
        </div>

        <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs border font-medium ${status.bg}`} aria-label={`Account status: ${status.label}`}>
          {status.icon}
          <span>{status.label}</span>
        </div>
      </div>

      <div className="space-y-1">
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Available Balance</span>
        <h3 className="text-3xl font-bold text-white tracking-tight leading-none font-mono">
          {formatCurrency(account.balance)}
        </h3>
      </div>
    </div>
  );
};
export default AccountCard;
