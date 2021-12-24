import { providers } from "ethers";
import { init } from "@textile/eth-storage";

const axios = require('axios')
let provider;
class Akashic {
	constructor(light){
		// set up wallet
		this.storage = null
		this.address = null
		if(light){
			this.lightInit()
		}else{
			this.init()
		}
	}

	async init() {
		try{
			await window.ethereum.request({ method: 'eth_requestAccounts' });
		    provider = new providers.Web3Provider(window.ethereum);
		    const wallet = provider.getSigner();
		    window.provider = provider
		    const storage = await init(wallet);
		    this.storage = storage
		    this.address = await provider.getSigner().getAddress()
		}catch(e){
			console.log(e)
			alert('connect web3')
		}
	}

	async lightInit() {
		try{
			await window.ethereum.request({ method: 'eth_requestAccounts' });
		    provider = new providers.Web3Provider(window.ethereum);
		    this.address = await provider.getSigner().getAddress()
		    console.log(this.address)
		}catch(e){
			console.log(e)
			alert('connect web3')
		}
	}

	async put(reading, mode){
		// upload to textile

		if(mode == 'tarot'){

			console.log('adding a tarot')

			console.log({reading: reading, eth: this.address})
			const blob = new Blob([JSON.stringify(reading)], { type: "text/plain" });
		    const file = new File([blob], "decision.txt", {
		      type: "text/plain",
		      lastModified: new Date().getTime(),
		    });

		    await this.storage.addDeposit();

		    try{
		    	const { id, cid } = await this.storage.store(file);
		    	console.log(cid['/'])
		    	this.index(cid['/'])

			}catch(e){
				console.log('tx failed')
				console.log(e)
			}

		}else{	
			console.log('added a hex')
			console.log(reading)

		}
	}

	read(){
		return []
	}

	index(cid){
		axios
			.post('http://localhost:1440/pull', {cid: cid, eth: this.address})
			.then((res) => {
				console.log(res)
			})
	}
}

export default Akashic;