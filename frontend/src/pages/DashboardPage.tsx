import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { StatCard } from '../components/StatCard';
import { AccountCard } from '../components/AccountCard';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { TransferForm } from '../components/TransferForm';
import { TransactionHistory } from '../components/TransactionHistory';
import { customerService } from '../services/customerService';
import { accountService } from '../services/accountService';
import type { Customer } from '../types/customer';
import type { Account } from '../types/account';
import { formatCurrency } from '../utils/currency';
import { Wallet, Briefcase, CheckCircle2, AlertTriangle, User, Mail, Phone, Calendar } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [historyRefreshKey, setHistoryRefreshKey] = useState<number>(0);

  const handleTransferSuccess = () => {
    fetchData();
    setHistoryRefreshKey(prev => prev + 1);
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    setIsNotFound(false);
    try {
      // Load customer ID 1 as standard demo profile
      const custData = await customerService.getCustomer(1);
      setCustomer(custData);

      const accountsData = await accountService.getCustomerAccounts(1);
      setAccounts(accountsData);
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setIsNotFound(true);
      } else {
        setError(err.message || 'Connection to the backend API failed. Ensure the server is online.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
          <LoadingState />
        </main>
      </div>
    );
  }

  if (error || isNotFound) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-grow flex items-center justify-center w-full">
          <ErrorState 
            message={error || ''} 
            isNotFound={isNotFound} 
            onRetry={fetchData} 
          />
        </main>
      </div>
    );
  }

  // Calculate Dashboard Summary Metrics
  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);
  const activeCount = accounts.filter(acc => acc.status === 'ACTIVE').length;
  const blockedCount = accounts.filter(acc => acc.status === 'BLOCKED').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar customerName={customer ? `${customer.firstName} ${customer.lastName}` : undefined} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow space-y-10 w-full">
        {/* Customer Header Summary */}
        {customer && (
          <section className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded">
                  Customer Profile
                </span>
                <span className="text-xs text-slate-500 font-mono">ID: {customer.id}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, {customer.firstName}!
              </h1>
              <p className="text-sm text-slate-400">
                Manage your financial accounts and view concurrent transaction reports below.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t md:border-t-0 md:border-l border-slate-850 pt-4 md:pt-0 md:pl-8 text-xs text-slate-400">
              <div className="flex items-center space-x-2.5">
                <User className="h-4 w-4 text-indigo-400" />
                <span>{customer.firstName} {customer.lastName}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="h-4 w-4 text-indigo-400" />
                <span className="truncate max-w-[180px]">{customer.email}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="h-4 w-4 text-indigo-400" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Calendar className="h-4 w-4 text-indigo-400" />
                <span>Member since {new Date(customer.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}</span>
              </div>
            </div>
          </section>
        )}

        {/* Summary Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Combined Balance" 
            value={formatCurrency(totalBalance)} 
            icon={<Wallet className="h-5 w-5" />} 
            trendColor="green"
            description="Net liquid assets"
          />
          <StatCard 
            title="Total Accounts" 
            value={accounts.length} 
            icon={<Briefcase className="h-5 w-5" />} 
            trendColor="neutral"
            description="Linked asset cards"
          />
          <StatCard 
            title="Active Accounts" 
            value={activeCount} 
            icon={<CheckCircle2 className="h-5 w-5" />} 
            trendColor="green"
            description="Authorized & operational"
          />
          <StatCard 
            title="Blocked Accounts" 
            value={blockedCount} 
            icon={<AlertTriangle className="h-5 w-5" />} 
            trendColor={blockedCount > 0 ? "red" : "neutral"}
            description="Flagged or frozen assets"
          />
        </section>

        {/* Grid Layout: Account Cards and Transaction Flow placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Account Cards Section (2/3 width on desktop) */}
          <section className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white tracking-tight">Your Assets & Cards</h2>
              <span className="text-xs bg-slate-900 text-slate-400 border border-slate-850 px-2.5 py-1 rounded">
                Live API sync
              </span>
            </div>

            {accounts.length === 0 ? (
              <div className="bg-slate-900/20 border border-dashed border-slate-850 p-12 rounded-2xl text-center text-slate-500 space-y-2">
                <p className="font-semibold text-slate-400 text-sm">No accounts found</p>
                <p className="text-xs">Select the reset options to initialize demo savings accounts.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {accounts.map(account => (
                  <AccountCard key={account.id} account={account} />
                ))}
              </div>
            )}
            {accounts.length > 0 && (
              <div className="pt-4">
                <TransactionHistory accounts={accounts} refreshTrigger={historyRefreshKey} />
              </div>
            )}
          </section>

          {/* Transfer Form Section (1/3 width on desktop) */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-white tracking-tight font-sans">Execution Desk</h2>
            <TransferForm accounts={accounts} onTransferSuccess={handleTransferSuccess} />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          &copy; {new Date().getFullYear()} Nexus Bank. Powered by Spring Boot and React JPA Concurrency Control.
        </div>
      </footer>
    </div>
  );
};
export default DashboardPage;
