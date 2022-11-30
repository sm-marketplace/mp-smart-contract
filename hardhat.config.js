require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-waffle");

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      // Infura
      url: "https://rpc-mumbai.matic.today",
      accounts: [process.env.ACCOUNT_SECRET_KEY]
    },
    goerli: {
      // url: "https://rpc.ankr.com/eth_goerli",
      url: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.ACCOUNT_SECRET_KEY]
    }
    // ...other networks
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
