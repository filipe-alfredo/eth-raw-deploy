const Web3 = require("web3");
const web3 = new Web3("http://localhost:8545");
const { Transaction } = require('ethereumjs-tx');

const fromAddress = "0xb996345de6e2a2Ae15906830FDa0C9340b9C2570";
const privateKey = Buffer.from("7818e46734be912cba40ce2f517c75d21f133dfd2ad8468c24a4eba41916fb50", "hex");
const contractJson = require("../build/contracts/StableCoin.json");
const abi = contractJson.abi;
const bytecode = contractJson.bytecode;
const contract = new web3.eth.Contract(abi);
const contractData = contract.deploy({data: bytecode, arguments: [999, "Filipe Token", "FILTOK"]}).encodeABI()

var rawTx = {
    data: contractData,
    from: fromAddress
};

var gasLimit = 0;
var gasPrice = 0;
var nonce = 0;
let promisGasPrice = web3.eth.getGasPrice().then(value => {
    gasPrice = web3.utils.toHex(value);
});
let promiseGas = web3.eth.estimateGas(rawTx).then(value => {
    gasLimit = web3.utils.toHex(value);
});
let promiseNonce = web3.eth.getTransactionCount(fromAddress, 'pending').then(value => {
    nonce = web3.utils.toHex(value);
});

Promise.all([promisGasPrice, promiseGas, promiseNonce]).then(() => {

    rawTx = {
        nonce,
        gasPrice,
        gasLimit,
        data: contractData,
        from: fromAddress
    };

    const tx = new Transaction(rawTx);
    tx.sign(privateKey);
    const serializedTx = tx.serialize();

    web3.eth.sendSignedTransaction(serializedTx.toString('hex'))
        .on('error', function (error) {
            console.log(error);
        })
        .on('transactionHash', function (transactionHash) {
            console.log(transactionHash);
        })
        .then(function (result) {
            console.log(result.contractAddress)
        });
});