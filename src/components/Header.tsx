import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { WalletConnect } from './WalletConnect';
import { ThemeToggle } from './ThemeToggle';
import { Landmark } from 'lucide-react';
import baselogo from '../assets/BASE.png';

export const Header: React.FC = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <header className="sticky top-0 z-10 backdrop-blur-sm bg-white/90 dark:bg-base-navy/90 border-b border-gray-100 dark:border-base-navy-light transition-colors duration-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img className='h-8 w-8' src={baselogo} alt="Base logo" />
          {/* <Landmark className="w-8 h-8 text-base-blue" /> */}
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Base Vesting</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <WalletConnect />
        </div>
      </div>
    </header>
  );
};