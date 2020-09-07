import React, {Component} from 'react'
import KalmanFilter from 'kalmanjs'
import RssiChart from './components/RssiChart'
import DistanceChart from './components/DistanceChart'
import KalmanChart from './components/KalmanChart'
import { csv } from 'd3'
import './App.css'


let A = -65.7;
let n = 2;

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      rssi:[],
      time:[],
      distance:[],
      kalman:[]
    }

  }

  componentDidMount() {

    csv('data0.csv').then(async (data) => {
      await data.forEach(row => {
        
        this.state.rssi.push(row.RSSI);
        this.state.time.push(row.TIME);
        let kf = new KalmanFilter({R: 0.015, Q: 3});
        this.state.rssi.map((rssi) => {

            let exponent = (A - (parseInt(rssi, 10)*-1))/(10*n)
            this.state.distance.push(Math.exp(exponent));

            this.state.kalman.push(kf.filter(Math.exp(exponent)));
          })
        })

    });

  }

  render() {
   return( 
    <div className='App'>
      <RssiChart time={this.state.time} rssi={this.state.rssi}/>
      <DistanceChart time={this.state.time} distance={this.state.distance}/>
      <KalmanChart time={this.state.time} distance={this.state.kalman}/>
    </div>)
  }
}

export default App
