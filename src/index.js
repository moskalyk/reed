import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.js';
import Atlas from './Atlas.js';
import reportWebVitals from './reportWebVitals';
import { Router, Route, Switch } from 'react-router-dom';
import history from './history';
import json from './json';

ReactDOM.render(
  <React.StrictMode>
    <Router history={history}>
      <Switch>
          <Route exact path="/"> <App /> </Route>
          <Route exact path="/atlas"> <Atlas data={json} activeNode={json[0]} /> </Route>
       </Switch>
      </Router>,
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
