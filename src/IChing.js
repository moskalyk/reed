import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import _ from 'lodash';

import chingAPI from './hexagrams.js'

var iching = function () {
  var mChing = []; // main ching
  var eChing = []; // evolution ching
  var mChingPattern = [];
  var eChingPattern = [];
  var renderedMainChing = [];
  var renderedEvolutionChing = [];
  var linesCounter = 0;
  var isChanging = false;
  var mChingDescription;
  var eChingDescription;

  var buttons = document.getElementById('buttons');
  var throwButton = document.getElementById('throwbutton');
  var yang = document.getElementById('yang');
  var yin = document.getElementById('yin');
  var yangyang = document.getElementById('yangyang');
  var yinyin = document.getElementById('yinyin');

  var fetchButton = document.getElementById('fetchInfo');
  var resetButton = document.getElementById('reset');
  var mainChingContainer = document.getElementById('mainChingContainer');
  var mainChingDescription = document.getElementById('mainChingDescription');
  var evolvedChingContainer = document.getElementById('evolvedChingContainer');
  var evolvedChingDescription = document.getElementById('evolvedChingDescription');

  function incrementCounter() {
    return linesCounter++;
  };

  function genCoinValue() {
    return Math.floor(Math.random() * 2) + 2;
  };

  function addNumbers(first, second) {
    return first + second;
  }

  function sumNumbers(numbers) {
    return numbers.reduce(addNumbers);
  }

  function addToArray(originalValue) {
    var changingValue;
    if (originalValue === 6) {
      changingValue = 7;
      isChanging = true;
    } else if (originalValue === 9) {
      changingValue = 8;
      isChanging = true;
    } else {
      changingValue = originalValue;
    }
    mChing.push(originalValue);
    eChing.push(changingValue);
  };

  function determinePattern(ching) {
    var pattern = ching.map(function (value) {
      if (value === 6 || value == 8) {
        return 6;
      } else {
        return 9;
      }
    });
    return pattern.join('');
  }

  function generateNumbers() {
    var numbers = [];
    for (var i = 0; i < 3; i++) {
      // throw three coins
      var coin = genCoinValue();
      numbers.push(coin);
    }
    return sumNumbers(numbers);
  };

  function generateClasses(chingValues) {
    var renderedChing = chingValues.map(function (val) {
      switch (val) {
        case 6:
          return 'Line--changingBroken';
          break;
        case 7:
          return 'Line--unchangingSolid';
          break;
        case 8:
          return 'Line--unchangingBroken';
          break;
        case 9:
          return 'Line--changingSolid';
          break;}

    });
    return renderedChing;
  };

  function createHTML(ching, target) {
    ching.forEach(function (className) {
      var div = document.createElement('div');
      div.className = 'Line ' + className;
      target.appendChild(div);
    });
  };

  function reset() {
    // resetting arrays;
    mChing = [];
    eChing = [];
    mainChingContainer.innerHTML = '';
    mainChingDescription.innerHTML = '';
    evolvedChingContainer.innerHTML = '';
    evolvedChingDescription.innerHTML = '';
    linesCounter = 0;
    // throwButton.classList.remove('is-hidden');
  }

  function addLine(ching) {
    mainChingContainer.innerHTML = '';
    addToArray(ching);
    // addToArray(7);
    // addToArray(8);
    // addToArray(9);

    createHTML(generateClasses(mChing), mainChingContainer);
  }

  function checkForEvolution() {
    if (mChing.join('') != eChing.join('')) {
      evolvedChingContainer.innerHTML = '';
      createHTML(generateClasses(eChing), evolvedChingContainer);
    }
  }

  function hideThrowButton() {
    // throwButton.classList.add('is-hidden');
  }

  function writeDescription(description) {
    return `<h6>${description.hexnum}</h6>
            <h6>${description.title}</h6>
            <p>${description.image}</p>`;
  }

  function fetchInfo() {
    mChingPattern = determinePattern(mChing);
    mChingDescription = _.find(chingAPI, { 'pattern': mChingPattern });
    mainChingDescription.innerHTML = writeDescription(mChingDescription);
    if (mChing.join('') != eChing.join('')) {
      eChingPattern = determinePattern(eChing);
      eChingDescription = _.find(chingAPI, { 'pattern': eChingPattern });
      evolvedChingDescription.innerHTML = writeDescription(eChingDescription);
    } else {
      evolvedChingContainer.innerHTML = 'No Evolution';
    }
  }

  function throwCoin(ching) {
    incrementCounter();
    if (linesCounter < 6) {
      addLine(ching);
    } else {
      addLine(ching);
      hideThrowButton();
      checkForEvolution();
      fetchInfo();
    }
  };

  return {
    throwCoin: throwCoin,
    reset: reset,
    throwButton: throwButton,
    yin: yin,
    yinyin: yinyin,
    yang: yang,
    yangyang: yangyang,
    resetButton: resetButton };

};


function IChing() {
  const [establish, setEstablish] = useState(false)
  const [app, setApp] = useState({})
  useEffect(() => {
    if(!establish){
      document.body.className = "Optimism";
      const ching = iching()
      setApp(ching)
      ching.resetButton.addEventListener('click', () => {
        ching.reset();
      });
      setEstablish(true)
    }
  })

  const coinFlip = (ching) => {
    app.throwCoin(ching)
    console.log()
  }

  return (
    <>
      <div className="container" id="buttons" style={{marginTop: '69px'}}>
        <div className="row">
          <div style={{bottom: 0, width: '100%', paddingBottom: '39px'}}>
            {/*<button id="throwbutton">Throw</button>*/}
            <button id="throwbutton" onClick={() => coinFlip(7)}>+</button>
            <button id="throwbutton" onClick={() => coinFlip(8)}>-</button>
            <button id="throwbutton" onClick={() => coinFlip(9)}>++</button>
            <button id="throwbutton" onClick={() => coinFlip(6)}>--</button>
            <button className="btn" id="reset">Reset</button>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="column">
            <div id="mainChingContainer"></div><small id="mainChingDescription"></small>
          </div>
          <div className="column" style={{marginTop: '69px'}}>
            <div id="evolvedChingContainer"></div><small id="evolvedChingDescription"></small>
          </div>
        </div>
      </div>
    </>
  );
}

export default IChing;
