// scripts/deploy.js

const { Contract } = require("ethers");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    // Compile your contract (if not already compiled)
    await hre.run('compile');

    // Deploy your contract
    const Voting = await ethers.getContractFactory("DIDRegistry"); // Contract name here
    const voting = await Voting.deploy(); // Constructor args if needed
    console.log("Voting contract deployed to:", voting.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  