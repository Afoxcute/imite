"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomicfoundation/hardhat-toolbox-viem");
require("@nomicfoundation/hardhat-verify");
const config_1 = require("hardhat/config");
if (!config_1.vars.has("DEPLOYER_PRIVATE_KEY")) {
    console.error("Missing env var DEPLOYER_PRIVATE_KEY");
}
const deployerPrivateKey = config_1.vars.get("DEPLOYER_PRIVATE_KEY");
const config = {
    solidity: {
        version: "0.8.24",
        settings: {
            optimizer: {
                enabled: true,
                runs: 1,
            },
        },
    },
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
exports.default = config;
