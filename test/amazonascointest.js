const expect = import('chai').expect;
const ethers = import('ethers');
const hre = import("hardhat");



describe("AmazonasCoin", function () {
  let AmazonasCoin;
  let token;
  let deployer, user1, user2;

  beforeEach(async function () {
    [deployer, user1, user2] = await ethers.getSigners();
    AmazonasCoin = await ethers.getContractFactory("AmazonasCoin");
    token = await AmazonasCoin.deploy("AmazonasCoin", "AMZ", 18, 1000000, ethers.utils.parseEther("0.01"));
    await token.deployed();
  });

  it("should initialize the contract with correct values", async function () {
    expect(await token.name()).to.equal("AmazonasCoin");
    expect(await token.symbol()).to.equal("AMZ");
    expect(await token.decimals()).to.equal(18);
    expect(await token.totalSupply()).to.equal(ethers.BigNumber.from("1000000000000000000000000"));
    expect(await token.balanceOf(deployer.address)).to.equal(ethers.BigNumber.from("1000000000000000000000000"));
  });

  it("should transfer tokens correctly and measure gas usage", async function () {
    const amount = ethers.BigNumber.from("1000");
    const tx = await token.transfer(user1.address, amount, "CID_123");
    const receipt = await tx.wait();

    expect(await token.balanceOf(deployer.address)).to.equal(ethers.BigNumber.from("999999999999999999999000"));
    expect(await token.balanceOf(user1.address)).to.equal(amount);

    console.log(`Gas used for transfer: ${receipt.gasUsed}`);
  });

  it("should approve tokens for delegated transfer and measure gas usage", async function () {
    const amount = ethers.BigNumber.from("500");
    const tx = await token.approve(user1.address, amount);
    const receipt = await tx.wait();

    expect(await token.allowance(deployer.address, user1.address)).to.equal(amount);

    console.log(`Gas used for approve: ${receipt.gasUsed}`);
  });

  it("should handle delegated token transfers and measure gas usage", async function () {
    const amount = ethers.BigNumber.from("1000");
    await token.transfer(user1.address, amount, "CID_123");
    await token.approve(user2.address, ethers.BigNumber.from("500"), { from: user1.address });

    const tx = await token.transferFrom(user1.address, user2.address, ethers.BigNumber.from("500"));
    const receipt = await tx.wait();

    expect(await token.balanceOf(user1.address)).to.equal(ethers.BigNumber.from("500"));
    expect(await token.balanceOf(user2.address)).to.equal(ethers.BigNumber.from("500"));

    console.log(`Gas used for transferFrom: ${receipt.gasUsed}`);
  });

  it("should allow token purchase and measure gas usage", async function () {
    const amount = ethers.BigNumber.from("100");
    const value = ethers.utils.parseEther("1");

    const tx = await token.buyTokens(amount, { value: value });
    const receipt = await tx.wait();

    expect(await token.balanceOf(user1.address)).to.equal(amount.mul(ethers.BigNumber.from("1000000000000000000")));

    console.log(`Gas used for buyTokens: ${receipt.gasUsed}`);
  });

  it("should allow token sale and measure gas usage", async function () {
    const amount = ethers.BigNumber.from("100");
    const value = ethers.utils.parseEther("1");

    await token.buyTokens(amount, { value: value });

    const tx = await token.sellTokens(amount);
    const receipt = await tx.wait();

    expect(await token.balanceOf(user1.address)).to.equal(0);

    console.log(`Gas used for sellTokens: ${receipt.gasUsed}`);
  });

  it("should allow claiming carbon offsets and measure gas usage", async function () {
    const amount = ethers.BigNumber.from("100");
    await token.transfer(user1.address, amount, "CID_123");

    const tx = await token.claimCarbonOffsets(amount);
    const receipt = await tx.wait();

    expect(await token.carbonOffs(user1.address)).to.equal(amount);

    console.log(`Gas used for claimCarbonOffsets: ${receipt.gasUsed}`);
  });
});
