# Contract Redeployment Instructions

## Prerequisites

1. **Set your deployer private key** (the wallet that will deploy the contract):
   
   **PowerShell:**
   ```powershell
   $env:DEPLOYER_PRIVATE_KEY = "your_private_key_without_0x_prefix"
   ```
   
   **Or create a `.env` file** in the project root:
   ```
   DEPLOYER_PRIVATE_KEY=your_private_key_without_0x_prefix
   ```

2. **Ensure you have FLOW tokens** in your deployer wallet for gas fees on Flow EVM Testnet

## Step 2: Deploy the Contract

Navigate to the project root and run:

**PowerShell:**
```powershell
cd imite
npx hardhat ignition deploy ignition/modules/ModredIP.ts --network flowTestnet
```

**Or use the deployment script:**
```powershell
.\deploy.ps1
```

## Step 3: Update Contract Address

After deployment, you'll see output like:
```
✅ ModredIPModule#ModredIP deployed to: 0x...
```

1. **Copy the deployed contract address**

2. **Update `app/src/deployed_addresses.json`:**
   ```json
   {
     "ModredIPModule#ModredIP": "NEW_DEPLOYED_ADDRESS_HERE"
   }
   ```

3. **Also update `ignition/deployments/chain-545/deployed_addresses.json`** (optional, for reference)

## Step 4: Restart Services

1. **Restart your backend server** (if running)
2. **Refresh your frontend** (or restart the dev server)

## Verification

After deployment, verify the contract has the `unstake` function:

1. Visit: https://evm-testnet.flowscan.io/address/YOUR_NEW_CONTRACT_ADDRESS
2. Go to the "Contract" tab
3. Check for the `unstake` function in the "Write Contract" section

## Troubleshooting

### "already known" Error

If you get an `already known` error during deployment, it means there's a pending transaction with the same nonce. Solutions:

1. **Wait for pending transactions to confirm:**
   - Check your deployer address on the explorer: https://evm-testnet.flowscan.io/address/YOUR_DEPLOYER_ADDRESS
   - Wait for any pending transactions to be confirmed (usually 1-2 minutes)
   - Then try deploying again

2. **Check nonce status:**
   ```powershell
   node check-nonce.js
   ```
   This will show if you have pending transactions.

3. **Wait and retry:**
   - Wait 2-3 minutes
   - Run the deployment command again

### Other Issues

- **"Missing env var DEPLOYER_PRIVATE_KEY"**: Make sure you set the environment variable before running the deploy command
- **"Insufficient funds"**: Make sure your deployer wallet has FLOW tokens for gas
- **Network errors**: Check your internet connection and that the Flow EVM RPC endpoint is accessible

## What Changed

The new contract includes:
- `unstake()` function - allows arbitrators to withdraw their stake
- `ArbitratorUnstaked` event - emitted when an arbitrator unstakes
- Safety check - prevents unstaking if assigned to active disputes

