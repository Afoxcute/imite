import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-verify";
import type { HardhatUserConfig } from "hardhat/config";
import { vars } from "hardhat/config";

if (!vars.has("DEPLOYER_PRIVATE_KEY")) {
  console.error("Missing env var DEPLOYER_PRIVATE_KEY");
}

const deployerPrivateKey = vars.get("DEPLOYER_PRIVATE_KEY");

const config: HardhatUserConfig = {
  solidity: "0.8.24",

  networks: {
    flowTestnet: {
      url: "https://testnet.evm.nodes.onflow.org",
      accounts: [deployerPrivateKey],
      timeout: 120000, // 120 seconds
    },
  },
  etherscan: {
    apiKey: {
      flowTestnet: "YOU_CAN_COPY_ME",
    },
    customChains: [
      {
        network: "flowTestnet",
        chainId: 545,
        urls: {
          apiURL: "https://evm-testnet.flowscan.io/api",
          browserURL: "https://evm-testnet.flowscan.io",
        },
      },
    ],
  },
  sourcify: {
    // Disabled by default
    // Doesn't need an API key
    enabled: false,
  },
};

export default config;
