// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PoWExample {
    uint256 public nonce;
    bytes32 public currentHash;

    constructor() {
        nonce = 0;
        currentHash = keccak256(abi.encodePacked(nonce));
    }

    function mine(uint256 difficulty) public {
        while (uint256(currentHash) >= difficulty) {
            nonce++;
            currentHash = keccak256(abi.encodePacked(nonce));
        }
    }
}
