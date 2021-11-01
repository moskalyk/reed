import logo from './logo.svg';
import './App.css';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

function App() {
  return (
    <div className="App">
    
    <h1 className='title' style={{color: 'white'}}>
      R e e d
    </h1>

      <Grid container spacing={6}>
        <Grid item xs={4}>
            <div class="card">
              <img width={"90%"} height={'90%'} src={'https://www.trustedtarot.com/images/cards/CP.png'}/>
            </div>
        </Grid>

        <Grid item xs={4}>
            <div class="card">
              <img width={"90%"} height={'90%'} src={'https://www.trustedtarot.com/images/cards/W5.png'}/>

            </div>
        </Grid>

        <Grid item xs={4}>
            <div class="card">
              <img width={"90%"} height={'90%'} src={'https://www.trustedtarot.com/images/cards/04.png'}/>
            </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
