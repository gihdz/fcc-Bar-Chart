import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import Barchart from './pages/Barchart'
import './css/Barchart.css'
import './App.css'

const Home = () => (
  <div>
    <h2>My FCC data visualization challenges</h2>
  </div>
)

const App = () => (
  <Router>
    <div>
      <ul className="nav" >
        <li><Link to="/">Home</Link></li>
        <li><Link to="/barchart">Barchart</Link></li>
      </ul>

      <hr/>

      <Route exact path="/" component={Home}/>
      <Route path="/barchart" component={Barchart}/>
    </div>
  </Router>
)
export default App