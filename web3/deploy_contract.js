const Web3 = require("web3");
const fs = require("fs");

// const web3 = new Web3(
//   new Web3.providers.HttpProvider("http://127.0.0.1:7545")
// );
const web3 = new Web3(
  new Web3.providers.HttpProvider("http://localhost:8545/rpc")
);

const contract = fs.readFileSync("./contracts/build/Counter.bin").toString();
const abiData = fs.readFileSync("./contracts/build/Counter.abi").toString();

const ABI = JSON.parse(abiData);

const testContract = new web3.eth.Contract(ABI);

async function getCurrentAccount() {
  const currentAccounts = await web3.eth.getAccounts();
  console.log("Unlocked account address: " + currentAccounts[0]);
  return currentAccounts[0];
}
async function deployContract(account) {
  return testContract
    .deploy({
      arguments: ["1.0"],
      data: "0x" + contract
    })
    .send({
      from: account,
      gas: 470000,
      gasPrice: 20
    })
    .then(function(contractInstance) {
      console.log("Contract Address: ", contractInstance.options.address);
      return contractInstance;
    })
    .catch(err => console.log(err));
}

async function contractAdd(contractInstance, sender) {
  return contractInstance.methods
    .add()
    .send({
      from: sender,
      gas: 400000,
      gasPrice: 10
    })
    .then(function(res) {
      console.log("Add transaction completed at block: ", res.blockNumber)
      return res;
    });
}

async function getContractCounter(contractInstance) {
  return contractInstance.methods
    .getCounter()
    .call()
    .catch(err => console.log(err));
}

async function run() {
  const sender = await getCurrentAccount();
  const contract = await deployContract(sender);
  await contractAdd(contract, sender);
  const counter = await getContractCounter(contract);
  console.log("counter is: ", counter);
}

run().then(() => console.log("done"));
