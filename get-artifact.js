
const json = require('./artifacts/contracts/SMMarketplace.sol/SMMarketplace.json');
const { network, address } = require('./contract-address.json');

const artifact = {
  network, address, json
}

console.log(JSON.stringify(artifact));
