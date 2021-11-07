const { expect, } = require("chai");
const { ethers } = require("hardhat");
const { parseUnits, formatUnits } = require("@ethersproject/units");

const {
  abi,
  bytecode,
} =require('@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json')

describe("Greeter", function () {


  // it("Should return the contract greeting", async function () {
  //   const optimismKovanAddress = '0xE592427A0AEce92De3Edee1F18E0157C05861564'
  //   const SwapRouter = await hre.ethers.getContractFactory("SwapRouter");
  //   const router = await SwapRouter.deploy(optimismKovanAddress);

  //   await router.deployed();

  //   expect(await router.greeting()).to.equal("Ready");

  //   // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

  //   // wait until the transaction is mined
  //   // await setGreetingTx.wait();

  //   // expect(await greeter.greet()).to.equal("Hola, mundo!");
  // });

  it('Should make a token swap', async function() {
    // const optimismKovanAddress = '0xE592427A0AEce92De3Edee1F18E0157C05861564'
    const customeRouter = '0xa2DdF746766bfd1B67C157eE7cA4f82ab502b4a5'

    const SwapRouter = await ethers.getContractFactory("SwapRouter");
    const router = await SwapRouter.attach(
      "0xa2DdF746766bfd1B67C157eE7cA4f82ab502b4a5" // The deployed contract address
    );

    // let router = new ethers.Contract(optimismKovanAddress, abi, ethers.provider);
    console.log(router)
    const daiAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
    const tx = await router.swapExactInputSingle(ethers.utils.parseUnits('0.01', 'ether'), daiAddress)
    console.log(tx)
  })

  it('should get balance', async function() {
    const [owner] = await ethers.getSigners();
    const daiAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
    // console.log(ethers.provider)

    let contract = new ethers.Contract(daiAddress, erc20Abi, ethers.provider);
    const balance = await contract.balanceOf('0x950f91C7b1201966C65353c37270d68A81b8E20E')
    console.log(balance.toString())
  })
});
