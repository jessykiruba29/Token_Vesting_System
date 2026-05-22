const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("\n🚀 Deploying with account:", deployer.address);
  
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Balance:", hre.ethers.formatEther(balance), "SCAI\n");

  // Deploy Mock SCAI Token
  console.log("📦 Step 1/3: Deploying MockERC20 token...");
  const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
  const token = await MockERC20.deploy();
  console.log("   ⏳ Transaction broadcasted, waiting for confirmation...");
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("   ✅ MockERC20 deployed to:", tokenAddress, "\n");

  // Deploy Vesting Contract
  console.log("📦 Step 2/3: Deploying TokenVesting...");
  const TokenVesting = await hre.ethers.getContractFactory("TokenVesting");
  const vesting = await TokenVesting.deploy(tokenAddress);
  console.log("   ⏳ Transaction broadcasted, waiting for confirmation...");
  await vesting.waitForDeployment();
  const vestingAddress = await vesting.getAddress();
  console.log("   ✅ TokenVesting deployed to:", vestingAddress, "\n");

  // Transfer tokens
  console.log("📦 Step 3/3: Transferring 100,000 SCAI to vesting contract...");
  const transferTx = await token.transfer(vestingAddress, hre.ethers.parseEther("100000"));
  console.log("   ⏳ Transfer transaction:", transferTx.hash);
  await transferTx.wait();
  console.log("   ✅ Transfer confirmed\n");

  // Save addresses
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    tokenAddress: tokenAddress,
    vestingAddress: vestingAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };
  
  fs.writeFileSync(`deployed-${hre.network.name}.json`, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("═══════════════════════════════════════════");
  console.log(`📝 Token Address: ${tokenAddress}`);
  console.log(`🏛️ Vesting Address: ${vestingAddress}`);
  console.log("═══════════════════════════════════════════");
  console.log(`\n📄 Deployment saved to: deployed-${hre.network.name}.json`);
}

main().catch((error) => {
  console.error("\n❌ Deployment failed:", error.message);
  process.exitCode = 1;
});