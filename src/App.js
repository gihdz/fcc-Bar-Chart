import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import {Barchart, ScatterplotGraph, HeatMap} from './pages/';
import './css/Barchart.css';
import './css/ScatterplotGraph.css';
import './css/Heatmap.css';
import './App.css';

const Home = () => (
  <div>
    <h2>My FCC data visualization challenges</h2>
  </div>
)
const selecTestSuiteFor = (challenge) =>{
    setTimeout(() => {
            const fccSelector = document.getElementById("test-suite-selector");
            if(fccSelector){            
                fccSelector.value = challenge;
                fccSelector.onchange();
                /* auto run test snippet */
                // const fccTestButton = document.getElementById("fcc_test_message-box-rerun-button");
                // if(fccTestButton)
                // fccTestButton.onclick();
            }
        }, 500);  
}
export default class extends React.Component {
  render(){    
    const base = process.env.PUBLIC_URL;
    const homeUrl = `${base}/`;
    const barchartUrl = `${base}/barchart`;
    const scatterplotGraphUrl = `${base}/scatterplot`;
    const heatmaphUrl = `${base}/heatmap`;
    return ( 
    <Router>
    <div id="App-container" >
      <nav>
        <div className="dropdown">
  <button className="dropbtn">Menu</button>
  <div className="dropdown-content">
    <Link to={homeUrl}>Home</Link>
    <Link to={barchartUrl}>Barchart</Link>
    <Link to={scatterplotGraphUrl}>Scatterplot Graph</Link>
    <Link to={heatmaphUrl}>Heat Map</Link>
    
  </div>
</div>      
      </nav>
      {/*<ul id="App-nav" className="nav" >
        <li><Link to={homeUrl}>Home</Link></li>
        <li><Link to={barchartUrl}>Barchart</Link></li>
        <li><Link to={scatterplotGraphUrl}>Scatterplot Graph</Link></li>
        <li><Link to={heatmaphUrl}>Heat Map</Link></li>
      </ul>*/}
      <Route exact path={homeUrl} component={Home}/>
      <Route path={barchartUrl} render={props => <Barchart selecTestSuiteFor= {selecTestSuiteFor} {...props} />}/>
      <Route path={scatterplotGraphUrl} render={props => <ScatterplotGraph selecTestSuiteFor= {selecTestSuiteFor} {...props} />}/>
      <Route path={heatmaphUrl} render={props => <HeatMap selecTestSuiteFor= {selecTestSuiteFor} {...props} />}/>
    </div>
    </Router>);
  }
}