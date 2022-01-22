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

import Akashic from './store/Akashic.js'
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import Reed from './Reed.js'

import {
  abi,
  bytecode,
} from '@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json'


// optimism magic
import { approve, runSwap, checkBalance} from './helpers.js'

// aztec magic
import Aztec from './Aztec.js'
import { Chart } from "react-google-charts";

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

function AkashicRecords(props){

  let data = []
  const [chart, setChart] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {

    if(!isLoaded){
      setTimeout(async () => {

          const res = await axios.get('http://localhost:1440/akashic')
          console.log(res.data.records)

          const chartComponent = <Chart
          width={'500px'}
          height={'300px'}
          chartType="BarChart"
          loader={<div>Loading Chart</div>}
          data={res.data.records}
          options={{
            title: 'Akashic Tarot Swap Records',
            chartArea: { width: '50%' },
            isStacked: true,
            textColor: 'white',
            colors: ['#941fff', '#ff1f5d'],
            backgroundColor: 'black',
            hAxis: {
              title: 'Value in USD',
              minValue: 0,
            },
            vAxis: {
              title: 'Cards',
            },
          }}
          // For tests
          rootProps={{ 'data-testid': '3' }}
        />
          setChart(chartComponent)
      },1000)

      setIsLoaded(true)
    }
  }, [data])

  return (
    <>
      <h1 className='title' style={{color: 'white'}}>
                A k a s h i c 
      </h1>
      <p onClick={() => props.action('mode')} style={{fontSize: '34px', cursor: 'pointer'}}>🃏</p>
      {chart}
      
    </>
  )
}

function TimelineRecords(props){

  const [timeline, setTimeline] = useState([])
  const [timelineSet, setTimelineSet] = useState(false)

  const records = [
  {title: 'magician', funds: 2000, src: 'https://www.trustedtarot.com/img/cards/the-magician.png'},
  {title: 'magician', funds: 2000, src: 'https://www.trustedtarot.com/img/cards/the-magician.png'},
  {title: 'magician', funds: 2000, src: 'https://www.trustedtarot.com/img/cards/the-magician.png'},
  {title: 'magician', funds: 2000, src: 'https://www.trustedtarot.com/img/cards/the-magician.png'},
  ]


  useEffect(async () => {

    if(!timelineSet){
      const res = await axios(`http://localhost:1440/akashic/${props.wallet}`)
      console.log(res)
      const timelineRecords = res.data.records[0].set.map((record) => {
        if(record.isDecision){
          return <VerticalTimelineElement
            className="vertical-timeline-element--education"
            date={`ETH ${record.value}`}
            iconStyle={{ background: 'black', color: '#fff' }}
            icon={'🃏'}
            style={{margin: '20px'}}
          >
            <h3 className="vertical-timeline-element-title">{record.card}</h3>
            <img style={{width: '100%'}} src={deck[record.card]}/>
          </VerticalTimelineElement>
        }
      })
      setTimeline(timelineRecords)
      setTimelineSet(true)
    }
  }, [timeline])

  const simulateRecords = () => {

    const reed = new Reed()
    const records = reed.simulate(10)
    console.log(records)

    const timelineRecords = records.map((el) => {
      return <VerticalTimelineElement
          className="vertical-timeline-element--education"
          date={`$${el.funds}`}
          iconStyle={{ background: 'black', color: '#fff' }}
          icon={'🃏'}
          style={{margin: '20px'}}
        >
          <h3 className="vertical-timeline-element-title">{el.title}</h3>
          <img style={{width: '100%'}} src={el.src}/>
        </VerticalTimelineElement>
    })

    setTimeline(timelineRecords)
  }

  return(
    <>
      <h1 className='title' style={{color: 'white'}}>
                Y o u r  P u l l s 
      </h1>
      <p onClick={() => props.action('mode')} style={{fontSize: '34px', cursor: 'pointer'}}>🃏</p>

      <p style={{color: 'white'}}>Account: {props.wallet.substring(0,6) + '...'}</p>
      <p style={{color: 'white', fontSize: '20px', cursor: 'pointer'}} onClick={() => simulateRecords()}>{"> simulate <"}</p>
      
      <VerticalTimeline>
        {timeline}
      </VerticalTimeline>
    </>
  )
}

