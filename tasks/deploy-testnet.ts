import { task } from "hardhat/config";
import { TASK_COMPILE } from "hardhat/builtin-tasks/task-names";
import { errorAndExit } from "./run-local";

task("deploy-testnet", "Deploy contracts to hardhat").setAction(
  async (args, { ethers, run }) => {
    const network = await ethers.provider.getNetwork();
    const root: string = process.env.MERKLE_ROOT!;
    if (network.chainId !== 3 && network.chainId !== 5) {
      errorAndExit(
        `Invalid chain id. Expected 3 or 5. Got: ${network.chainId}.`
      );
    }
    if (!root) {
      errorAndExit("No merkle root, please provide one");
    }

    console.log(
      `deploying to : ${network.chainId === 3 ? "ropsten" : "goerli"}`
    );

    await run(TASK_COMPILE);

    const RektToken = await ethers.getContractFactory("RektToken");
    const token = await RektToken.deploy("RektToken", "REKT", 18, root);
    console.log(`RektToken deployed at: ${token.address}`);
    await token.deployed();
  }
);
