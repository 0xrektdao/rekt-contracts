import { task } from "hardhat/config";
import { TASK_COMPILE, TASK_NODE } from "hardhat/builtin-tasks/task-names";

export const errorAndExit = (msg: string) => {
  throw new Error(msg);
};

task("run-local", "Deploy contracts to hardhat").setAction(
  async (args, { ethers, run }) => {
    const network = await ethers.provider.getNetwork();
    const root: string = process.env.MERKLE_ROOT!;
    if (network.chainId !== 31337) {
      errorAndExit(
        `Invalid chain id. Expected 31337. Got: ${network.chainId}.`
      );
    }
    if (!root) {
      errorAndExit("No merkle root, please provide one");
    }

    await run(TASK_COMPILE);

    await Promise.race([
      run(TASK_NODE),
      new Promise((resolve) => setTimeout(resolve, 2_000)),
    ]);

    const RektToken = await ethers.getContractFactory("RektToken");
    const token = await RektToken.deploy("RektToken", "REKT", 18, root);
    await token.deployed();
    console.log("deployed REKT at", token.address);

    await new Promise(() => {
      /* keep node alive until this process is killed */
    });
  }
);
