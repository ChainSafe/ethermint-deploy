# Ethermint web3 deploy starter code

Starter contract, deployment, and interaction with contract through web3 for a running Ethermint node. This is not exclusive to an Ethermint node, and can be used on any Ethereum node with the web3 api enabled and an unlocked key. 

Ethermint can be found here: https://github.com/ChainSafe/ethermint

## Installation

```
yarn install
```

## Usage

> Deploy contract to node
```
yarn start
```

## Running an Ethermint node to run against

Clone Ethermint repository:
```
git clone https://github.com/ChainSafe/ethermint.git
cd ethermint
```

To start the node and RPC server, follow the `README.md` at https://github.com/ChainSafe/ethermint
> Start instructions have changed slightly to use the OS keyring since the Getting started video