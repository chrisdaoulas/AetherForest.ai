// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PoSExample {
    mapping(address => uint256) public stakes;
    address public validator;

    function stake() public payable {
        stakes[msg.sender] += msg.value;
    }

function selectValidator() public {
    uint256 highestStake = 0;
    address highestStaker;

    address[] memory stakers = new address[](stakes.length);
    uint256 counter = 0;
    for (address staker in stakes) {
        stakers[counter] = staker;
        counter++;
    }

    for (uint256 i = 0; i < stakers.length; i++) {
        address staker = stakers[i];
        if (stakes[staker] > highestStake) {
            highestStake = stakes[staker];
            highestStaker = staker;
        }
    }

    validator = highestStaker;
}
}