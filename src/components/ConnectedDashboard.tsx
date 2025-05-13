import React from 'react';
import { useVesting } from '../hooks/useVesting';
import { useTransactionHistory } from '../hooks/useTransactionHistory';
import { VestingProgress } from './VestingProgress';
import { ClaimCard } from './ClaimCard';
import { TransactionHistory } from './TransactionHistory';
import { Loader2 } from 'lucide-react';

export const ConnectedDashboard: React.FC = () => {
  const { 
    vestingData, 
    isLoading: isLoadingVesting, 
    error: vestingError, 
    isClaiming, 
    txHash, 
    claimTokens, 
    refreshData 
  } = useVesting();
  
  const {
    transactions,
    isLoading: isLoadingHistory,
    error: historyError,
    refreshHistory
  } = useTransactionHistory();
  
  if (isLoadingVesting && !vestingData) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-base-blue animate-spin mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Loading vesting data...</p>
      </div>
    );
  }
  
  if (vestingError && !vestingData) {
    return (
      <div className="glass-card p-8 my-8 mx-auto max-w-lg">
        <div className="text-center text-error">
          <p className="text-lg font-medium mb-4">Error Loading Data</p>
          <p className="mb-6">{vestingError}</p>
          <button className="btn-primary" onClick={refreshData}>
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  if (!vestingData) {
    return (
      <div className="glass-card p-8 my-8 mx-auto max-w-lg">
        <div className="text-center">
          <p className="text-lg font-medium mb-4">No Vesting Data Found</p>
          <p className="mb-6">This wallet address doesn't have any vesting schedule.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <VestingProgress
        totalAmount={vestingData.totalAmount}
        vestedAmount={vestingData.vestedAmount}
        claimableAmount={vestingData.claimableAmount}
        claimedAmount={vestingData.claimedAmount}
        percentVested={vestingData.percentVested}
        nextUnlockDate={vestingData.nextUnlockDate}
        tokenSymbol={vestingData.tokenSymbol}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ClaimCard
            claimableAmount={vestingData.claimableAmount}
            tokenSymbol={vestingData.tokenSymbol}
            onClaim={claimTokens}
            isClaiming={isClaiming}
            txHash={txHash}
            error={vestingError}
          />
        </div>
        
        <div className="lg:col-span-2">
          <TransactionHistory
            transactions={transactions}
            isLoading={isLoadingHistory}
            error={historyError}
            onRefresh={refreshHistory}
            tokenSymbol={vestingData.tokenSymbol}
          />
        </div>
      </div>
    </div>
  );
};