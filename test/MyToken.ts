import hre from "hardhat";
import { expect } from "chai";
import { MyToken } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
const mintingAmount = 100n;
const decimals = 18n;

describe("My Token", () => {
    let myTokenC: MyToken;
    let signers: HardhatEthersSigner[];
    beforeEach("should deploy", async () => {
        signers = await hre.ethers.getSigners();
        myTokenC = await hre.ethers.deployContract("MyToken", [
            "MyToken",
            "MT",
            decimals,
            mintingAmount,
        ]);
    });
    describe("Basic state value check", () => {

        it("should check name", async () => {
            expect(await myTokenC.name()).to.equal("MyToken");
        });

        it("should check symbol", async () => {
            expect(await myTokenC.symbol()).to.equal("MT");
        });

        it("should check decimals", async () => {
            expect(await myTokenC.decimals()).to.equal(decimals);
        });

        it("should return 100 total supply", async () => {
            expect(await myTokenC.totalSupply()).to.equal(mintingAmount * 10n ** decimals);
        });
    })


    describe("Mint", () => {
        it("should return 1MT balance for signer", async () => {
            const signer0 = signers[0];
            expect(await myTokenC.balanceOf(signer0)).to.equal(mintingAmount * 10n ** decimals);
        });
    })

    describe("Transfer", () => {
        it("should have 0.5MT", async () => {
            const signer1 = signers[1];
            await myTokenC.transfer(signer1.address, hre.ethers.parseUnits("0.5", decimals));
            expect(await myTokenC.balanceOf(signer1)).equal(hre.ethers.parseUnits("0.5", decimals));
        });

        it("should be rejected with insufficient balance error", async () => {
            const signer1 = signers[1];
            await expect(
                myTokenC.transfer(signer1.address, hre.ethers.parseUnits((mintingAmount + 1n).toString(), decimals))
            ).to.be.revertedWith("Insufficient balance");
        });
    })
});