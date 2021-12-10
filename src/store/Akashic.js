class Akashic {
	constructor(){

	}

	put(reading, mode){
		if(mode == 'tarot'){
			console.log('adding a tarot')
			console.log(reading)
		}else{
			console.log('added a hex')
			console.log(reading)
		}
	}

	read(){
		return []
	}
}