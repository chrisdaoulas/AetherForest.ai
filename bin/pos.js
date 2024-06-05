const { expect } = require("chai");

describe("PoSExample", function () {
    it("Should select the correct validator", async function () {
        const [owner, addr1, addr2] = await ethers.getSigners();
        const PoSExample = await ethers.getContractFactory("PoSExample");
        const posExample = await PoSExample.deploy();
        await posExample.deployed();

        await posExample.connect(addr1).stake({ value: ethers.utils.parseEther("1") });
        await posExample.connect(addr2).stake({ value: ethers.utils.parseEther("2") });

        await posExample.selectValidator();
        expect(await posExample.validator()).to.equal(addr2.address);
    });
});
