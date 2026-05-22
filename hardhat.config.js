require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.20", // Changed from 0.8.19 to 0.8.20
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Local Hardhat network (for testing)
    hardhat: {
      chainId: 1337,
    },
    // Localhost (when running npx hardhat node)
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    // SCAI Mainnet
    sepolia: {
  url: "https://ethereum-sepolia-rpc.publicnode.com",
  accounts: process.env.MAINNET_PRIVATE_KEY ? [process.env.MAINNET_PRIVATE_KEY] : [],
  chainId: 11155111,
},
  },
  // For contract verification on SCAI Explorer
  etherscan: {
    apiKey: {
      scai: "dummy",
    },
    customChains: [
      {
        network: "scai",
        chainId: 34,
        urls: {
          apiURL: "https://explorer.securechain.ai/api",
          browserURL: "https://explorer.securechain.ai",
        },
      },
    ],
  },
};