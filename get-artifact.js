
const json = require('./artifacts/contracts/SMMarketplace.sol/SMMarketplace.json'); // build artifact
const { network, address } = require('./deploy/deploy-artifact.json'); // deploy artifact

const artifact = {
  network, address, json
}

console.log(JSON.stringify(artifact));
