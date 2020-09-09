import React, {Component} from 'react'
import KalmanFilter from 'kalmanjs'
import RssiChart from './components/RssiChart'
import DistanceChart from './components/DistanceChart'
import Map from './components/Map'
import {Tabs, Tab, DropdownButton, Dropdown} from 'react-bootstrap'
import { csv } from 'd3'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';


let A = -65.7;
let n = 2;

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      dataZero: {rssi:[],
      time:[],
      distance:[],
      kalman:[]
    },
    dataOne: {rssi:[],
      time:[],
      distance:[],
      kalman:[]
    },
    dataTwo: {rssi:[],
      time:[],
      distance:[],
      kalman:[]
    },
      r1: 2,
      r2: 2,
      r3: 2
    }

  }

  componentWillMount() {

    csv('data/data0.csv').then(async (data) => {
      await data.forEach(row => {
        
        this.state.dataZero.rssi.push(row.RSSI);
        this.state.dataZero.time.push(row.TIME);
        let kf = new KalmanFilter({R: 0.00001, Q: 10});
        this.state.dataZero.rssi.map((rssi) => {
            let exponent = (A - (parseInt(rssi, 10)*-1))/(10*n)
            this.state.dataZero.distance.push(Math.exp(exponent));
            this.state.dataZero.kalman.push(kf.filter(Math.exp(exponent)));
          })
        })

        const sum = this.state.dataZero.kalman.reduce((a, b) => {
          return a + b;
        }, 0)

        this.setState({r1: sum/this.state.dataZero.distance.length});

    });

    csv('data/data1.csv').then(async (data) => {
      await data.forEach(row => {
        
        this.state.dataOne.rssi.push(row.RSSI);
        this.state.dataOne.time.push(row.TIME);
        let kf = new KalmanFilter({R: 0.00001, Q: 10});
        this.state.dataOne.rssi.map((rssi) => {
            let exponent = (A - (parseInt(rssi, 10)*-1))/(10*n)
            this.state.dataOne.distance.push(Math.exp(exponent));
            this.state.dataOne.kalman.push(kf.filter(Math.exp(exponent)));
          })
        })

        const sum = this.state.dataOne.kalman.reduce((a, b) => {
          return a + b;
        }, 0)

        this.setState({r2: sum/this.state.dataOne.distance.length});

    });

    csv('data/data2.csv').then(async (data) => {
      await data.forEach(row => {
        
        this.state.dataTwo.rssi.push(row.RSSI);
        this.state.dataTwo.time.push(row.TIME);
        let kf = new KalmanFilter({R: 0.00001, Q: 10});
        this.state.dataTwo.rssi.map((rssi) => {
            let exponent = (A - (parseInt(rssi, 10)*-1))/(10*n)
            this.state.dataTwo.distance.push(Math.exp(exponent));
            this.state.dataTwo.kalman.push(kf.filter(Math.exp(exponent)));
          })
        })

        const sum = this.state.dataTwo.kalman.reduce((a, b) => {
          return a + b;
        }, 0)

        this.setState({r3: sum/this.state.dataTwo.distance.length});

    });

  }

  render() {
   return( 
    <div className='App'>
      <Tabs defaultActiveKey="map" id="uncontrolled-tab-example">
        <Tab eventKey="nodeZero" title="Node Zero">
          <RssiChart time={this.state.dataZero.time} rssi={this.state.dataZero.rssi}/>
          <DistanceChart time={this.state.dataZero.time} distance={this.state.dataZero.distance} kalman={this.state.dataZero.kalman}/>
        </Tab>

        <Tab eventKey="nodeOne" title="Node One">
          <RssiChart time={this.state.dataOne.time} rssi={this.state.dataOne.rssi}/>
          <DistanceChart time={this.state.dataOne.time} distance={this.state.dataOne.distance} kalman={this.state.dataOne.kalman}/>
        </Tab>

        <Tab eventKey="nodeTwo" title="Node Two">
          <RssiChart time={this.state.dataTwo.time} rssi={this.state.dataTwo.rssi}/>
          <DistanceChart time={this.state.dataTwo.time} distance={this.state.dataTwo.distance} kalman={this.state.dataTwo.kalman}/>
        </Tab>

        <Tab eventKey="map" title="Map">
          <Map r1={this.state.r1} r2={this.state.r2} r3={this.state.r3}/>
        </Tab>
        
        <DropdownButton id="dropdown-button-drop-down" title="Dropdownbutton">
          <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
          <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
        </DropdownButton>

      </Tabs>


    </div>


    )
  }
}

export default App
