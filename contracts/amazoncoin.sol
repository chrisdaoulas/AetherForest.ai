// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.9.0; //^0.8.0;

contract AmazonasCoin {
    mapping(address => uint256) public tokenBalance;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => uint256) public carbonOffsets;

    uint256 public totalSupply;
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public tokenPrice;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event CID(string cid, uint256 timestamp);
    event Approval(address indexed owner, address indexed spender, uint256 value, uint256 timestamp);
    event TokensPurchased(address indexed buyer, uint256 amount, uint256 timestamp);
    event TokensSold(address indexed seller, uint256 amount, uint256 timestamp);
    event CarbonOffsetsClaimed(address indexed account, uint256 amount, uint256 timestamp);
    event PublicDeforestationAnalysis(string cid, string project, uint256 timestamp);

    constructor(
        string memory tokenName,
        string memory tokenSymbol,
        uint8 decimalUnits,
        uint256 initialSupply,
        uint256 pricePerToken
    ) {
        name = tokenName;
        symbol = tokenSymbol;
        decimals = decimalUnits;
        totalSupply = initialSupply * 10**uint256(decimalUnits);
        tokenPrice = pricePerToken;
        tokenBalance[msg.sender] = totalSupply;
    }

    function balanceOf(address account) external view returns (uint256) {
        return tokenBalance[account];
    }

    function carbonOffs(address account) external view returns (uint256) {
        return carbonOffsets[account];
    }

    function transfer(address to, uint256 value, string memory cid) external returns (bool) {
        require(to != address(0), "Invalid recipient address");
        require(value > 0, "Invalid token amount");
        require(tokenBalance[msg.sender] >= value, "Insufficient balance");

        tokenBalance[msg.sender] -= value;
        tokenBalance[to] += value;
	
        emit Transfer(msg.sender, to, value);
	emit CID(cid, block.timestamp);
        return true;
    }

    function deforestation_analysis(string memory cid, string memory project) external returns (bool) {

 	emit PublicDeforestationAnalysis(cid, project, block.timestamp);
        return true;

    }

    function approve(address spender, uint256 value) external returns (bool) {
        require(spender != address(0), "Invalid spender address");

        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value, block.timestamp);
        return true;
    }


//The Transfer from refers to beneficiaries, and the allowance has to do with maximum allowed volume of transfers to avoid fraud and kickbacks

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool) {

        require(from != address(0), "Invalid sender address");
        require(to != address(0), "Invalid recipient address");
        require(value > 0, "Invalid token amount");
        require(tokenBalance[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Insufficient allowance");

        tokenBalance[from] -= value;
        tokenBalance[to] += value;
        allowance[from][msg.sender] -= value;

        emit Transfer(from, to, value);
        return true;
    }

    function buyTokens(uint256 numberOfTokens) external payable {
        require(msg.value == numberOfTokens * tokenPrice, "Incorrect amount of Ether sent");
        require(numberOfTokens > 0, "Invalid token amount");
	
	uint256 tokensToTransfer = numberOfTokens;
        //uint256 tokensToTransfer = numberOfTokens * 10**uint256(decimals);
        require(tokenBalance[address(this)] >= tokensToTransfer, "Insufficient token balance");

        tokenBalance[address(this)] -= tokensToTransfer;
        tokenBalance[msg.sender] += tokensToTransfer;

        emit TokensPurchased(msg.sender, tokensToTransfer,block.timestamp);
    }

    function sellTokens(uint256 numberOfTokens) external {
        require(numberOfTokens > 0, "Invalid token amount");
        require(tokenBalance[msg.sender] >= numberOfTokens, "Insufficient balance");

	uint256 tokensToTransfer = numberOfTokens;
	//uint256 tokensToTransfer = numberOfTokens * 10**uint256(decimals);

        tokenBalance[msg.sender] -= tokensToTransfer;
        tokenBalance[address(this)] += tokensToTransfer;

        payable(msg.sender).transfer(numberOfTokens * tokenPrice);

        emit TokensSold(msg.sender, tokensToTransfer,block.timestamp);
    }

    function claimCarbonOffsets(uint256 amount) external {
        require(amount > 0, "Invalid carbon offset amount");
        require(tokenBalance[msg.sender] >= amount, "Insufficient balance");

        tokenBalance[msg.sender] -= amount;
        carbonOffsets[msg.sender] += amount;

        emit CarbonOffsetsClaimed(msg.sender, amount,block.timestamp);
    }
}