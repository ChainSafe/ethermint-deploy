const Web3 = require("web3");
const fs = require("fs");

const web3 = new Web3(
  new Web3.providers.HttpProvider("http://localhost:8545/rpc")
);

const contract = fs.readFileSync("./contracts/build/Counter.bin").toString();
const abiData = fs.readFileSync("./contracts/build/Counter.abi").toString();

const ABI = JSON.parse(abiData);

const testContract = new web3.eth.Contract(ABI);

async function getCurrentAccount() {
  const currentAccounts = await web3.eth.getAccounts();
  console.log("Unlocked account address: \t", currentAccounts[0]);
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
      console.log("Deployed contract Address: \t", contractInstance.options.address);
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
      gas: 30000,
      gasPrice: 1
    })
    .then(function(res) {
      console.log("Add transaction finalized in block: \t", res.blockNumber);
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
  let counter = await getContractCounter(contract);
  console.log("counter pre increment is: \t", counter);
  await contractAdd(contract, sender);
  counter = await getContractCounter(contract);
  console.log("counter post increment is: \t", counter);
}

run().then(() => console.log("done"));
