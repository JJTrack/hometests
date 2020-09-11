import React, {Component} from 'react'

// Data smoothening libraries
import KalmanFilter from 'kalmanjs'
import unirand from 'unirand'

// Charts
import RssiChart from './components/RssiChart'
import DistanceChart from './components/DistanceChart'
import Map from './components/Map'

// Bootstrap and other jazz
import {Tabs, Tab} from 'react-bootstrap'
import { csv } from 'd3'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';


let A = -58;
let n = 2;

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {

      folder: "5m/center",
      dataZero: {
        rssi:[],
        time:[],
        distance:[],
        winsor:[],
        henderson:[],
        kalman:[]
    },
    dataOne: {
      rssi:[],
      time:[],
      distance:[],
      winsor:[],
      henderson:[],
      kalman:[]
    },
    dataTwo: {
      rssi:[],
      time:[],
      distance:[],
      winsor:[],
      henderson:[],
      kalman:[]
    },
      r1: 2,
      r2: 2,
      r3: 2
    }

  }

  componentDidMount() {

    csv(`${process.env.PUBLIC_URL}/data/${this.state.folder}/data0.csv`).then(async (data) => {

      await data.forEach(row => {
        this.state.dataZero.rssi.push(row.RSSI);
        this.state.dataZero.time.push(row.TIME);
        
        
        this.state.dataZero.rssi.map((rssi) => {
            let exponent = (A - (parseInt(rssi, 10)*-1))/(10*n)
            this.state.dataZero.distance.push(Math.exp(exponent));
            
          })
        })

        let winsorize = unirand.winsorize;
        winsorize(this.state.dataZero.distance, 0.01, false).forEach((data) => {
          this.state.dataZero.winsor.push(data);
        });

        let hend = await unirand.smooth(this.state.dataZero.winsor, {
          policy: 'H23-MA'
        })
        
        hend.forEach( async (data) => {
          this.state.dataZero.henderson.push(data);
        });

        let kf = new KalmanFilter({R: 0.00001, Q: 3});
        hend.forEach( async (data) => {
          this.state.dataZero.kalman.push(kf.filter(data));
        });


        const sum = this.state.dataZero.kalman.reduce((a, b) => {
          return a + b;
        }, 0)

        this.setState({r1: sum/this.state.dataZero.kalman.length});

    });

    csv(`${process.env.PUBLIC_URL}/data/${this.state.folder}/data1.csv`).then(async (data) => {

      await data.forEach(row => {
        this.state.dataOne.rssi.push(row.RSSI);
        this.state.dataOne.time.push(row.TIME);
        
        
        this.state.dataOne.rssi.map((rssi) => {
            let exponent = (A - (parseInt(rssi, 10)*-1))/(10*n)
            this.state.dataOne.distance.push(Math.exp(exponent));
            
          })
        })

        let winsorize = unirand.winsorize;
        winsorize(this.state.dataOne.distance, 0.01, false).forEach((data) => {
          this.state.dataOne.winsor.push(data);
        });

        let hend = await unirand.smooth(this.state.dataOne.winsor, {
          policy: 'H23-MA'
        })
        
        hend.forEach( async (data) => {
          this.state.dataOne.henderson.push(data);
        });

        let kf = new KalmanFilter({R: 0.00001, Q: 3});
        hend.forEach( async (data) => {
          this.state.dataOne.kalman.push(kf.filter(data));
        });


        const sum = this.state.dataOne.kalman.reduce((a, b) => {
          return a + b;
        }, 0)

        this.setState({r1: sum/this.state.dataOne.kalman.length});

    });

    csv(`${process.env.PUBLIC_URL}/data/${this.state.folder}/data2.csv`).then(async (data) => {

      await data.forEach(row => {
        this.state.dataTwo.rssi.push(row.RSSI);
        this.state.dataTwo.time.push(row.TIME);
        
        
        this.state.dataTwo.rssi.map((rssi) => {
            let exponent = (A - (parseInt(rssi, 10)*-1))/(10*n)
            this.state.dataTwo.distance.push(Math.exp(exponent));
            
          })
        })

        let winsorize = unirand.winsorize;
        winsorize(this.state.dataOne.distance, 0.01, false).forEach((data) => {
          this.state.dataTwo.winsor.push(data);
        });

        let hend = await unirand.smooth(this.state.dataTwo.winsor, {
          policy: 'H23-MA'
        })
        
        hend.forEach( async (data) => {
          this.state.dataTwo.henderson.push(data);
        });

        let kf = new KalmanFilter({R: 0.00001, Q: 3});
        hend.forEach( async (data) => {
          this.state.dataTwo.kalman.push(kf.filter(data));
        });


        const sum = this.state.dataTwo.kalman.reduce((a, b) => {
          return a + b;
        }, 0)

        this.setState({r1: sum/this.state.dataTwo.kalman.length});

    });

  }

  render() {
   return( 
    <div className='App'>

      <Tabs defaultActiveKey="map" id="uncontrolled-tab-example">
        <Tab eventKey="nodeZero" title="Node Zero">
          <RssiChart time={this.state.dataZero.time} rssi={this.state.dataZero.rssi}/>
          <DistanceChart time={this.state.dataZero.time} distance={this.state.dataZero.distance} kalman={this.state.dataZero.kalman} winsor={this.state.dataZero.winsor} henderson={this.state.dataZero.henderson}/>
        </Tab>

        <Tab eventKey="nodeOne" title="Node One">
          <RssiChart time={this.state.dataOne.time} rssi={this.state.dataOne.rssi}/>
          <DistanceChart time={this.state.dataOne.time} distance={this.state.dataOne.distance} kalman={this.state.dataOne.kalman}  winsor={this.state.dataOne.winsor} henderson={this.state.dataOne.henderson}/>
        </Tab>

        <Tab eventKey="nodeTwo" title="Node Two">
          <RssiChart time={this.state.dataTwo.time} rssi={this.state.dataTwo.rssi}/>
          <DistanceChart time={this.state.dataTwo.time} distance={this.state.dataTwo.distance} kalman={this.state.dataTwo.kalman}  winsor={this.state.dataTwo.winsor} henderson={this.state.dataTwo.henderson}/>
        </Tab>

        <Tab eventKey="map" title="Map">
          <Map r1={this.state.r1} r2={this.state.r2} r3={this.state.r3}/>
        </Tab>

        <h1> Version 1</h1>

      </Tabs>

    </div>

    )
  }
}

export default App