function AtlasView (props) {
  //<Atlas data={json} activeNode={json} filter={''}/> 
  return(
    <>
      <h1 className='title' style={{color: 'white'}}>
        A t l a s
      </h1>
      <p onClick={() => props.action('tarot')} style={{fontSize: '34px', cursor: 'pointer'}}>🃏</p>
      <p onClick={() => props.action('timeline')} style={{fontSize: '34px', cursor: 'pointer'}}>🕰️</p>
      <p style={{color: 'white'}}>coming soon...</p>
    </>
  )
}

let spreadSet = {
  "9-Card": [[0,1,0,0,0,0,0,0],[1,1,1,0,1,1,1,1],[0,1,0,0,0,0,0,0]],
  "Celtic Cross": [[1,1,0,0,1,1,0,0],[1,1,1,0,1,1,0,0],[0,1,0,0,1,0,0,0]],
  "3-Card": [[0,0,0,0,0,0,0,0],[0,0,1,1,1,0,0,0],[0,0,0,0,0,0,0,0]],
  "default": [[1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1]]
}

function Spreads(props) {

  const [spreadNames, setSpreadNames] = useState(["9-Card", "Celtic Cross", "3-Card"])
  const [spread, setSpread] = useState('default')

  const [isSet, setIsSet] = useState(false)
  const [cards1, setCards1] = useState([])
  const [cards2, setCards2] = useState([])
  const [cards3, setCards3] = useState([])
  // save spread
  // load spread
  const onSelect = (row, i) => {
    console.log(row)
    console.log(i)
  }

  const onDropdownSelect = (e) => {
    console.log(e)
    setSpread(e.value)
    setIsSet(false)
    setCards()
  }

  const setCards = () => {
      const cardsComps1 = (new Array(8).fill(0)).map((el, i) => {
        return <div className="card-block">
          <div style={{width: '50px', height: '80px'}} className="card">
            {spreadSet[spread][0][i] == 0 ? '': <img width={"90%"} height={'90%'} onClick={() => onSelect(1, i)} src={'https://gateway.pinata.cloud/ipfs/QmSoKLY9n55Hps7NhGMtQMk5V9PUwcmndfmY1uLRJzT8Yn'}/>}
          </div>
        </div>
      })

      const cardsComps2 = (new Array(8).fill(0)).map((el, i) => {
        return <div className="card-block">
          <div style={{width: '50px', height: '80px'}}className="card">
            {spreadSet[spread][1][i] == 0 ? '': <img width={"90%"} height={'90%'} onClick={() => onSelect(1, i)} src={'https://gateway.pinata.cloud/ipfs/QmSoKLY9n55Hps7NhGMtQMk5V9PUwcmndfmY1uLRJzT8Yn'}/>}
          </div>
        </div>
      })

      const cardsComps3 = (new Array(8).fill(0)).map((el, i) => {
        return <div className="card-block">
          <div style={{width: '50px', height: '80px'}}className="card">
            {spreadSet[spread][2][i] == 0 ? '': <img width={"90%"} height={'90%'} onClick={() => onSelect(1, i)} src={'https://gateway.pinata.cloud/ipfs/QmSoKLY9n55Hps7NhGMtQMk5V9PUwcmndfmY1uLRJzT8Yn'}/>}
          </div>
        </div>
      })
      setCards1(cardsComps1)
      setCards2(cardsComps2)
      setCards3(cardsComps3)
  }

  useEffect(() => {
    if(!isSet) {
      setCards()
      setIsSet(true)
    }
  },[cards1, cards2, cards3])

  return (<>
    <h1 className='title' style={{color: 'white'}}>
              S p r e a d
    </h1>
    <Dropdown style={{fontSize: '11.4px; !immportant;', fontFamily: 'Gothic'}}options={spreadNames} onChange={(e) => onDropdownSelect(e)} placeholder="S e l e c t" />
    <br />
    <br />
    <Grid alignItems="center" justifyContent="center" direction="column" container spacing={2}>
      <div clssName='card-row' style={{width: '100%'}}>
        {cards1}
      </div>
      <br/>
      <br/>
      <div clssName='card-row' style={{width: '100%'}}>
        {cards2}
      </div>
      <br/>
      <br/>
      <div clssName='card-row' style={{width: '100%'}}>
        {cards3}
      </div>
    </Grid>
  </>)
}

