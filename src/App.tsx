import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Web3Provider } from './contexts/Web3Context';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WelcomeCard } from './components/WelcomeCard';
import { ConnectedDashboard } from './components/ConnectedDashboard';
import { useWeb3 } from './contexts/Web3Context';

const Dashboard = () => {
  const { isConnected, isCorrectNetwork } = useWeb3();
  
  return (
    <div className="container mx-auto px-4 py-8">
      {(!isConnected || !isCorrectNetwork) ? (
        <WelcomeCard />
      ) : (
        <ConnectedDashboard />
      )}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Web3Provider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <Dashboard />
          <Footer />
        </div>
      </Web3Provider>
    </ThemeProvider>
  );
}

export default App;