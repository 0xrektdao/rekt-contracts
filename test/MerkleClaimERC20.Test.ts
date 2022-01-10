import { expect } from "chai";
import { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import { RektToken } from "../typechain";

describe("MerkleClaimERC20Test", () => {
  let token: RektToken;

  beforeEach(async () => {
    const Token = await ethers.getContractFactory("RektToken");
    token = await Token.deploy(
      "RektToken",
      "REKT",
      18,
      "0x2199dab3328f077f1086b0e305a4a39a4332bacb7fd27d5548e6e08e925a5ed8"
    );
    await token.deployed();
  });

  const firstAccount = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const firstAmount = "69420352300000000000";
  const firstProof =
    "9089d0253b2b3df456dbfb5d56fc4ae3b17218975fb7938e765f092405944656 4ae5e8fe2670e0b2e95aa8d956eb28ba0d2d264a0380b11aa7358c4b44a87f74 e54283b95909dea934ea60f9600e06e619f9dc724432049c0ca4a5c4f05d43a2 e417510cb24f1c5166d2d05782aa4ca70bc8bef881334e6f2f3d50d5919c7479 ab7efd4efc0c9803835c8d5c183c101b1a8b1466ac1ba8dfbc178b7cd188f43f 02b46432324a282735c019a2367d07482bed7783e9019273799bed31ac8259a6 e73a1b313a5c5b9cedeb95ac85914454f32cb0ebb5bc3304ed4d8590891f2845 a8e3f6b883c96fae15039435ca752052c6915a06fab36ac87a5403bb3dcb935b 59b63fbad43b1ec95dccd4654b88931e9d60dd420558d1f71f8ebe150bdedc5c";

  const _claim = async () => {
    // Note: it DOES matter
    const proof = firstProof.split(" ").map((s) => "0x" + s);
    return token.claim(firstAccount, firstAmount, proof);
  };

  it("should allow to claim", async () => {
    await _claim();
  });

  it("should not allow to double claim", async () => {
    await _claim();
    await expect(_claim()).to.be.revertedWith("AlreadyClaimed");
  });

  it("should not allow to claim with wrong proof", async () => {
    await expect(
      token.claim(firstAccount, firstAmount, [
        "0xde47f340e8e9388edefd2d8e281ca40546b7a166fdc25ba355fa13ef19e8a4f9",
      ])
    ).to.be.revertedWith("NotInMerkle");
  });
});
