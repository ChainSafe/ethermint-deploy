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
      gas: 200000,
      gasPrice: 1
    })
    .then(function(contractInstance) {
      console.log("Contract Address: ", contractInstance.options.address);
      return contractInstance;
    })
    .catch(function(err) {
      // Contract failed to deploy
      console.error(err);
      process.exit();
    });
}

async function contractAdd(contractInstance, sender) {
  return contractInstance.methods
    .add()
    .send({
      from: sender,
      gas: 400000,
      gasPrice: 1
    })
    .then(function(res) {
      console.log("Add transaction completed at block: ", res.blockNumber);
      return res;
    });
}

async function getContractCounter(contractInstance) {
  return contractInstance.methods
    .getCounter()
    .call()
    .catch(err => console.error(err));
}

async function run() {
  const sender = await getCurrentAccount();
  const contract = await deployContract(sender);
  // const counter = await getContractCounter(contract);
  // console.log("counter pre increment is: ", counter);
  await contractAdd(contract, sender);
  counter = await getContractCounter(contract);
  console.log("counter post increment is: ", counter);
}

run().then(() => console.log("done"));
