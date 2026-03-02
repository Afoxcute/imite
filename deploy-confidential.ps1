# Deploy ConfidentialIPAsset to Flow EVM Testnet
# Requires DEPLOYER_PRIVATE_KEY set

if (-not $env:DEPLOYER_PRIVATE_KEY) {
    Write-Host "Error: DEPLOYER_PRIVATE_KEY not set" -ForegroundColor Red
    exit 1
}
Write-Host "Deploying ConfidentialIPAsset to Flow EVM Testnet..." -ForegroundColor Cyan
npx hardhat ignition deploy ignition/modules/ConfidentialIPAsset.ts --network flowTestnet
Write-Host ""
Write-Host "Next: Update app/src/deployed_addresses.json with ConfidentialIPAssetModule#ConfidentialIPAsset address" -ForegroundColor Yellow
