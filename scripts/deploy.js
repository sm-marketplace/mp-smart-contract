const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const SMMarketplace = await hre.ethers.getContractFactory("SMMarketplace");
  const smMarketplace = await SMMarketplace.deploy();
  await smMarketplace.deployed();
  console.log("Deployed to:", smMarketplace.address);

  fs.writeFileSync('./config.js', `
  export const marketplaceAddress = "${smMarketplace.address}"
  `)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

  