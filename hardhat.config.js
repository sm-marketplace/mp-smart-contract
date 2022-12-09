require('dotenv').config()
require('dotenv-defaults').config()

/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-waffle");

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    localnet: {
      url: `http://127.0.0.1:3000`, // 
      accounts: [ '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' ] // Private key
    },
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

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();


  for (const account of accounts) {
    console.log(account);
  }
});

task("wallet", "Prints wallet", async (taskArgs, hre) => {
  const wallet = await hre.ethers.getSigner();

  console.log(wallet);

  // for (const account of accounts) {
  //   console.log(account);
  // }
});