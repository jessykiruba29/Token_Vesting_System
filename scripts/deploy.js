const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);

    // Deploy Mock SCAI Token
    const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
    const token = await MockERC20.deploy();
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    console.log("SCAI Token deployed to:", tokenAddress);

    // Deploy Vesting Contract
    const TokenVesting = await hre.ethers.getContractFactory("TokenVesting");
    const vesting = await TokenVesting.deploy(tokenAddress);
    await vesting.waitForDeployment();
    const vestingAddress = await vesting.getAddress();
    console.log("TokenVesting deployed to:", vestingAddress);

    // Transfer tokens to vesting contract
    await token.transfer(vestingAddress, hre.ethers.parseEther("100000"));
    console.log("Transferred 100,000 SCAI to vesting contract");

    // Save addresses
    const fs = require("fs");
    fs.writeFileSync("deployed.json", JSON.stringify({
        tokenAddress,
        vestingAddress,
        network: hre.network.name
    }, null, 2));
    
    console.log("\n✅ Deployment complete!");
    console.log(`Token: ${tokenAddress}`);
    console.log(`Vesting: ${vestingAddress}`);
}

main().catch(console.error);