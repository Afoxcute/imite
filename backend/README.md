# Flow IP Management Backend

This backend service provides IP (Intellectual Property) management functionality on the Flow EVM testnet using the ModredIP smart contract.

## Features

- **IP Registration**: Register IP assets on Flow EVM testnet using ModredIP contract
- **License Minting**: Mint licenses for IP assets with customizable terms
- **License Validation**: Enforces one license per IP asset (prevents duplicate licenses)
- **IPFS Integration**: Upload metadata to IPFS for decentralized storage
- **Yakoa Integration**: Submit registered IPs to Yakoa for monitoring
- **Nonce Management**: Automatic retry logic with exponential backoff for transaction reliability
- **Error Handling**: Comprehensive error handling with user-friendly messages

## Environment Variables

Create a `.env` file in the backend directory:

```env
WALLET_PRIVATE_KEY=your_private_key_here
RPC_PROVIDER_URL=https://testnet.evm.nodes.onflow.org
NFT_CONTRACT_ADDRESS=optional_nft_contract_address
```

## API Endpoints

### IP Registration
- **POST** `/api/register`
- **Body**:
  ```json
  {
    "ipHash": "ipfs://Qm...",
    "metadata": "{\"name\":\"IP Asset Name\",\"description\":\"...\",...}",
    "isEncrypted": false,
    "imiteContractAddress": "0x2D0456CE5e446ef9C8f513832a0bd361201990Ab",
    "skipContractCall": false
  }
  ```
- **Response**: Returns transaction hash, IP asset ID, block number, and explorer URL
- **Note**: Use `imiteContractAddress` in the request body

### License Minting
- **POST** `/api/license/mint`
- **Body**:
  ```json
  {
    "tokenId": 1,
    "royaltyPercentage": 10,
    "duration": 86400,
    "commercialUse": true,
    "terms": "{\"transferable\":true,\"commercialAttribution\":true,...}",
    "imiteContractAddress": "0x2D0456CE5e446ef9C8f513832a0bd361201990Ab"
  }
  ```
- **Validation**: Automatically checks if a license already exists for the IP asset
- **Error**: Returns error if attempting to mint a second license for the same IP
- **Response**: Returns transaction hash, block number, and explorer URL

## Network Configuration

- **Network**: Flow EVM Testnet
- **Chain ID**: 545
- **RPC URL**: https://testnet.evm.nodes.onflow.org
- **Explorer**: https://evm-testnet.flowscan.io
- **Native Token**: FLOW (used as WIP_TOKEN_ADDRESS)

## Smart Contracts

- **ModredIP**: Main contract for IP registration and license management
- **ERC6551Registry**: Token-bound account registry
- **ERC6551Account**: Token-bound account implementation

## Installation

```bash
cd backend
yarn install
```

## Running the Server

```bash
yarn start
```

The server will start on port 5000 by default.

**Note**: The server uses `ts-node` to run TypeScript directly, so changes to source files are picked up automatically on restart.

## Transaction Reliability

The backend includes automatic retry logic for blockchain transactions:
- **Nonce Management**: Fetches current nonce (including pending transactions) before each transaction
- **Retry Logic**: Automatically retries up to 3 times on nonce conflicts with exponential backoff
- **Error Handling**: Provides clear error messages for transaction failures
- **Race Condition Protection**: Handles concurrent transaction requests gracefully

## Key Features

1. **Network**: Flow EVM Testnet (Chain ID: 545)
2. **Token**: Using native FLOW token for transactions
3. **Contracts**: ModredIP contract for IP management
4. **License Validation**: Enforces one license per IP asset
5. **Transaction Reliability**: Automatic retry with nonce management
6. **Error Handling**: Comprehensive error messages and recovery

## Recent Updates

- ✅ Application name: imite (contract key ModredIPModule#ModredIP retained for compatibility)
- ✅ API expects `imiteContractAddress` for register and license endpoints
- ✅ Storacha uploads are **client-side only**; backend does not perform Storacha uploads (returns 501 if called)
- ✅ License validation (one license per IP), nonce retry logic, V2 contract address 