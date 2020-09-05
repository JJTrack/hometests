import React, {Component} from 'react'
import Chart from './components/Chart'
import { csv } from 'd3'
import './App.css'

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      rssi:[],
      time:[]
    }

  }

  componentDidMount() {

    csv('data0.csv').then(data => {
      data.forEach(row => {
        
        this.state.rssi.push(row.RSSI);
        this.state.time.push(row.TIME);
      })
    });

  }

  render() {
   return( 
    <div className='App'>
      <Chart time={this.state.time} rssi={this.state.rssi}/>
    </div>)
  }
}

export default App
