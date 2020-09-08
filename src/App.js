import React, {Component} from 'react'
import KalmanFilter from 'kalmanjs'
import RssiChart from './components/RssiChart'
import DistanceChart from './components/DistanceChart'
import Map from './components/Map'
import {Tabs, Tab} from 'react-bootstrap'
import { csv } from 'd3'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';


let A = -65.7;
let n = 2;

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      rssi:[],
      time:[],
      distance:[],
      kalman:[],
      r1: 2,
      r2: 2
    }

  }

  componentWillMount() {

    csv('data/data0.csv').then(async (data) => {
      await data.forEach(row => {
        
        this.state.rssi.push(row.RSSI);
        this.state.time.push(row.TIME);
        let kf = new KalmanFilter({R: 0.00001, Q: 10});
        this.state.rssi.map((rssi) => {
            let exponent = (A - (parseInt(rssi, 10)*-1))/(10*n)
            this.state.distance.push(Math.exp(exponent));
            this.state.kalman.push(kf.filter(Math.exp(exponent)));
          })
        })

        const sum = this.state.kalman.reduce((a, b) => {
          return a + b;
        }, 0)

        this.setState({r1: sum/this.state.distance.length});

    });

    csv('data/data1.csv').then(async (data) => {
      let rssiList = [];
      let time = [];
      let distance = [];
      let kalman = [];

      await data.forEach(row => {

        rssiList.push(row.RSSI);
        time.push(row.TIME);
        let kf = new KalmanFilter({R: 0.00001, Q: 10});

        rssiList.map((rssi) => {
            let exponent = (A - (parseInt(rssi, 10)*-1))/(10*n)
            distance.push(Math.exp(exponent));
            kalman.push(kf.filter(Math.exp(exponent)));
          })
        })

        const sum = kalman.reduce((a, b) => {
          return a + b;
        }, 0)

        this.setState({r2: sum/this.state.distance.length});
    });

    csv('data/data2.csv').then(async (data) => {
      let rssiList = [];
      let time = [];
      let distance = [];
      let kalman = [];

      await data.forEach(row => {

        rssiList.push(row.RSSI);
        time.push(row.TIME);
        let kf = new KalmanFilter({R: 0.00001, Q: 10});

        rssiList.map((rssi) => {
            let exponent = (A - (parseInt(rssi, 10)*-1))/(10*n)
            distance.push(Math.exp(exponent));
            kalman.push(kf.filter(Math.exp(exponent)));
          })
        })

        const sum = kalman.reduce((a, b) => {
          return a + b;
        }, 0)

        this.setState({r3: sum/this.state.distance.length});
    });

  }

  render() {
   return( 
    <div className='App'>
      <Tabs defaultActiveKey="map" id="uncontrolled-tab-example">
        <Tab eventKey="data" title="Data">
          <RssiChart time={this.state.time} rssi={this.state.rssi}/>
          <DistanceChart time={this.state.time} distance={this.state.distance} kalman={this.state.kalman}/>
        </Tab>
        <Tab eventKey="map" title="Map">
          <Map r1={this.state.r1} r2={this.state.r2} r3={this.state.r3}/>
        </Tab>
      </Tabs>
    </div>


    )
  }
}

export default App
