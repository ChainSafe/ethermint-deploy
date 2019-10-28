pragma solidity ^0.5.11;

contract Counter {
  uint256 counter = 5;

  function add() public {
    counter++;
  }

  function subtract() public {
    counter--;
  }

  function getCounter() public view returns (uint256) {
    return counter;
  }
}