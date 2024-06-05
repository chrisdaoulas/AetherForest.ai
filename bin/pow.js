const { expect } = require("chai");

describe("PoWExample", function () {
    it("Should mine a block", async function () {
        const PoWExample = await ethers.getContractFactory("PoWExample");
        const powExample = await PoWExample.deploy();
        await powExample.deployed();

        await powExample.mine(1000);
        expect(await powExample.nonce()).to.be.above(0);
    });
});
