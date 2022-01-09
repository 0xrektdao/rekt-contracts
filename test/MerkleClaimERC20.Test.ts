import { expect } from "chai";
import { ethers } from "hardhat";
import { MerkleClaimERC20 } from "../typechain";
import { BigNumber } from "ethers";

describe("MerkleClaimERC20Test", () => {
  let token: MerkleClaimERC20;

  beforeEach(async () => {
    const Token = await ethers.getContractFactory("MerkleClaimERC20");
    token = await Token.deploy(
      "My Token",
      "MT",
      18,
      // Merkle root containing ALICE with 100e18 tokens but no BOB
      "0xf93ef5f8456df88230a9e090a12e4bac9ecf5e5d287eb6203b3057d5bda4b19e"
    );
    await token.deployed();
  });

  it("should should allow to claim", async () => {
    await token.claim(
      "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
      BigNumber.from(1e9).mul(1e9).mul(69),
      ["0x33d6aeff87f269c9c501bfc80f56918fe78a83adcc81c26b6c1d9019f553b44f"]
    );
  });

  it("should not allow to double claim", async () => {
    await token.claim(
      "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
      BigNumber.from(1e9).mul(1e9).mul(69),
      ["0x33d6aeff87f269c9c501bfc80f56918fe78a83adcc81c26b6c1d9019f553b44f"]
    );
    await expect(
      token.claim(
        "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        BigNumber.from(1e9).mul(1e9).mul(69),
        ["0x33d6aeff87f269c9c501bfc80f56918fe78a83adcc81c26b6c1d9019f553b44f"]
      )
    ).to.be.revertedWith("AlreadyClaimed");
  });

  it("should not allow to claim with wrong proof", async () => {
    await expect(
      token.claim(
        "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        BigNumber.from(1e9).mul(1e9).mul(69),
        ["0xde47f340e8e9388edefd2d8e281ca40546b7a166fdc25ba355fa13ef19e8a4f9"]
      )
    ).to.be.revertedWith("NotInMerkle");
  });
});
