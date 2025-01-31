// require('@nomiclabs/hardhat-waffle');
// require('@nomiclabs/hardhat-ethers');

// // Use these plugins for interacting with contracts on Polygon or other networks if needed later
// require('@nomiclabs/hardhat-etherscan');
// require('dotenv').config();

// module.exports = {
//   solidity: "0.8.0", // Make sure this matches the version used in your contracts
//   networks: {
//     hardhat: {
//       mining: { auto: true },

//       chainId: 1337, // Default chain ID for Hardhat Network
//     },
//     // Polygon Testnet configuration (if you still need to deploy there)
   
//   },

// };
require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-etherscan');
require('dotenv').config();

module.exports = {
  solidity: "0.8.0", // Make sure this matches the version used in your contracts
  networks: {
    hardhat: {
      mining: { auto: true },
      chainId: 1337, // Default chain ID for Hardhat Network
    },
   
    holesky:{
      url: "https://eth-holesky.g.alchemy.com/v2/BTeFNsqvZQ3n6WacRdUT1P4U-KSXkaOA",
      accounts: ["441622d176d37f6320840a8147a0f9399b4a61ae0b66b0c2604dace6e5fd441c","96ae58c6098f7c81279ea520bb99cb6e574722e053ca5b62e648f942aa47ae5c"],
      chainId: 17000, // Mainnet Chain ID
    } ,
  },
  etherscan: {
    apiKey: "FDYFIYC9ME383IZIEW4MAQY16XRAFPEMHA", // Use this if you plan to verify contracts
  },
};
