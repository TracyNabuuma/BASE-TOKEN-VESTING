import React from 'react';
import { formatTokenAmount } from '../utils/formatters';
import { CheckCircle2, AlertTriangle, ExternalLink, Loader2 } from 'lucide-react';

type ClaimCardProps = {
  claimableAmount: string;
  tokenSymbol: string;
  onClaim: () => Promise<void>;
  isClaiming: boolean;
  txHash: string | null;
  error: string | null;
  blockExplorerUrl?: string;
};

export const ClaimCard: React.FC<ClaimCardProps> = ({
  claimableAmount,
  tokenSymbol,
  onClaim,
  isClaiming,
  txHash,
  error,
  blockExplorerUrl = 'https://basescan.org/tx/'
}) => {
  const hasClaimableTokens = parseFloat(claimableAmount) > 0;
  
  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-bold mb-4">Claim {tokenSymbol} Tokens</h2>
      
      <div className="flex flex-col items-center py-6 border-y border-gray-100 dark:border-base-navy-light">
        <span className="text-sm text-gray-600 dark:text-gray-300 mb-2">Available to Claim</span>
        <div className="text-3xl font-bold">{formatTokenAmount(claimableAmount)} {tokenSymbol}</div>
      </div>
      
      <div className="mt-6">
        <button
          className="btn-primary w-full"
          onClick={onClaim}
          disabled={isClaiming || !hasClaimableTokens}
        >
          {isClaiming ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Claiming...
            </>
          ) : (
            `Claim ${tokenSymbol} Tokens`
          )}
        </button>
        
        {!hasClaimableTokens && !error && !txHash && (
          <p className="text-sm text-center mt-4 text-gray-500 dark:text-gray-400">
            You don't have any tokens available to claim at this time.
          </p>
        )}
        
        {error && (
          <div className="flex items-center justify-center mt-4 text-sm text-error">
            <AlertTriangle className="w-4 h-4 mr-1" />
            <span>{error}</span>
          </div>
        )}
        
        {txHash && (
          <div className="flex flex-col items-center mt-4">
            <div className="flex items-center text-sm text-success mb-2">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              <span>Transaction submitted successfully!</span>
            </div>
            <a 
              href={`${blockExplorerUrl}${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-base-blue flex items-center hover:underline"
            >
              View on BaseScan
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};