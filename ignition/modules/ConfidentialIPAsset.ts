// ConfidentialIPAsset deployment for Flow EVM (or any EVM).
// From repo root: yarn deploy:confidential  OR  npx hardhat ignition deploy ./ignition/modules/ConfidentialIPAsset.ts --network flowTestnet

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ConfidentialIPAssetModule = buildModule("ConfidentialIPAssetModule", (m) => {
  const ConfidentialIPAsset = m.contract("ConfidentialIPAsset");
  return { ConfidentialIPAsset };
});

export default ConfidentialIPAssetModule;
