// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ModredIPModule = buildModule("ModredIPModule", (m) => {
  // Get the deployer account for platform fee collector
  const deployer = m.getAccount(0);

  // Deploy ERC-6551 Registry (no arguments needed)
  const registry = m.contract("ERC6551Registry");

  // Deploy Account Implementation for ERC-6551
  const accountImplementation = m.contract("ERC6551Account");

  // Add implementation to registry
  m.call(registry, "addImplementation", [accountImplementation]);

  // Deploy ModredIP contract with constructor arguments:
  // - registry address
  // - accountImplementation address
  // - chainId (545 for Flow EVM Testnet)
  // - platformFeeCollector address (using deployer)
  const ModredIPContract = m.contract("ModredIP", [
    registry,
    accountImplementation,
    545, // Flow EVM Testnet chain ID
    deployer // Platform fee collector
  ]);

  return { 
    ModredIPContract,
    registry,
    accountImplementation
  };
});

export default ModredIPModule; 