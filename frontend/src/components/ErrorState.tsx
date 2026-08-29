import React, { useState } from 'react';
import { AlertCircle, RefreshCw, DatabaseBackup, Loader2 } from 'lucide-react';
import { customerService } from '../services/customerService';
import { accountService } from '../services/accountService';

interface ErrorStateProps {
  message: string;
  isNotFound?: boolean;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, isNotFound = false, onRetry }) => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedError, setSeedError] = useState<string | null>(null);

  const handleSeedData = async () => {
    setIsSeeding(true);
    setSeedError(null);
    try {
      const customer = await customerService.createCustomer({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@nexusbank.com',
        phone: '+64 21 000 0000'
      });

      await accountService.createAccount({
        customerId: customer.id,
        accountType: 'SAVINGS',
        initialBalance: 5000.00
      });

      await accountService.createAccount({
        customerId: customer.id,
        accountType: 'CURRENT',
        initialBalance: 12500.00
      });

      onRetry();
    } catch (err: any) {
      setSeedError(err.message || 'Failed to seed demo data. Please verify backend status.');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-8 max-w-lg mx-auto text-center space-y-6 shadow-2xl backdrop-blur-md">
      <div className="inline-flex bg-rose-500/10 p-4 rounded-full text-rose-500 border border-rose-500/20">
        <AlertCircle className="h-10 w-10" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white">
          {isNotFound ? 'Demo Customer Not Found' : 'An Error Occurred'}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed font-sans">
          {isNotFound
            ? 'The database currently contains no customer records. You can automatically initialize a default demo customer and accounts using the button below.'
            : message}
        </p>
      </div>

      {seedError && (
        <p className="text-xs text-rose-400 font-semibold bg-rose-950/20 border border-rose-900/40 p-3 rounded-lg">
          {seedError}
        </p>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onRetry}
          disabled={isSeeding}
          className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-slate-300 hover:text-white px-5 py-3 rounded-xl border border-slate-800 transition-colors flex items-center justify-center space-x-2 text-sm cursor-pointer w-full sm:w-auto"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Retry Connection</span>
        </button>

        {isNotFound && (
          <button
            onClick={handleSeedData}
            disabled={isSeeding}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold px-5 py-3 rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all flex items-center justify-center space-x-2 text-sm cursor-pointer w-full sm:w-auto"
          >
            {isSeeding ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Initializing Database...</span>
              </>
            ) : (
              <>
                <DatabaseBackup className="h-4 w-4" />
                <span>Seed Demo Data</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
export default ErrorState;
