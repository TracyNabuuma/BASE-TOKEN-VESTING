import React from 'react';
import { Landmark, ChevronRight } from 'lucide-react';
import { useWeb3 } from '../contexts/Web3Context';

export const WelcomeCard: React.FC = () => {
  const { connectWallet, isConnecting } = useWeb3();
  
  return (
    <div className="glass-card p-8 my-8 mx-auto max-w-2xl">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-base-blue rounded-full flex items-center justify-center mb-6">
          <Landmark className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Base Token Vesting Dashboard</h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md">
          Connect your wallet to view your token vesting schedule and claim your vested tokens on Base network.
        </p>
        
        <button 
          className="btn-primary text-lg px-6 py-3"
          onClick={connectWallet}
          disabled={isConnecting}
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          <ChevronRight className="w-5 h-5 ml-1" />
        </button>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <Feature 
            title="View Schedule" 
            description="See your token vesting schedule and progress" 
          />
          <Feature 
            title="Claim Tokens" 
            description="Claim your vested tokens with a single click" 
          />
          <Feature 
            title="Track History" 
            description="View your transaction history and past claims" 
          />
        </div>
      </div>
    </div>
  );
};

type FeatureProps = {
  title: string;
  description: string;
};

const Feature: React.FC<FeatureProps> = ({ title, description }) => {
  return (
    <div className="p-4 border border-gray-100 dark:border-base-navy-light rounded-lg">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
};