function Tarot(props) {

  const [firstPull, setFirstPull] = useState('https://gateway.pinata.cloud/ipfs/QmSoKLY9n55Hps7NhGMtQMk5V9PUwcmndfmY1uLRJzT8Yn')
  const [secondPull, setSecondPull] = useState('https://gateway.pinata.cloud/ipfs/QmSoKLY9n55Hps7NhGMtQMk5V9PUwcmndfmY1uLRJzT8Yn')
  const [thirdPull, setThirdPull] = useState('https://gateway.pinata.cloud/ipfs/QmSoKLY9n55Hps7NhGMtQMk5V9PUwcmndfmY1uLRJzT8Yn')

  const [firstTarot, setFirstTarot] = useState('')
  const [secondTarot, setSecondTarot] = useState('')
  const [thirdTarot, setThirdTarot] = useState('')

  const [firstToken, setFirstToken] = useState('WETH:DAI')
  const [secondToken, setSecondToken] = useState('WETH:UNI')
  const [thirdToken, setThirdToken] = useState('WETH:FTX')

  const [loadCards, setLoadCards] = useState(false)
  const [cards, setCards] = useState({})

  const [dropdown1, setDropdown1] = useState(null)
  const [dropdown2, setDropdown2] = useState(null)
  const [dropdown3, setDropdown3] = useState(null)

  const [value1, setValue1] = useState(0)
  const [value2, setValue2] = useState(0)
  const [value3, setValue3] = useState(0)

  const [privacy, setPrivacy] = useState(true)
  const [trade, setTrade] = useState({})
  const [snapshot, setSnapshot] = useState('root')
  const [swapTx, setSwapTx] = useState('0x')

  const [walletSet, setWalletSet] = useState(false)
  const [akashic, setAkashic] = useState({})

  const [saveReady, setSaveReady] = useState(true)

  const layerType = () => {
    if(privacy){
      document.body.className = "Optimism";
      //document.body.style.backgroundColor = "white !important;";
      //document.body.style.backgroundColor = "white !important;";
      document.getElementsByClassName('title')[0].style.color = 'black'
      document.getElementsByClassName('pair')[0].style.color = 'black'
      document.getElementsByClassName('pair')[1].style.color = 'black'
      document.getElementsByClassName('pair')[2].style.color = 'black'
      setPrivacy(false)
    } else{
      document.body.className = "Aztec";
      document.getElementsByClassName('title')[0].style.color = 'white'
      document.getElementsByClassName('pair')[0].style.color = 'white'
      document.getElementsByClassName('pair')[1].style.color = 'white'
      document.getElementsByClassName('pair')[2].style.color = 'white'
      setPrivacy(true)
    }
  }

  const onSelect = (card, pullState) => {
    console.log(card)
    console.log(pullState)
    setPull(pullState, card)
  }

    useEffect(() => {
     // load cards 

     if(!walletSet){
       setWalletSet(true)
       setAkashic(new Akashic())
     }

     if(!loadCards){


       axios
        .get("https://rws-cards-api.herokuapp.com/api/v1/cards/")
        .then(function (response) {
         

          const cardNames = response.data.cards.map((card) => {
            return card.name
          })

          const dropdownComponent1 = <Dropdown style={{fontSize: '11.4px; !immportant;'}}options={cardNames} onChange={(e) => onSelect(e, 1)} placeholder="Select a Card" />;
          const dropdownComponent2 = <Dropdown style={{fontSize: '11.4px; !immportant;'}}options={cardNames} onChange={(e) => onSelect(e, 2)} placeholder="Select a Card" />;
          const dropdownComponent3 = <Dropdown style={{fontSize: '11.4px; !immportant;'}}options={cardNames} onChange={(e) => onSelect(e, 3)} placeholder="Select a Card" />;
          
          setDropdown1(dropdownComponent1)
          setDropdown2(dropdownComponent2)
          setDropdown3(dropdownComponent3)
          setLoadCards(true)
        })
     }
  })

  const portGatewayDecision = async (tx) => {

        console.log('firing gateway')

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

  const saveSnap = async () => {
    const tx = '0x'
    
    const node = {
      set: [{
        token: firstToken,
        card: firstTarot,
        isDecision: false,
        value: value1
      },{
        token: secondToken,
        card: secondTarot,
        isDecision: true,
        value: value2
      },{
        token: thirdToken,
        card: thirdTarot,
        isDecision: false,
        value: value3
      }],
      decision: {
        parent: snapshot,
        trade: tx,
        eth: props.address
      }
    }

    setSnapshot(await akashic.put(node, 'tarot'))
    console.log('SNAPSHOT')
    console.log(snapshot)
    // portGatewayDecision(swapTx)
  }

    const setPull = (pullState, tarot) => {
    switch(pullState){
      case 1:
          setFirstTarot(tarot.value)
          setFirstPull(deck[tarot.value]);
        break;
      case 2:
          setSecondTarot(tarot.value)
          setSecondPull(deck[tarot.value]);
        break;
      case 3:
          setThirdTarot(tarot.value)
          setThirdPull(deck[tarot.value])
        break;
      default:
        // signify error
        console.log('something went wrong')
    }
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

  const onSelectAmount = (amount, state) => {
    console.log(amount)
    switch(state){
      case 1:
        setValue1(amount.value)
        break;
      case 2:
        setValue2(amount.value)
        break;
      case 3:
        setValue3(amount.value)
        setSaveReady(false)
        break;
      default:
        // signify error
        console.log('something went wrong')
    }
  }

  return(
      <>  
          <h1 className='title' style={{color: 'white'}}>
                    R e e d
          </h1>
          <p onClick={() => props.action('atlas')} style={{fontSize: '34px', cursor: 'pointer'}}>🌎</p>
          <Grid container spacing={6}>
            <Grid item m={4}>
                {dropdown1}
                <br/>
                <div className="card">
                  <img width={"90%"} height={'90%'} src={firstPull}/>
                </div>
                <br />
                <Dropdown style={{fontSize: '11.4px; !immportant;'}} options={[0.1, 0.3, 0.5, 0.8, 1.3]} onChange={(e) => onSelectAmount(e, 1)} placeholder="Select a Value" />;

                <p className='pair'>{firstToken} {value1}</p>
                <Button variant="outlined" style={{background: '#e4e0db'}} onClick={async () => await executeTrade(firstPull)}>swap</Button>
            </Grid>

            <Grid item m={4}>
                {dropdown2}
                <br/>
                <div className="card">
                  <img width={"90%"} height={'90%'} src={secondPull}/>
                </div>
                <br />
                <Dropdown style={{fontSize: '11.4px; !immportant;'}} options={[0.1, 0.3, 0.5, 0.8, 1.3]} onChange={(e) => onSelectAmount(e, 2)} placeholder="Select a Value" />;
                <p className='pair'>{secondToken} {value2}</p>
                <Button variant="outlined" style={{background: '#e4e0db'}}>swap</Button>

            </Grid>

            <Grid item m={4}>
                {dropdown3}
                <br/>
                <div className="card">
                  <img width={"90%"} height={'90%'} src={thirdPull}/>
                </div>
                <br />
                <Dropdown style={{fontSize: '11.4px; !immportant;'}} options={[0.1, 0.3, 0.5, 0.8, 1.3]} onChange={(e) => onSelectAmount(e, 3)} placeholder="Select a Value" />;
                <p className='pair'>{thirdToken} {value3}</p>
                <Button variant="outlined" style={{background: '#e4e0db'}}>swap</Button>

            </Grid>
          </Grid>
          <Button id="saver" disabled={saveReady} variant="outlined" style={{background: 'white'}} onClick={saveSnap}>save</Button>
          <br />
          <input type="checkbox" id="switch" onClick={layerType}/><label for="switch">Toggle</label>
        </>
    )
}

function Home(props) {

  const revealClick = () => {
    props.action('mode')
  }

  return(
    <>
      <h1 className='title' style={{color: 'white'}}>
                R e e d
      </h1>
      <div class="circle">
        <div class="noise animated"></div>
      </div>
      <p style={{color: 'white', fontSize: '20px', cursor: 'pointer'}} onClick={() => revealClick()}>{"> reveal <"}</p>

    </>
  )
}
function ReedMode(props) {

  return(
    <>
      <h1 className='title' style={{color: 'white'}}>
                C h o o s e
      </h1>
      <Grid container spacing={6}>
        <Grid item m={6}>
          <div>
            Tarot
            <div onClick={() => props.action('tarot')} className="card">
              <img width={"90%"} height={'90%'} src={'https://gateway.pinata.cloud/ipfs/QmSoKLY9n55Hps7NhGMtQMk5V9PUwcmndfmY1uLRJzT8Yn'}/>
            </div>
          </div>
        </Grid>
        <Grid item m={6}>
          <div>
            I-Ching
            <div onClick={() => props.action('iching')} className="card">
              <img width={"90%"} height={'60%'} src={'https://gateway.pinata.cloud/ipfs/QmPzBsoPhNfTVTwAQMg57JMF89gPxyfv4Ld6Bd81wMX4u4'}/>
            </div>
          </div>
        </Grid>
      </Grid>
      <p style={{color: 'white', fontSize: '20px', cursor: 'pointer'}} onClick={() => props.action('akashic')}>{"> akashic <"}</p>
      <p style={{color: 'white', fontSize: '20px', cursor: 'pointer'}} onClick={() => props.action('timeline')}>{"> yours <"}</p>
    </>
  )
}

function App() {

  const handleClickAtlas = () => {
      setAtlas(true)
  }

  const handleClickReed = () => {
      setAtlas(false)
  }  


  const [atlas, setAtlas] = useState(false)
  const [wallet, setWallet] = useState({})
  const [isSet, setIsSet] = useState(false)
  const [view, setView] = useState('home')

  useEffect(() => {
    if(!isSet){
      const ak = new Akashic(true)
      setTimeout(() => {
        setWallet(ak.address)
        console.log('al.address')
        console.log(ak.address)
        setIsSet(true)
      },1000)
    }
  }, [wallet])

  const revealClick = () => {
    console.log('reveal')
  }

  let viewComponent;

  switch(view){
    case 'home':
      viewComponent = <Home action={setView}/>
      break;
    case 'mode':
      viewComponent = <ReedMode action={setView}/>
      break;
    case 'tarot':
      viewComponent = <Spreads address={wallet} action={setView}/>
      // viewComponent = <Tarot address={wallet} action={setView}/>
      break;
    case 'atlas':
      viewComponent = <AtlasView action={setView}/>
      break;
    case 'iching':
      viewComponent = <IChing action={setView}/>
      break;
    case 'timeline':
      viewComponent = <TimelineRecords wallet={wallet} action={setView}/>
      break;
    case 'akashic':
      viewComponent = <AkashicRecords wallet={wallet} action={setView}/>
      break;
  }

  return (
    <div className="App">
      {viewComponent}
    </div>
  );
}

export default App;
