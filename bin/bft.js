const { expect } = require("chai");

describe("BFTExample", function () {
    it("Should set the value correctly", async function () {
        const BFTExample = await ethers.getContractFactory("BFTExample");
        const bftExample = await BFTExample.deploy();
        await bftExample.deployed();

        await bftExample.setValue(42);
        expect(await bftExample.value()).to.equal(42);
    });

    it("Should simulate BFT scenario", async function () {
        const BFTExample = await ethers.getContractFactory("BFTExample");
        const bftExample = await BFTExample.deploy();
        await bftExample.deployed();

        await bftExample.simulateBFT(100);
        expect(await bftExample.value()).to.equal(100);
    });
});
