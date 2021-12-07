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

import Button from '@mui/material/Button';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {ethers} from 'ethers'

import IChing from './IChing.js'

// textile
import { providers } from "ethers";
import { init } from "@textile/eth-storage";

import {
  abi,
  bytecode,
} from '@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json'


// optimism magic
import { approve, runSwap, checkBalance} from './helpers.js'

// aztec magic
import Aztec from './Aztec.js'

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
    if(privacy){
      document.body.style.backgroundColor = "white";
      document.getElementsByClassName('title')[0].style.color = 'black'
      document.getElementsByClassName('pair')[0].style.color = 'black'
      document.getElementsByClassName('pair')[1].style.color = 'black'
      document.getElementsByClassName('pair')[2].style.color = 'black'
      setPrivacy(false)
    } else{
      document.body.style.backgroundColor = "#212534";
      document.getElementsByClassName('title')[0].style.color = 'white'
      document.getElementsByClassName('pair')[0].style.color = 'white'
      document.getElementsByClassName('pair')[1].style.color = 'white'
      document.getElementsByClassName('pair')[2].style.color = 'white'
      setPrivacy(true)
    }
  }

  const [firstPull, setFirstPull] = useState('https://gateway.pinata.cloud/ipfs/QmSoKLY9n55Hps7NhGMtQMk5V9PUwcmndfmY1uLRJzT8Yn')
  const [secondPull, setSecondPull] = useState('https://gateway.pinata.cloud/ipfs/QmSoKLY9n55Hps7NhGMtQMk5V9PUwcmndfmY1uLRJzT8Yn')
  const [thirdPull, setThirdPull] = useState('https://gateway.pinata.cloud/ipfs/QmSoKLY9n55Hps7NhGMtQMk5V9PUwcmndfmY1uLRJzT8Yn')

  const [firstToken, setFirstToken] = useState('WETH:DAI')
  const [secondToken, setSecondToken] = useState('WETH:UNI')
  const [thirdToken, setThirdToken] = useState('WETH:FTX')

  const [loadCards, setLoadCards] = useState(false)
  const [cards, setCards] = useState({})
  const [dropdown, setDropdown] = useState(null)

  const [atlas, setAtlas] = useState(false)
  const [privacy, setPrivacy] = useState(true)
  const [trade, setTrade] = useState({})
  const [snapshot, setSnapshot] = useState('root')
  const [swapTx, setSwapTx] = useState('0x')
  
  const onSelect = (card) => {
    setPull(pullState, card)
  }

  const executeTrade = async (card) => {



    if(privacy){
    // using AZTEC
      const token = 'ETH:DAI'
      // aztec magic
      const aztec = new Aztec()
      const note = await aztec.runSwap('0.1')

      const path = {
        card: card,
        token: token,
        note: note
      }

      setTrade(path)
      console.log(path)

    }else{
      // using optimism
      // const optimismKovanAddress = '0xE592427A0AEce92De3Edee1F18E0157C05861564'
      const privateKey = ''
      const provider = new ethers.providers.JsonRpcProvider({url: 'https://optimism-kovan.infura.io/v3/'})
      const signer = new ethers.Wallet(privateKey, provider)
      // console.log(signer)
      const daiAddress = '0xff795577d9ac8bd7d90ee22b6c1703490b6512fd'
      const WETHAddress = '0x4200000000000000000000000000000000000006'
      // make approve on the token
      const tx = await approve(WETHAddress, '1.0', signer, ethers)
      // make swap on the router

      // const tx = await runSwap('0.01', daiAddress, signer, ethers)
      setSwapTx(tx)

      // const router = new ethers.Contract(optimismKovanAddress, abi, signer)

      // console.log(router)
      // const balance = await checkBalance(signer.address, provider, ethers)
      // console.log(balance.toString())
      

    }


  }

  const portGatewayDecision = async (tx) => {

    const gateway = {
      set: [{
        token: firstToken,
        card: firstPull,
        isDecision: false
      },{
        token: secondToken,
        card: secondPull,
        isDecision: false
      },{
        token: thirdToken,
        card: thirdPull,
        isDecision: false
      }],
      decision: {
        parent: snapshot,
        trade: tx,
      }

    }

    // upload to textile
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new providers.Web3Provider(window.ethereum);
    const wallet = provider.getSigner();

    const storage = await init(wallet);

    const blob = new Blob([JSON.stringify(gateway)], { type: "text/plain" });
    const file = new File([blob], "decision.txt", {
      type: "text/plain",
      lastModified: new Date().getTime(),
    });

    await storage.addDeposit();

    const { id, cid } = await storage.store(file);

    console.log(cid)
    setSnapshot(cid)
    
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

  const saveSnap = () => {
    console.log()
    portGatewayDecision(swapTx)
  }

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
    <h1 className='title' style={{color: 'white'}}>
              R e e d
    </h1>
      <div class="circle">
        <div class="noise animated"></div>
      </div>



{/*      {!atlas ? (
        <>
          <h1 className='title' style={{color: 'white'}}>
            E n d
          </h1>
          <p onClick={handleClickAtlas} style={{fontSize: '34px', cursor: 'pointer'}}>🌎</p>
          <Grid container spacing={6}>
            <Grid item m={4}>
                {dropdown}
                <br/>
                <div className="card">
                  <img width={"90%"} height={'90%'} src={firstPull}/>
                </div>
                <br />
                <p className='pair'>{firstToken} 0.3</p>
                <Button variant="outlined" style={{background: 'wheat'}} onClick={async () => await executeTrade(firstPull)}>swap</Button>
            </Grid>

            <Grid item m={4}>
                {dropdown}
                <br/>
                <div className="card">
                  <img width={"90%"} height={'90%'} src={secondPull}/>
                </div>
                <br />
                <p className='pair'>{secondToken} 0.3</p>
                <Button variant="outlined" style={{background: 'wheat'}}>swap</Button>

            </Grid>

            <Grid item m={4}>
                {dropdown}
                <br/>
                <div className="card">
                  <img width={"90%"} height={'90%'} src={thirdPull}/>
                </div>
                <br />
                <p className='pair'>{thirdToken} 0.3</p>
                <Button variant="outlined" style={{background: 'wheat'}}>swap</Button>

            </Grid>
          </Grid>
          <Button variant="outlined" style={{background: 'white'}} onClick={saveSnap}>save</Button>
          <br />

        </>
        ) : (
          <>
            <h1 className='title' style={{color: 'white'}}>
              A t l a s
            </h1>
            <p onClick={handleClickReed} style={{fontSize: '34px', cursor: 'pointer'}}>🃏</p>
            <Atlas data={json} activeNode={json} filter={''}/> 
          </>
        )}*/}
        <p style={{color: 'white', fontSize: '20px'}}>{"> reveal <"}</p>
{/*
        <input type="checkbox" id="switch" onClick={layerType}/><label for="switch">Toggle</label>
*/}
    </div>
  );
}

export default App;
