const Web3 = require("web3");
const utils = require("./compile_utils");

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

async function getCurrentAccount() {
  const currentAccounts = await web3.eth.getAccounts();
  console.log("Unlocked account address: \t", currentAccounts[0]);
  return currentAccounts[0];
}
async function deployContract(contractData, sender) {
  const testContract = new web3.eth.Contract(contractData.abi);
  return testContract
    .deploy({
      arguments: ["1.0"],
      data: "0x" + contractData.bytecode
    })
    .send({
      from: sender,
      gas: 200000,
      gasPrice: 1
    })
    .then(function (contractInstance) {
      console.log(
        "Deployed contract Address: \t",
        contractInstance.options.address
      );
      return contractInstance;
    })
    .catch(function (err) {
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
      gas: 50000,
      gasPrice: 1
    })
    .then(function (res) {
      console.log("Add tx finalized in block: \t", res.blockNumber);
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
  // Compile contract
  console.log("Compiling contract code...");
  const config = utils.createConfiguration();
  const compiled = utils.compileSources(config);
  utils.printCompileErrors(compiled);
  contractData = utils.getCounterContractData(compiled);
  if (contractData == undefined) {
    console.log("could not retrieve compiled contract data");
    process.exit();
  }

  // Deploy and interact with accounts on node
  const sender = await getCurrentAccount();
  console.log("Deploying contract...");
  const contract = await deployContract(contractData, sender);
  let counter = await getContractCounter(contract);
  console.log("Counter pre increment is: \t", counter);
  console.log("Sending add transaction...");
  await contractAdd(contract, sender);
  counter = await getContractCounter(contract);
  console.log("Counter post increment is: \t", counter);
}

run()
