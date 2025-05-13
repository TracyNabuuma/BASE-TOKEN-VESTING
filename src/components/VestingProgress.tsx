import React from 'react';
import { formatTokenAmount, formatDate, formatTimeRemaining } from '../utils/formatters';
import { Clock } from 'lucide-react';

type VestingProgressProps = {
  totalAmount: string;
  vestedAmount: string;
  claimableAmount: string;
  claimedAmount: string;
  percentVested: number;
  nextUnlockDate: Date | null;
  tokenSymbol: string;
};

export const VestingProgress: React.FC<VestingProgressProps> = ({
  totalAmount,
  vestedAmount,
  claimableAmount,
  claimedAmount,
  percentVested,
  nextUnlockDate,
  tokenSymbol
}) => {
  const percentClaimed = parseFloat(claimedAmount) / parseFloat(totalAmount) * 100;
  const percentClaimable = parseFloat(claimableAmount) / parseFloat(totalAmount) * 100;
  
  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h2 className="text-xl font-bold mb-2 md:mb-0">Vesting Progress</h2>
        <div className="flex items-center text-sm text-base-gray-dark dark:text-gray-300">
          <Clock className="w-4 h-4 mr-1" />
          <span>Next unlock in: {formatTimeRemaining(nextUnlockDate)}</span>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between text-sm mb-1">
          <span>Total Progress</span>
          <span className="font-medium">{percentVested.toFixed(2)}%</span>
        </div>
        <div className="h-4 w-full bg-gray-100 dark:bg-base-navy rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-base-blue to-base-blue-light"
            style={{ width: `${percentVested}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        <div className="flex-1">
          <h3 className="text-base font-semibold mb-4">Token Distribution</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Total Allocation</span>
              <span className="font-medium">{formatTokenAmount(totalAmount)} {tokenSymbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Vested to Date</span>
              <span className="font-medium">{formatTokenAmount(vestedAmount)} {tokenSymbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Claimed to Date</span>
              <span className="font-medium">{formatTokenAmount(claimedAmount)} {tokenSymbol}</span>
            </div>
            <div className="flex justify-between text-base-blue">
              <span className="font-medium">Available to Claim</span>
              <span className="font-medium">{formatTokenAmount(claimableAmount)} {tokenSymbol}</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-base font-semibold mb-4">Detailed Breakdown</h3>
          <div className="relative pt-1">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Claimed</span>
                  <span className="text-sm font-medium">{percentClaimed.toFixed(1)}%</span>
                </div>
                <div className="h-2.5 w-full bg-gray-100 dark:bg-base-navy rounded-full">
                  <div 
                    className="h-full bg-success rounded-full"
                    style={{ width: `${percentClaimed}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Available to Claim</span>
                  <span className="text-sm font-medium">{percentClaimable.toFixed(1)}%</span>
                </div>
                <div className="h-2.5 w-full bg-gray-100 dark:bg-base-navy rounded-full">
                  <div 
                    className="h-full bg-base-blue rounded-full"
                    style={{ width: `${percentClaimable}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Unvested</span>
                  <span className="text-sm font-medium">{(100 - percentVested).toFixed(1)}%</span>
                </div>
                <div className="h-2.5 w-full bg-gray-100 dark:bg-base-navy rounded-full">
                  <div 
                    className="h-full bg-base-gray-dark dark:bg-base-navy-light rounded-full"
                    style={{ width: `${100 - percentVested}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {nextUnlockDate && (
        <div className="border-t border-gray-100 dark:border-base-navy-light pt-4 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">Next unlock date:</span>
            <span className="text-sm font-medium">{formatDate(nextUnlockDate)}</span>
          </div>
        </div>
      )}
    </div>
  );
};