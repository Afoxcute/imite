# Contract Deployment Guide

## Current Contract Status

The application is currently using the V2 contract:
- **V2 Contract**: `0x2D0456CE5e446ef9C8f513832a0bd361201990Ab`
- **Contract Key**: `ModredIPModule#ModredIP` (maintained for compatibility)
- **Status**: ✅ Active and verified to have `registerIP` function

**Note**: The contract key name "ModredIPModule#ModredIP" is maintained for backward compatibility, but the application is branded as "imite".

## Option 2: Deploy a New Contract

### Prerequisites

1. Install dependencies:
   ```bash
   cd imite
   yarn install
   ```

2. Set up environment variable:
   Create a `.env` file or set:
   ```
   DEPLOYER_PRIVATE_KEY=your_private_key_here
   ```

### Deploy to Flow EVM Testnet

1. **Deploy using Hardhat Ignition:**
   ```bash
   npx hardhat ignition deploy ignition/modules/ModredIP.ts --network flowTestnet
   ```

2. **After deployment**, update `app/src/deployed_addresses.json`:
   ```json
   {
     "ModredIPModule#ModredIP": "NEW_DEPLOYED_ADDRESS_HERE",
     ...
   }
   ```
   
   **Note**: The key "ModredIPModule#ModredIP" is maintained for compatibility, but the application name is "imite".

3. **Verify the contract** (optional):
   ```bash
   npx hardhat verify --network flowTestnet DEPLOYED_ADDRESS "REGISTRY_ADDRESS" "ACCOUNT_IMPL_ADDRESS" 545 "PLATFORM_FEE_COLLECTOR"
   ```

### Deployment Steps

1. Make sure you have FLOW tokens in your deployer wallet for gas fees
2. Run the deployment command above
3. Copy the deployed contract address from the output
4. Update `deployed_addresses.json` with the new address
5. Restart your backend and frontend

## Option 3: Use Testing Mode (Temporary)

If you just want to test IPFS uploads without contract registration:

1. In `App.tsx` line ~1157, change:
   ```typescript
   skipContractCall: true
   ```

2. Or set environment variable in backend:
   ```
   SKIP_CONTRACT_CALL=true
   ```

## Verifying Contract Functions

To check if a contract has the `registerIP` function:

1. Visit: https://evm-testnet.flowscan.io/address/CONTRACT_ADDRESS
2. Go to the "Contract" tab
3. Check the "Read Contract" or "Write Contract" section
4. Look for `registerIP` function

## Contract Source

The contract source is at: `contracts/ModredIP.sol`

### Key Functions

**IP Registration:**
```solidity
function registerIP(
    string memory ipHash,
    string memory metadata,
    bool isEncrypted
) public returns (uint256)
```

**License Minting:**
```solidity
function mintLicense(
    uint256 tokenId,
    uint256 royaltyPercentage,
    uint256 duration,
    bool commercialUse,
    string memory terms
) public returns (uint256)
```

**Arbitrator Management:**
```solidity
function registerArbitrator() public payable
function unstake() public nonReentrant
```

## Contract Features

- ✅ IP Asset Registration with IPFS metadata
- ✅ License Management (one license per IP enforced)
- ✅ Revenue Distribution and Royalty Claims
- ✅ Dispute Resolution with Arbitration System
- ✅ Arbitrator Registration and Unstaking
- ✅ Reputation System for Arbitrators

## Troubleshooting

- **"already known" error**: Usually a pending transaction with the same nonce. Wait for pending tx to confirm on [Flow EVM Explorer](https://evm-testnet.flowscan.io/address/YOUR_DEPLOYER_ADDRESS), then retry.
- **Missing DEPLOYER_PRIVATE_KEY**: Set it in `.env` or in your shell before running the deploy command.
- **Insufficient funds**: Ensure the deployer wallet has FLOW tokens for gas on Flow EVM Testnet.
- **PowerShell**: You can use `.\deploy.ps1` from the repo root if available, or run the `npx hardhat ignition deploy ...` command directly.
