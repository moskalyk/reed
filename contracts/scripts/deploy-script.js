// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const {deployments} = require('hardhat-deploy');

const {
  abi,
  bytecode,
} =require('@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json')
const { parseUnits, formatUnits } = require("@ethersproject/units");

const erc20Abi = [{
            "constant": true,
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
                  },
                  {
                      "constant": false,
                      "inputs": [
                          {
                              "name": "_spender",
                              "type": "address"
                          },
                          {
                              "name": "_value",
                              "type": "uint256"
                          }
                      ],
                      "name": "approve",
                      "outputs": [
                          {
                              "name": "",
                              "type": "bool"
                          }
                      ],
                      "payable": false,
                      "stateMutability": "nonpayable",
                      "type": "function"
                  },
                  {
                      "constant": true,
                      "inputs": [],
                      "name": "totalSupply",
                      "outputs": [
                          {
                              "name": "",
                              "type": "uint256"
                          }
                      ],
                      "payable": false,
                      "stateMutability": "view",
                      "type": "function"
                  },
                  {
                      "constant": false,
                      "inputs": [
                          {
                              "name": "_from",
                              "type": "address"
                          },
                          {
                              "name": "_to",
                              "type": "address"
                          },
                          {
                              "name": "_value",
                              "type": "uint256"
                          }
                      ],
                      "name": "transferFrom",
                      "outputs": [
                          {
                              "name": "",
                              "type": "bool"
                          }
                      ],
                      "payable": false,
                      "stateMutability": "nonpayable",
                      "type": "function"
                  },
                  {
                      "constant": true,
                      "inputs": [],
                      "name": "decimals",
                      "outputs": [
                          {
                              "name": "",
                              "type": "uint8"
                          }
                      ],
                      "payable": false,
                      "stateMutability": "view",
                      "type": "function"
                  },
                  {
                      "constant": true,
                      "inputs": [
                          {
                              "name": "_owner",
                              "type": "address"
                          }
                      ],
                      "name": "balanceOf",
                      "outputs": [
                          {
                              "name": "balance",
                              "type": "uint256"
                          }
                      ],
                      "payable": false,
                      "stateMutability": "view",
                      "type": "function"
                  },
                  {
                      "constant": true,
                      "inputs": [],
                      "name": "symbol",
                      "outputs": [
                          {
                              "name": "",
                              "type": "string"
                          }
                      ],
                      "payable": false,
                      "stateMutability": "view",
                      "type": "function"
                  },
                  {
                      "constant": false,
                      "inputs": [
                          {
                              "name": "_to",
                              "type": "address"
                          },
                          {
                              "name": "_value",
                              "type": "uint256"
                          }
                      ],
                      "name": "transfer",
                      "outputs": [
                          {
                              "name": "",
                              "type": "bool"
                          }
                      ],
                      "payable": false,
                      "stateMutability": "nonpayable",
                      "type": "function"
                  },
                  {
                      "constant": true,
                      "inputs": [
                          {
                              "name": "_owner",
                              "type": "address"
                          },
                          {
                              "name": "_spender",
                              "type": "address"
                          }
                      ],
                      "name": "allowance",
                      "outputs": [
                          {
                              "name": "",
                              "type": "uint256"
                          }
                      ],
                      "payable": false,
                      "stateMutability": "view",
                      "type": "function"
                  },
                  {
                      "payable": true,
                      "stateMutability": "payable",
                      "type": "fallback"
                  },
                  {
                      "anonymous": false,
                      "inputs": [
                          {
                              "indexed": true,
                              "name": "owner",
                              "type": "address"
                          },
                          {
                              "indexed": true,
                              "name": "spender",
                              "type": "address"
                          },
                          {
                              "indexed": false,
                              "name": "value",
                              "type": "uint256"
                          }
                      ],
                      "name": "Approval",
                      "type": "event"
                  },
                  {
                      "anonymous": false,
                      "inputs": [
                          {
                              "indexed": true,
                              "name": "from",
                              "type": "address"
                          },
                          {
                              "indexed": true,
                              "name": "to",
                              "type": "address"
                          },
                          {
                              "indexed": false,
                              "name": "value",
                              "type": "uint256"
                          }
                      ],
                      "name": "Transfer",
                      "type": "event"
                  }]

// some hacks here, but couldn't figure out how to run tests against kovan network
const routerAddress = '0x950f91C7b1201966C65353c37270d68A81b8E20E'

const deployErc20 = async () => {

}

// deploying
const deploy = async () => {
  const optimismKovanAddress = '0xE592427A0AEce92De3Edee1F18E0157C05861564'
  const SwapRouter = await hre.ethers.getContractFactory("SwapRouter");
  const router = await SwapRouter.deploy(optimismKovanAddress);

  await router.deployed();

  console.log("Router deployed to:", router.address);
}

// running in the deploy script to run against kovanOptimism
const runSwap = async (amountIn, tokenAddress) => {
    const customeRouter = '0xa2DdF746766bfd1B67C157eE7cA4f82ab502b4a5'

    const SwapRouter = await ethers.getContractFactory("SwapRouter");
    const router = await SwapRouter.attach(
      "0xa2DdF746766bfd1B67C157eE7cA4f82ab502b4a5" // The deployed contract address
    );

    // let router = new ethers.Contract(optimismKovanAddress, abi, ethers.provider);
    const tx = await router.swapExactInputSingle(ethers.utils.parseUnits(amountIn, 'ether'), tokenAddress)
    console.log(tx)
    return tx;
}

// check balance
const checkBalance = async (address) => {
  // const [owner] = await ethers.getSigners();
  // console.log(ethers.provider)

  let contract = new ethers.Contract(address, erc20Abi, ethers.provider);
  const balance = await contract.balanceOf(routerAddress)
  console.log(balance.toString())
}

const approve = async (tokenAddressToApprove, swapAmount, owner) => {
  let amountToSwapBN = parseUnits(swapAmount.toString(), 18)
  let daiContract = new ethers.Contract(tokenAddressToApprove, erc20Abi, owner);
  let res = await daiContract.approve(routerAddress, amountToSwapBN)
  return res
}

async function main() {

  // get signer
  const [owner] = await ethers.getSigners();

  // Deploy my own DAI token
  // const Token = await ethers.getContractFactory("Token");
  // const token = await Token.deploy("My DAI", "DAI", 1000000);

  // console.log("Token address:", token.address);
  // console.log("Account balance:", (await token.balanceOf(owner.address)).toString());

  await deploy()
  // const daiAddress = '0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa'
  // const wethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
  // const swapAmount = '0.01'
  // let amountToSwapBN = parseUnits(swapxAmount.toString(), 18)
  // const owner = '0x950f91C7b1201966C65353c37270d68A81b8E20E'

  // approve tokenSwap
  // let daiContract = new ethers.Contract(wethAddress, erc20Abi, owner);
  // let res = await daiContract.approve(routerAddress, amountToSwapBN)
  // console.log(res)
  // await approve(wethAddress, swapAmount, owner)

  // run swap
  // let res = await runSwap("10000000000000000", daiAddress)
  // console.log(res)

  // check balance
  // await checkBalance(daiAddress)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

