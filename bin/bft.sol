// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BFTExample {
    // Example state variable
    uint256 public value;

    // Function to set value
    function setValue(uint256 _value) public {
        value = _value;
    }

    // Function to simulate BFT scenario
    function simulateBFT(uint256 _value) public {
        // Add your BFT logic here
        value = _value;
    }
}