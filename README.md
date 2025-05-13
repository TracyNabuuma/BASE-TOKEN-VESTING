# Base Token Vesting Dashboard

A modern, responsive dashboard for monitoring and claiming vested tokens on the Base network (Coinbase's L2).

## Features

- Wallet connection with Base network detection (chain ID 8453)
- Vesting progress visualization with interactive progress bars
- Token claim functionality with real-time updates
- Transaction history with Etherscan integration
- Dark/light mode toggle
- Mobile-responsive design

## Technology Stack

- React + TypeScript
- Tailwind CSS for styling
- Wagmi/viem for Ethereum interaction
- Coinbase Wallet SDK + MetaMask support

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with your Base RPC URL (optional):

```
VITE_BASE_RPC_URL=https://mainnet.base.org
```

4. Start the development server:

```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build locally

## Deployment

This app can be deployed to Vercel or Fleek with minimal configuration. The build output is in the `dist` directory.

## Smart Contract Integration

This dashboard is designed to work with a standard vesting contract that implements:

- `vestedAmount(address)` - Returns claimable tokens
- `claim()` - Transfers vested tokens to the user

Update the contract address and ABI in `src/config/constants.ts` to connect to your specific vesting contract.

## License

MIT