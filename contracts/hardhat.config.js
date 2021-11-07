require("@nomiclabs/hardhat-waffle");
require('hardhat-deploy')
require('hardhat-deploy-ethers')
// require("@eth-optimism/hardhat-ovm");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.7.6",
  networks: {
    kovan: {
      url: "https://kovan.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad", // <---- YOUR INFURA ID! (or it won't work)
      accounts: [''],
    },
    kovanOptimism: {
      url: "https://optimism-kovan.infura.io/v3/63bf55c15eb244438407ba533bfc9779",
      accounts: [''],
      companionNetworks: {
        l1: "kovan",
      },
    },
    mainnetOptimism: {
      url: "https://optimism-mainnet.infura.io/v3/",
      accounts: [''],
      gas: 2100000,
      gasPrice: 8000000000,
      companionNetworks: {
        l1: "mainnet",
      }
    }
  }
};
