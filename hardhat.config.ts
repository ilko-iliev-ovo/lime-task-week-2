import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import secrets from './secrets.json'

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    sepolia: {
      url: secrets.INFURA_SEPOLIA_URL,
      accounts: [secrets.PRIVATE_KEY],
    }
  },
};

export default config;
