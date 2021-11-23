const Web3 = require("web3");
const web3 = new Web3("http://localhost:8545");

const contractData = require("../build/contracts/StableCoin.json");
const abi = contractData.abi;
var contractAddress = "0xB652d956A8045C24D26B499FE024732cAd1B4E19";

var myContract = new web3.eth.Contract(abi, contractAddress);
myContract.methods.totalSupply().call().then(console.log)