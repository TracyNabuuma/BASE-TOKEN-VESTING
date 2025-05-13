import { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { NETWORKS, BASE_CHAIN_ID, BASE_TESTNET_CHAIN_ID, VESTING_CONTRACT_ADDRESS } from '../config/constants';

type Transaction = {
  id: string;
  timestamp: Date;
  type: 'Claim' | 'Other';
  amount: string;
  hash: string;
  url: string;
};

// Mock transaction data for demonstration
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 86400000 * 30), // 30 days ago
    type: 'Claim',
    amount: '5000',
    hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    url: 'https://basescan.org/tx/0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 86400000 * 60), // 60 days ago
    type: 'Claim',
    amount: '10000',
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    url: 'https://basescan.org/tx/0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 86400000 * 90), // 90 days ago
    type: 'Claim',
    amount: '10000',
    hash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
    url: 'https://basescan.org/tx/0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba'
  }
];

export const useTransactionHistory = () => {
  const { isConnected, address, chainId, isCorrectNetwork } = useWeb3();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactionHistory = useCallback(async () => {
    if (!isConnected || !address || !isCorrectNetwork) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // In a real application, we would fetch transaction history from an indexer or Etherscan API
      // For this demo, we'll use mock data
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTransactions(MOCK_TRANSACTIONS);
    } catch (err: any) {
      console.error('Failed to fetch transaction history:', err);
      setError('Failed to fetch transaction history. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address, chainId, isCorrectNetwork]);

  useEffect(() => {
    fetchTransactionHistory();
  }, [fetchTransactionHistory]);

  const addTransaction = useCallback((tx: Omit<Transaction, 'id' | 'url'>) => {
    const blockExplorerUrl = chainId === BASE_CHAIN_ID 
      ? NETWORKS[BASE_CHAIN_ID].blockExplorerUrl
      : NETWORKS[BASE_TESTNET_CHAIN_ID].blockExplorerUrl;
    
    const newTransaction: Transaction = {
      ...tx,
      id: Date.now().toString(),
      url: `${blockExplorerUrl}/tx/${tx.hash}`
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
  }, [chainId]);

  const refreshHistory = () => {
    fetchTransactionHistory();
  };

  return {
    transactions,
    isLoading,
    error,
    addTransaction,
    refreshHistory
  };
};