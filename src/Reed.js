const { tarots, classes } = require('./tarots.js')

const deck = {
  'The Fool':'https://www.trustedtarot.com/img/cards/the-fool.png',
  'The Magician':'https://www.trustedtarot.com/img/cards/the-magician.png',
  'The High Priestess':'https://www.trustedtarot.com/img/cards/the-high-priestess.png',
  'The Empress':'https://www.trustedtarot.com/img/cards/the-empress.png',
  'The Emperor':'https://www.trustedtarot.com/img/cards/the-emperor.png',
  'The Hierophant':'https://www.trustedtarot.com/img/cards/the-heirophant.png',
  'The Lovers':'https://www.trustedtarot.com/img/cards/the-lovers.png',
  'The Chariot':'https://www.trustedtarot.com/img/cards/the-chariot.png',
  'Strength':'https://www.trustedtarot.com/img/cards/strength.png',
  'The Hermit':'https://www.trustedtarot.com/img/cards/the-hermit.png',
  'Wheel Of Fortune':'https://www.trustedtarot.com/img/cards/wheel-of-fortune.png',
  'Justice':'https://www.trustedtarot.com/img/cards/justice.png',
  'The Hanged Man':'https://www.trustedtarot.com/img/cards/the-hanged-man.png',
  'Death':'https://www.trustedtarot.com/img/cards/death.png',
  'Temperance':'https://www.trustedtarot.com/img/cards/temperance.png',
  'The Devil':'https://www.trustedtarot.com/img/cards/the-devil.png',
  'The Tower':'https://www.trustedtarot.com/img/cards/the-tower.png',
  'The Star':'https://www.trustedtarot.com/img/cards/the-star.png',
  'The Moon':'https://www.trustedtarot.com/img/cards/the-moon.png',
  'The Sun':'https://www.trustedtarot.com/img/cards/the-sun.png',
  'Judgement':'https://www.trustedtarot.com/img/cards/judgement.png',
  'The World':'https://www.trustedtarot.com/img/cards/the-world.png',
}

class Reed {
	constructor(){
		// each card has a thread
	}

	simulate(iterations){
		// counter
		let counter = 0;
		const records = []
		// loop on a setInterval 
		while(counter < iterations) {

			// generate batch
			const batch = this.generateBatch(3)
			console.log(batch)
			// save batch locally and to textile

			counter++
			const pull = batch[0 + Math.round(Math.random() * 2)]
			const values = [100, 200, 300, 500, 800, 1300, 2100]
			records.push({
				title: pull,
				src: deck[pull],
				funds: values[0  + Math.round(Math.random() * 6)]
			})
		}
		console.log(records)
		return records
	}

	generateBatch(batchSize){

		const batch = []

		// generate 3 random cards
		for(let i = 0; i < batchSize; i++){

			// randomize between: 21
			const ran = 1 + Math.round(Math.random() * 21)
			console.log(ran)
			console.log(tarots[ran])
			batch.push(tarots[ran])
		}

		return batch
	}
}

export default Reed