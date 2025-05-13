import React from 'react';

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="mt-auto py-6 px-4 text-center text-sm text-gray-500 dark:text-gray-400">
      <div className="container mx-auto">
        <p>&copy; {year} Base Token Vesting Platform. All rights reserved.</p>
      </div>
    </footer>
  );
};