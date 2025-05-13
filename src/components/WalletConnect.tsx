import React from 'react';
import { Wallet, AlertTriangle } from 'lucide-react';
import { useWeb3 } from '../contexts/Web3Context';
import { formatAddress } from '../utils/formatters';

export const WalletConnect: React.FC = () => {
  const { 
    isConnected, 
    address, 
    isCorrectNetwork, 
    isConnecting, 
    error, 
    connectWallet, 
    disconnectWallet, 
    switchNetwork 
  } = useWeb3();

  if (!isConnected) {
    return (
      <button 
        className="btn-primary"
        onClick={connectWallet}
        disabled={isConnecting}
      >
        <Wallet className="w-4 h-4 mr-2" />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center text-sm text-error">
          <AlertTriangle className="w-4 h-4 mr-1" />
          <span>Wrong Network</span>
        </div>
        <button 
          className="btn-primary"
          onClick={switchNetwork}
        >
          Switch to Base
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="hidden md:flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
        <span className="text-sm">Connected</span>
      </div>
      <button 
        className="btn-secondary"
        onClick={disconnectWallet}
      >
        <Wallet className="w-4 h-4 mr-2" />
        {formatAddress(address)}
      </button>
    </div>
  );
};