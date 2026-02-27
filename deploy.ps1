# Contract Deployment Script for Flow EVM Testnet (PowerShell)
# Make sure you have DEPLOYER_PRIVATE_KEY set in your environment

Write-Host "🚀 Deploying contract to Flow EVM Testnet..." -ForegroundColor Cyan
Write-Host ""

# Check if DEPLOYER_PRIVATE_KEY is set
if (-not $env:DEPLOYER_PRIVATE_KEY) {
    Write-Host "❌ Error: DEPLOYER_PRIVATE_KEY not set" -ForegroundColor Red
    Write-Host "Please set it in your environment or .env file:"
    Write-Host "  `$env:DEPLOYER_PRIVATE_KEY = 'your_private_key_here'"
    exit 1
}

Write-Host "✅ Deployer private key found" -ForegroundColor Green
Write-Host ""

# Deploy the contract
Write-Host "📦 Deploying contract..." -ForegroundColor Yellow
npx hardhat ignition deploy ignition/modules/ModredIP.ts --network flowTestnet

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Copy the deployed contract address from the output above"
Write-Host "2. Update app/src/deployed_addresses.json with the new address:"
Write-Host "   `"ModredIPModule#ModredIP`": `"NEW_ADDRESS_HERE`""
Write-Host "3. Restart your backend and frontend"
Write-Host ""
