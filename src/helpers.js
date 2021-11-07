import { abi as SwapRouterABI } from './abis/SwapRouter.json'
import { abi as ERC20ABI } from './abis/ERC20.json'
import { parseUnits, formatUnits } from "@ethersproject/units";

const customRouter = '0x001a8e3c819BF0045722BFaD2Be2d796A4807828'

// running swaps
const runSwap = async (amountIn, tokenAddress, signer, ethers) => {

    const router = new ethers.Contract(customRouter, SwapRouterABI, signer)
	// // 
 //    const SwapRouter = await ethers.getContractFactory("SwapRouter");
 //    const router = await SwapRouter.attach(
 //      customRouter // The deployed contract address
 //    );

    // let router = new ethers.Contract(optimismKovanAddress, abi, ethers.provider);
    const tx = await router.swapExactInputSingle(ethers.utils.parseUnits(amountIn, 'ether'), tokenAddress, {
    	gasLimit: 250000
	})
    console.log(tx)
    return tx;
}

// check balance
const checkBalance = async (address, provider, ethers) => {
  // const [owner] = await ethers.getSigners();
  // console.log(ethers.provider)

  let contract = new ethers.Contract(address, ERC20ABI, provider);
  const balance = await contract.balanceOf(customRouter)
  console.log(balance.toString())
  return balance
}

const approve = async (tokenAddressToApprove, swapAmount, signer, ethers) => {
  let amountToSwapBN = parseUnits(swapAmount.toString(), 18)
  let daiContract = new ethers.Contract(tokenAddressToApprove, ERC20ABI, signer);
	let res = await daiContract.approve(customRouter, amountToSwapBN, {
	gasLimit: 250000
	})
  console.log(res)
  return res
}


export { approve, runSwap, checkBalance }