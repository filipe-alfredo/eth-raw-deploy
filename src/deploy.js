const Web3 = require("web3");
const web3 = new Web3("http://localhost:8545");

const contractData = require("../build/contracts/StableCoin.json");
const abi = contractData.abi;
const bytecode = contractData.bytecode;
const contractParams = {
    data: bytecode,
    arguments: [777, "Filipe Token", "FILTOK"]
};
let myContract = new web3.eth.Contract(abi);

var gas = 0;
var gasPrice = 0;
let promisGasPrice = web3.eth.getGasPrice().then(value => {
    gasPrice = value;
});
let promiseGas = myContract.deploy(contractParams).estimateGas().then(value => {
    gas = value;
});

Promise.all([promisGasPrice, promiseGas]).then(() => {
    myContract.deploy(contractParams)
        .send({
            from: '0xb996345de6e2a2Ae15906830FDa0C9340b9C2570',
            gas,
            gasPrice
        })
        .on('error', function (error) {
            console.log(error);
        })
        .on('transactionHash', function (transactionHash) {
            console.log(transactionHash);
        })
        .then(function (newContractInstance) {
            console.log(newContractInstance.options.address)
        });
});