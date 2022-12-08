const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const SMMarketplace = await hre.ethers.getContractFactory("SMMarketplace");
  const smMarketplace = await SMMarketplace.deploy();
  await smMarketplace.deployed();
  console.log("Deployed to:", smMarketplace.address);

  const artifact = {
    network: hre.network.name,
    address: smMarketplace.address
  };

  fs.writeFileSync('./contract-address.json', JSON.stringify(artifact));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

  