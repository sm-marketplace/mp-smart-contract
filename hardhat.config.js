require('dotenv').config()
require('dotenv-defaults').config()

/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-waffle");

const ACCOUNT_SECRET_KEY = process.env.ACCOUNT_SECRET_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
const GOERLI_URL = process.env.ALCHEMY_API_KEY? 
  `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}` :
  'https://rpc.ankr.com/eth_goerli'


module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    localnet: {
      url: `http://127.0.0.1:3000`, 
      accounts: [ ACCOUNT_SECRET_KEY ]
    },
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: "https://rpc-mumbai.matic.today",
      accounts: [ ACCOUNT_SECRET_KEY ]
    },
    goerli: {
      // url: "",
      url: GOERLI_URL,
      accounts: [ ACCOUNT_SECRET_KEY ]
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

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();


  for (const account of accounts) {
    console.log(account);
  }
});
