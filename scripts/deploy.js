const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

const ARTIFACT_FILE = 'deploy/deploy-artifact.json'

async function main() {
  const SMMarketplace = await hre.ethers.getContractFactory("SMMarketplace");
  const smMarketplace = await SMMarketplace.deploy();
  await smMarketplace.deployed();
  console.log("Deployed to:", smMarketplace.address);

  const artifact = {
    network: hre.network.name,
    address: smMarketplace.address
  };

  ensureDirectoryExistence(ARTIFACT_FILE);
  fs.writeFileSync(ARTIFACT_FILE, JSON.stringify(artifact));
}

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

  