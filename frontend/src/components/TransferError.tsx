import React from 'react';
import { XOctagon } from 'lucide-react';

interface TransferErrorProps {
  error: any;
  onDismiss: () => void;
}

export const TransferError: React.FC<TransferErrorProps> = ({ error, onDismiss }) => {
  const getErrorMessage = () => {
    if (!error) return 'An unexpected error occurred.';

    if (error.response && error.response.data) {
      const data = error.response.data;
      const status = error.response.status;

      const title = data.title || '';
      const detail = data.detail || '';
      const type = data.type || '';

      if (type.includes('insufficient-balance') || title === 'Insufficient Balance') {
        return 'You do not have enough balance to complete this transfer.';
      }
      if (type.includes('account-blocked') || title === 'Account Blocked') {
        return 'Transfer cannot be completed because one of the accounts is blocked.';
      }
      if (type.includes('concurrent-modification') || title === 'Concurrent Modification' || status === 409) {
        return 'The account was updated concurrently by another transaction. Please try again.';
      }
      if (type.includes('validation-failed') || title === 'Bad Request') {
        if (data.invalidParams) {
          const params = Object.values(data.invalidParams).join(', ');
          return `Validation failed: ${params}`;
        }
        return detail || 'Source and destination accounts must be different or inputs are invalid.';
      }

      return detail || title || 'An error occurred on the server.';
    }

    if (typeof error === 'string') {
      return error;
    }

    return error.message || 'Something went wrong while processing the transfer. Please try again.';
  };

  const message = getErrorMessage();

  return (
    <div className="bg-rose-950/40 border border-rose-900/50 p-5 rounded-2xl space-y-4 shadow-xl font-sans">
      <div className="flex items-start space-x-3.5 text-rose-200">
        <div className="bg-rose-500/10 p-2 rounded-xl text-rose-500 border border-rose-500/20 flex-shrink-0">
          <XOctagon className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white">Transfer Failed</h4>
          <p className="text-xs text-rose-300/90 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <button
          onClick={onDismiss}
          className="text-xs bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 hover:text-white px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          Modify Transfer details
        </button>
      </div>
    </div>
  );
};
export default TransferError;
