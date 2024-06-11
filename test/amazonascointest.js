const expect = import("chai")
const ethers = import("hardhat");

describe("AmazonasCoin", function () {
  let AmazonasCoin;
  let token;
  let signers;
  let deployer, user1, user2;


beforeEach(async function () {      
    const signers = await ethers.getSigners(); // Retrieve all signers
    [deployer, user1, user2] = signers; // Destructure the signers array   
    AmazonasCoin = await ethers.getContractFactory("AmazonasCoin");      
    //token = await AmazonasCoin.deploy("AmazonasCoin", "AMZ", 0, 1000000, ethers.utils.parseEther("0.01"));      
    token = await AmazonasCoin.deploy("AmazonasCoin", "AMZ", 0, 1000000, 1);      
    await token.deployed(); 
    await token.transfer(deployer.address, 1000000,'CID'); 
    token = token.connect(deployer); // Connect token contract to deployer signer


}); 
  
  it("should initialize the contract with correct values", async function () { 
     expect(await token.name()).to.equal("AmazonasCoin"); 
     expect(await token.symbol()).to.equal("AMZ"); 
     expect(await token.decimals()).to.equal(0); 
     expect(ethers.BigNumber.from(await token.totalSupply()).toBigInt().toString()).to.equal("1000000"); 
     expect(ethers.BigNumber.from(await token.balanceOf(deployer.address)).toBigInt().toString()).to.equal("1000000"); 
  }); 
  
it("should transfer tokens correctly", async function () {      
    const amount = 1000;      
    await token.transfer(user1.address, amount, 'CID',{ gasLimit: 300000 }); // Transfer tokens from deployer to user1
    const deployerBalanceAfter = await token.balanceOf(deployer.address);
    const user1BalanceAfter = await token.balanceOf(user1.address);
    expect(user1BalanceAfter).to.equal(amount); // Compare with the expected balance after transfer
    expect(deployerBalanceAfter).to.equal(999000); // Compare with the expected balance after transfer
   // Compare with the expected balance after transfer   
    console.log(`deployer balance: ${deployerBalanceAfter}`);
    console.log(`user1 balance: ${user1BalanceAfter}`); 
    
}); 

  it("should approve tokens for delegated transfer and measure gas usage", async function () {
    const amount = ethers.BigNumber.from("500");
    const tx = await token.approve(user1.address, amount);
    const receipt = await tx.wait();
    expect(await token.allowance(deployer.address, user1.address)).to.equal(amount);
    console.log(`Gas used for approve: ${receipt.gasUsed}`);
  });
  

  it("should handle delegated token transfers using the approved allowance", async function () {
    // Test token transfer from one address to another using the approved allowance
    const amount = ethers.BigNumber.from("1000");
    await token.approve(user2.address, amount);
    await token.approve(user1.address, amount);
    await token.transfer(user2.address, amount, 'CID', {gasLimit:300000}); // Transfer tokens from deployer to contract address
    const initialBalance = await token.balanceOf(user2.address);
    const tx = await token.transferFrom(user2.address, user1.address, 100,{ gasLimit: 300000 });
    const receipt = await tx.wait();
    const finalBalance = await token.balanceOf(user2.address);
    expect(finalBalance).to.equal(initialBalance.sub(100));     
    console.log(`Gas used for transferFrom: ${receipt.gasUsed}`);
  });

  it("should allow users to purchase tokens with the correct amount of Ether", async function () {
    const amount = ethers.BigNumber.from("100");    
    await token.transfer(user1.address, amount, "CID_123"); // Transfer tokens from deployer to contract address
    const initialBalance = await token.balanceOf(user1.address);
    await token.connect(user1).buyTokens(amount,{ value: amount, gasLimit: 300000 });
    const finalBalance = await token.balanceOf(user1.address);
    expect(finalBalance).to.equal(initialBalance.add(100));
  });

    it("should allow users to claim carbon offsets", async function () {
    // Test carbon offsets claim
    const amount = ethers.BigNumber.from("1000");
    await token.transfer(user1.address, amount, "CID_123");
    const initialBalance = await token.balanceOf(user1.address);
    await token.connect(user1).claimCarbonOffsets(100);
    const finalBalance = await token.balanceOf(user1.address);
    expect(finalBalance).to.equal(initialBalance.sub(100));
  });

    it("should allow users to sell tokens for Ether", async function () {
    // Test token sale
    // Assuming user1 is an instance of ethers.Signer
    await token.approve(user1.address, 1000);
    await token.transfer(user1.address, 1000, 'CID',{ gasLimit: 100000 }); // Transfer tokens from deployer to user1
    await token.connect(user1).approve(token.address, 1000);
    await token.transfer(token.address, 1000, 'CID',{ gasLimit: 100000 }); // Transfer tokens from deployer to contract address
    const initialBalance = await token.balanceOf(user1.address);
    console.log(`user1 balance before sale: ${await token.balanceOf(token.address)}`);
    console.log(`contract ${token.address} balance before sale: ${await token.balanceOf(token.address)}`);
    console.log(`deployer balance before sale: ${await token.balanceOf(deployer.address)}`);
    await token.connect(user1).sellTokens(100,{  gasLimit: 100000 });     
    const finalBalance = await token.balanceOf(user1.address);    
    console.log(`user1 balance after sale: ${await token.balanceOf(user1.address)}`);
    console.log(`contract ${token.address} balance after sale: ${await token.balanceOf(token.address)}`);
    console.log(`deployer balance after sale: ${await token.balanceOf(deployer.address)}`);
    expect(finalBalance).to.equal(initialBalance.sub(100));
  });
});