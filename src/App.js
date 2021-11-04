import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import Atlas from './Atlas'
import { useHistory } from 'react-router-dom';
import json from './json';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

const deck = {
  'The Magician':'https://www.trustedtarot.com/img/cards/the-magician.png',
  'The High Priestess':'https://www.trustedtarot.com/img/cards/the-high-priestess.png',
  'The Empress':'https://www.trustedtarot.com/img/cards/the-empress.png',
  'The Emperor':'https://www.trustedtarot.com/img/cards/the-emperor.png',
  'The Hierophant':'https://www.trustedtarot.com/img/cards/the-heirophant.png',
  'The Lovers':'https://www.trustedtarot.com/img/cards/the-lovers.png',
  'The Chariot':'https://www.trustedtarot.com/img/cards/the-chariot.png',
  'Fortitude':'https://www.trustedtarot.com/img/cards/strength.png',
  'The Hermit':'https://www.trustedtarot.com/img/cards/the-hermit.png',
  'Wheel Of Fortune':'https://www.trustedtarot.com/img/cards/wheel-of-fortune.png',
  'Justice':'https://www.trustedtarot.com/img/cards/justice.png',
  'The Hanged Man':'https://www.trustedtarot.com/img/cards/the-hanged-man.png',
  'The Fool':'https://www.trustedtarot.com/img/cards/the-fool.png',
}

let pullState = 1;

function App() {

  const handleClickAtlas = () => {
      setAtlas(true)
  }

  const handleClickReed = () => {
      setAtlas(false)
  }  

  const layerType = () => {
    if(!privacy){
      document.body.style.backgroundColor = "white";
      document.getElementsByClassName('title')[0].style.color = 'black'
      setPrivacy(true)
    } else{
      document.getElementsByClassName('title')[0].style.color = 'white'
      document.body.style.backgroundColor = "#212534";
      setPrivacy(false)
    }
  }

  const [firstPull, setFirstPull] = useState('https://gateway.pinata.cloud/ipfs/QmaMBUWhRiP9JfQ4brWbEuXNCYXJBTvzB1H6mDaEnb6tRs')
  const [secondPull, setSecondPull] = useState('https://gateway.pinata.cloud/ipfs/QmaMBUWhRiP9JfQ4brWbEuXNCYXJBTvzB1H6mDaEnb6tRs')
  const [thirdPull, setThirdPull] = useState('https://gateway.pinata.cloud/ipfs/QmaMBUWhRiP9JfQ4brWbEuXNCYXJBTvzB1H6mDaEnb6tRs')

  const [firstToken, setFirstToken] = useState('')
  const [secondToken, setSecondToken] = useState('')
  const [thirdToken, setThirdToken] = useState('')

  const [loadCards, setLoadCards] = useState(false)
  const [cards, setCards] = useState({})
  const [dropdown, setDropdown] = useState(null)

  const [atlas, setAtlas] = useState(false)
  const [privacy, setPrivacy] = useState(false)
  const [trade, setTrade] = useState({})
  
  const onSelect = (card) => {
    setPull(pullState, card)
  }

  const executeTrade = (card, token, note) => {

    const path = {
      card: card,
      token: token,
      note: note
    }

    setTrade(path)
    console.log(path)
  }

  const portGatewayDecision = () => {

    const gateway = {
      set: [{
        token: firstToken,
        card: firstPull
      },{
        token: secondToken,
        card: secondPull
      },{
        token: thirdToken,
        card: thirdPull
      }],
      decision: {
        trade: trade,
        card: trade
      }
    }

    // upload to textile
    
  }

  useEffect(() => {
     // load cards 
     if(!loadCards){
       axios
        .get("https://rws-cards-api.herokuapp.com/api/v1/cards/")
        .then(function (response) {

          const cardNames = response.data.cards.map((card) => {
            return card.name
          })

          const dropdownComponent = <Dropdown style={{fontSize: '11.4px; !immportant;'}}options={cardNames} onChange={onSelect} placeholder="Select a Card" />;
          
          setDropdown(dropdownComponent)
          setLoadCards(true)
        })
     }
  })

  const setPull = (number, tarot) => {
    switch(pullState){
      case 1:
          setFirstPull(deck[tarot.value]);
          pullState++;
        break;
      case 2:
          setSecondPull(deck[tarot.value]);
          pullState++;
        break;
      case 3:
          setThirdPull(deck[tarot.value])
        break;
      default:
        // signify error
        console.log('something went wrong')
    }
  }

  return (
    <div className="App">
    
      {!atlas ? (
        <>
          <h1 className='title' style={{color: 'white'}}>
            R e e d
          </h1>
          <p onClick={handleClickAtlas} style={{fontSize: '34px', cursor: 'pointer'}}>🌎</p>
          <Grid container spacing={6}>
            <Grid item m={4}>
                {dropdown}
                <br/>
                <div className="card">
                  <img width={"90%"} height={'90%'} src={firstPull}/>
                </div>
            </Grid>

            <Grid item m={4}>
                {dropdown}
                <br/>
                <div className="card">
                  <img width={"90%"} height={'90%'} src={secondPull}/>

                </div>
            </Grid>

            <Grid item m={4}>
                {dropdown}
                <br/>
                <div className="card">
                  <img width={"90%"} height={'90%'} src={thirdPull}/>
                </div>
            </Grid>
          </Grid>
        </>
        ) : (
          <>
            <h1 className='title' style={{color: 'white'}}>
              A t l a s
            </h1>
            <p onClick={handleClickReed} style={{fontSize: '34px', cursor: 'pointer'}}>🃏</p>
            <Atlas data={json} activeNode={json} filter={''}/> 
          </>
        )}

        <input type="checkbox" id="switch" onClick={layerType}/><label for="switch">Toggle</label>

    </div>
  );
}

export default App;
