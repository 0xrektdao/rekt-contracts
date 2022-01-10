// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

const errorAndExit = (msg: string) => {
  throw new Error(msg);
};

async function main() {
  const root: string = process.env.MERKLE_ROOT!;
  if (!root) {
    errorAndExit("no merkle root, please provide one");
  }
  const RektToken = await ethers.getContractFactory("RektToken");
  const token = await RektToken.deploy("RektToken", "REKT", 18, root);
  await token.deployed();
  console.log(`REKT token deployed at: ${token.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
