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

Install Ethermint and bootstrap node (can configure if needed, just a starter):
```
make install 
rm -rf ~/.emint*
emintd init moniker --chain-id 8
emintcli config chain-id 8
emintcli config output json
emintcli config indent true
emintcli config trust-node true
echo "testpass" | emintcli keys add mykey
emintd add-genesis-account $(emintcli keys show mykey -a) 1000000000000000000photon,1000000000000000000stake
echo "testpass" | emintd gentx --name mykey
emintd collect-gentxs
emintd validate-genesis
emintd start --pruning=nothing

```

Now that the Ethermint keybase uses the Cosmos keybase, the command needed to retrieve the Ethereum
address from a cosmos one is:
```
emintcli keys parse <address>
```

and the bytes field can be used as an ethereum address.

To query just the field to be used inside of a command, `jq` can be used:

```
emintcli keys parse $(emintcli keys show mykey -a) | jq .bytes -r
```

> Note: if your gopath isn't configured correctly to use installed go binaries, use `make build` instead of make install, and replace all `emintcli` and `emintd` references to `./build/emintcli` and `./build/emintd` respectively

In another process, run:
```
echo "testpass" | emintcli rest-server --laddr "tcp://localhost:8545" --unlock-key mykey
```

And this will allow the script to run against the local web3 api server!