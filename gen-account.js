var Web3 = require("web3");

const net = 'http://localhost:8545'

var web3 = new Web3(net); // your geth
var account = web3.eth.accounts.create();