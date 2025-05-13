import { formatEther } from 'viem';

export const formatTokenAmount = (amount: string | number, decimals = 18, showFullPrecision = false): string => {
  const amountStr = typeof amount === 'number' ? amount.toString() : amount;
  
  if (!amountStr || amountStr === '0') return '0';
  
  try {
    const formatted = formatEther(BigInt(amountStr));
    
    if (showFullPrecision) {
      return formatted;
    }
    
    // Display with 4 decimal places
    const value = parseFloat(formatted);
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4
    });
  } catch (error) {
    console.error('Error formatting token amount:', error);
    return amountStr;
  }
};

export const formatAddress = (address: string | null): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatDate = (date: Date | null): string => {
  if (!date) return 'N/A';
  
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatTimeRemaining = (targetDate: Date | null): string => {
  if (!targetDate) return 'N/A';
  
  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();
  
  if (diffMs <= 0) return 'Now';
  
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffDays > 0) {
    return `${diffDays}d ${diffHours}h`;
  } else if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m`;
  } else {
    return `${diffMinutes}m`;
  }
};