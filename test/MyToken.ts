import hre from "hardhat";
import { expect } from "chai";
import { MyToken } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("mytoken deploy", () => {
    let myTokenC: MyToken;
    let signers: HardhatEthersSigner[];
    before("should deploy", async () => {
        signers = await hre.ethers.getSigners();
        myTokenC = await hre.ethers.deployContract("MyToken", [
            "MyToken",
            "MT",
            18
        ]);
    });

    it("should check name", async () => {
        expect(await myTokenC.name()).to.equal("MyToken");
    });

    it("should check symbol", async () => {
        expect(await myTokenC.symbol()).to.equal("MT");
    });

    it("should check decimals", async () => {
        expect(await myTokenC.decimals()).to.equal(18);
    });

    it("should return 0 total supply", async () => {
        expect(await myTokenC.totalSupply()).to.equal(1n * 10n ** 18n);
    });

    it("should return 1MT balance for signer", async () => {
        const signer0 = signers[0];
        expect(await myTokenC.balanceOf(signer0)).to.equal(1n * 10n ** 18n);
    });
});