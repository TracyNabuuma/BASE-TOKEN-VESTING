import React from 'react';
import { ExternalLink, RotateCw } from 'lucide-react';
import { formatDate, formatTokenAmount } from '../utils/formatters';

type Transaction = {
  id: string;
  timestamp: Date;
  type: string;
  amount: string;
  hash: string;
  url: string;
};

type TransactionHistoryProps = {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  tokenSymbol: string;
};

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  isLoading,
  error,
  onRefresh,
  tokenSymbol
}) => {
  return (
    <div className="glass-card p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Transaction History</h2>
        <button 
          onClick={onRefresh} 
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-base-navy-light transition-colors"
          aria-label="Refresh transaction history"
        >
          <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {error && (
        <div className="p-4 text-sm text-error border border-error-light bg-error-light/10 rounded-lg">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4">
              <div className="h-3 bg-gray-200 dark:bg-base-navy-light rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-base-navy-light rounded"></div>
                <div className="h-3 bg-gray-200 dark:bg-base-navy-light rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      ) : transactions.length === 0 ? (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
          <p>No transactions found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-base-navy-light">
                <th className="py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                <th className="py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Type</th>
                <th className="py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Amount</th>
                <th className="py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400"></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr 
                  key={tx.id} 
                  className="border-b border-gray-100 dark:border-base-navy-light hover:bg-gray-50 dark:hover:bg-base-navy-light/50 transition-colors"
                >
                  <td className="py-4 text-sm">{formatDate(tx.timestamp)}</td>
                  <td className="py-4 text-sm">{tx.type}</td>
                  <td className="py-4 text-sm text-right">{formatTokenAmount(tx.amount)} {tokenSymbol}</td>
                  <td className="py-4 text-right">
                    <a
                      href={tx.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-base-blue text-sm hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};