// Network Configuration
export const BASE_CHAIN_ID = 8453;
export const BASE_TESTNET_CHAIN_ID = 84531;

export const NETWORKS = {
  [BASE_CHAIN_ID]: {
    name: 'Base',
    rpcUrl: 'https://mainnet.base.org',
    blockExplorerUrl: 'https://basescan.org',
    iconUrl: '/base-icon.svg'
  },
  [BASE_TESTNET_CHAIN_ID]: {
    name: 'Base Goerli',
    rpcUrl: 'https://goerli.base.org',
    blockExplorerUrl: 'https://goerli.basescan.org',
    iconUrl: '/base-icon.svg'
  }
};

// Contract Configuration
export const VESTING_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000'; // Replace with actual contract address

export const VESTING_CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "beneficiary",
        "type": "address"
      }
    ],
    "name": "vestedAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "beneficiary",
        "type": "address"
      }
    ],
    "name": "getNextUnlockDate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "beneficiary",
        "type": "address"
      }
    ],
    "name": "getTotalVestedAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "beneficiary",
        "type": "address"
      }
    ],
    "name": "getVestingSchedule",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "totalAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "startTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "endTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "claimedAmount",
            "type": "uint256"
          }
        ],
        "internalType": "struct VestingContract.VestingSchedule",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const MOCK_VESTING_DATA = {
  totalTokens: 100000,
  vestedTokens: 45000,
  claimedTokens: 25000,
  nextUnlockDate: new Date(Date.now() + 86400000 * 7), // 7 days from now
  claimableAmount: 20000,
  vestingSchedule: {
    startDate: new Date(Date.now() - 86400000 * 90), // 90 days ago
    endDate: new Date(Date.now() + 86400000 * 275), // 275 days from now
    totalDuration: 365, // days
    tokenSymbol: 'BASE',
    tokenDecimals: 18
  }
};