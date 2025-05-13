import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { base, baseGoerli } from 'viem/chains';
import { NETWORKS, BASE_CHAIN_ID, BASE_TESTNET_CHAIN_ID } from '../config/constants';

type Web3ContextType = {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  isCorrectNetwork: boolean;
  isConnecting: boolean;
  error: string | null;
  balance: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: () => Promise<void>;
};

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState('0');

  // Check if user is on Base network
  const isCorrectNetwork = chainId === BASE_CHAIN_ID || chainId === BASE_TESTNET_CHAIN_ID;

  // Initialize wallet connection if previously connected
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
            setAddress(accounts[0]);
            setChainId(parseInt(chainIdHex, 16));
            setIsConnected(true);
          }
        } catch (err) {
          console.error('Failed to check wallet connection:', err);
        }
      }
    };
    
    checkConnection();
  }, []);

  // Add event listeners for account and chain changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected
          setIsConnected(false);
          setAddress(null);
        } else {
          setAddress(accounts[0]);
          setIsConnected(true);
        }
      };

      const handleChainChanged = (chainIdHex: string) => {
        setChainId(parseInt(chainIdHex, 16));
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  // Fetch balance when connected and on correct network
  useEffect(() => {
    const fetchBalance = async () => {
      if (isConnected && address && isCorrectNetwork) {
        try {
          // Create a public client for the connected chain
          const chain = chainId === BASE_CHAIN_ID ? base : baseGoerli;
          const client = createPublicClient({
            chain,
            transport: http()
          });
          
          const balanceWei = await client.getBalance({ address: address as `0x${string}` });
          setBalance(balanceWei.toString());
        } catch (err) {
          console.error('Failed to fetch balance:', err);
        }
      }
    };
    
    fetchBalance();
  }, [isConnected, address, chainId, isCorrectNetwork]);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setError('No wallet detected. Please install Coinbase Wallet or MetaMask.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      
      setAddress(accounts[0]);
      setChainId(parseInt(chainIdHex, 16));
      setIsConnected(true);
    } catch (err: any) {
      console.error('Failed to connect wallet:', err);
      setError(err.message || 'Failed to connect to wallet');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setIsConnected(false);
    setAddress(null);
    setChainId(null);
  }, []);

  // Switch network to Base
  const switchNetwork = useCallback(async () => {
    if (!window.ethereum) {
      setError('No wallet detected. Please install Coinbase Wallet or MetaMask.');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${BASE_CHAIN_ID.toString(16)}` }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${BASE_CHAIN_ID.toString(16)}`,
                chainName: NETWORKS[BASE_CHAIN_ID].name,
                nativeCurrency: {
                  name: 'Ethereum',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: [NETWORKS[BASE_CHAIN_ID].rpcUrl],
                blockExplorerUrls: [NETWORKS[BASE_CHAIN_ID].blockExplorerUrl]
              },
            ],
          });
        } catch (addError) {
          setError('Failed to add Base network to your wallet');
        }
      } else {
        setError('Failed to switch to Base network');
      }
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{
        isConnected,
        address,
        chainId,
        isCorrectNetwork,
        isConnecting,
        error,
        balance,
        connectWallet,
        disconnectWallet,
        switchNetwork
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

// Type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}