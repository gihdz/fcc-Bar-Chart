import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import {Barchart, ScatterplotGraph} from './pages/';
import './css/Barchart.css';
import './css/ScatterplotGraph.css';
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
    return ( 
    <Router>
    <div id="App-container" >
      <ul id="App-nav" className="nav" >
        <li><Link to={homeUrl}>Home</Link></li>
        <li><Link to={barchartUrl}>Barchart</Link></li>
        <li><Link to={scatterplotGraphUrl}>Scatterplot Graph</Link></li>
      </ul>

      <Route exact path={homeUrl} component={Home}/>
      <Route path={barchartUrl} render={props => <Barchart selecTestSuiteFor= {selecTestSuiteFor} {...props} />}/>
      <Route path={scatterplotGraphUrl} render={props => <ScatterplotGraph selecTestSuiteFor= {selecTestSuiteFor} {...props} />}/>
    </div>
    </Router>);
  }
  componentDidMount(){
    setTimeout(() => {
      const nav = document.getElementById("App-nav");
      const fccTestPanel = document.getElementById("fcc_test_suite_indicator_wrapper").parentElement;      
      if(fccTestPanel){
        nav.addEventListener("mouseover",() => {
          fccTestPanel.style.display = "none";
        } , false);
        nav.addEventListener("mouseout",() => {
          fccTestPanel.style.display = "block";
        } , false);
      }
    },1000);
  }  
}