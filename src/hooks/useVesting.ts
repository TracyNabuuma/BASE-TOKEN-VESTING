import { useState, useEffect, useCallback } from 'react';
import { createPublicClient, createWalletClient, custom, http, parseEther, formatEther } from 'viem';
import { base, baseGoerli } from 'viem/chains';
import { useWeb3 } from '../contexts/Web3Context';
import { VESTING_CONTRACT_ADDRESS, VESTING_CONTRACT_ABI, MOCK_VESTING_DATA } from '../config/constants';

type VestingSchedule = {
  totalAmount: string;
  vestedAmount: string;
  claimableAmount: string;
  claimedAmount: string;
  nextUnlockDate: Date;
  startTime: Date;
  endTime: Date;
  percentVested: number;
  tokenSymbol: string;
};

const useMockData = true; // Set to false to use actual contract data

export const useVesting = () => {
  const { isConnected, address, chainId, isCorrectNetwork } = useWeb3();
  const [vestingData, setVestingData] = useState<VestingSchedule | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const fetchVestingData = useCallback(async () => {
    if (!isConnected || !address || !isCorrectNetwork) return;
    
    setIsLoading(true);
    setError(null);

    try {
      if (useMockData) {
        // Use mock data for demonstration
        const {
          totalTokens,
          vestedTokens,
          claimedTokens,
          nextUnlockDate,
          claimableAmount,
          vestingSchedule
        } = MOCK_VESTING_DATA;

        setVestingData({
          totalAmount: totalTokens.toString(),
          vestedAmount: vestedTokens.toString(),
          claimableAmount: claimableAmount.toString(),
          claimedAmount: claimedTokens.toString(),
          nextUnlockDate,
          startTime: vestingSchedule.startDate,
          endTime: vestingSchedule.endDate,
          percentVested: (vestedTokens / totalTokens) * 100,
          tokenSymbol: vestingSchedule.tokenSymbol
        });
      } else {
        // Create client for interacting with the blockchain
        const chain = chainId === 8453 ? base : baseGoerli;
        const client = createPublicClient({
          chain,
          transport: http()
        });

        // Get vesting data from contract
        const [vestedAmount, totalVested, scheduleData] = await Promise.all([
          client.readContract({
            address: VESTING_CONTRACT_ADDRESS as `0x${string}`,
            abi: VESTING_CONTRACT_ABI,
            functionName: 'vestedAmount',
            args: [address]
          }),
          client.readContract({
            address: VESTING_CONTRACT_ADDRESS as `0x${string}`,
            abi: VESTING_CONTRACT_ABI,
            functionName: 'getTotalVestedAmount',
            args: [address]
          }),
          client.readContract({
            address: VESTING_CONTRACT_ADDRESS as `0x${string}`,
            abi: VESTING_CONTRACT_ABI,
            functionName: 'getVestingSchedule',
            args: [address]
          })
        ]);

        const nextUnlockTimestamp = await client.readContract({
          address: VESTING_CONTRACT_ADDRESS as `0x${string}`,
          abi: VESTING_CONTRACT_ABI,
          functionName: 'getNextUnlockDate',
          args: [address]
        });

        // Format the data
        const formattedData: VestingSchedule = {
          totalAmount: scheduleData.totalAmount.toString(),
          vestedAmount: totalVested.toString(),
          claimableAmount: vestedAmount.toString(),
          claimedAmount: scheduleData.claimedAmount.toString(),
          nextUnlockDate: new Date(Number(nextUnlockTimestamp) * 1000),
          startTime: new Date(Number(scheduleData.startTime) * 1000),
          endTime: new Date(Number(scheduleData.endTime) * 1000),
          percentVested: (Number(totalVested) / Number(scheduleData.totalAmount)) * 100,
          tokenSymbol: 'BASE' // This would be fetched from a token contract in a real implementation
        };

        setVestingData(formattedData);
      }
    } catch (err: any) {
      console.error('Failed to fetch vesting data:', err);
      setError('Failed to fetch vesting data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address, chainId, isCorrectNetwork]);

  useEffect(() => {
    fetchVestingData();
  }, [fetchVestingData]);

  const claimTokens = async () => {
    if (!isConnected || !address || !isCorrectNetwork || !window.ethereum) {
      setError('Please connect your wallet to the Base network first.');
      return;
    }

    setIsClaiming(true);
    setError(null);
    setTxHash(null);

    try {
      if (useMockData) {
        // Simulate a transaction for demonstration
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Update the mock data
        const updatedVestedTokens = MOCK_VESTING_DATA.vestedTokens;
        const updatedClaimedTokens = MOCK_VESTING_DATA.claimedTokens + MOCK_VESTING_DATA.claimableAmount;
        
        setVestingData(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            claimableAmount: '0',
            claimedAmount: updatedClaimedTokens.toString(),
            percentVested: (updatedVestedTokens / MOCK_VESTING_DATA.totalTokens) * 100
          };
        });
        
        setTxHash('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef');
      } else {
        // Create a wallet client
        const chain = chainId === 8453 ? base : baseGoerli;
        const walletClient = createWalletClient({
          chain,
          transport: custom(window.ethereum)
        });
        
        // Send the transaction
        const hash = await walletClient.writeContract({
          address: VESTING_CONTRACT_ADDRESS as `0x${string}`,
          abi: VESTING_CONTRACT_ABI,
          functionName: 'claim',
          account: address as `0x${string}`
        });
        
        setTxHash(hash);
        
        // Refresh vesting data after transaction confirmation
        const publicClient = createPublicClient({
          chain,
          transport: http()
        });
        
        await publicClient.waitForTransactionReceipt({ hash });
        fetchVestingData();
      }
    } catch (err: any) {
      console.error('Failed to claim tokens:', err);
      setError(err.message || 'Failed to claim tokens. Please try again later.');
    } finally {
      setIsClaiming(false);
    }
  };

  const refreshData = () => {
    fetchVestingData();
  };

  return {
    vestingData,
    isLoading,
    error,
    isClaiming,
    txHash,
    claimTokens,
    refreshData,
    useMockData
  };
};