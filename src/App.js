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

      folder: "5m/threextwo",
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

  // Get data from csv files and put into appropriate arrays
  collateData = (file, dataObj) => {
    csv(`${process.env.PUBLIC_URL}/data/${this.state.folder}/${file}`).then(async (data) => {

      await data.forEach(row => {

        // Get rssi and time from csv file
        dataObj.rssi.push(row.RSSI);
        dataObj.time.push(row.TIME);
        
        // Applying rssi to distance formula here
        dataObj.rssi.forEach((rssi) => {
            let exponent = (A - (parseInt(rssi, 10)*-1))/(10*n)
            dataObj.distance.push(Math.exp(exponent));
            
          })
        })

        // Winsorise the data to remove extremeties
        // takes array of data, number between 0 and 0.5 for sensitivity 
        //(how much error to allow), and true or false for replacing array in place
        let winsorize = unirand.winsorize;
        winsorize(dataObj.distance, 0.01, false).forEach((data) => {
          dataObj.winsor.push(data);
        });

        // rolling average using 23 term henderson moving average
        let hend = await unirand.smooth(dataObj.winsor, {
          policy: 'H23-MA'
        })
        
        hend.forEach( async (data) => {
          dataObj.henderson.push(data);
        });

        // Kalman filtering
        let kf = new KalmanFilter({R: 0.00001, Q: 3});
        hend.forEach( async (data) => {
          dataObj.kalman.push(kf.filter(data));
        });

        let r = dataObj.kalman[dataObj.rssi.length];
        console.log(dataObj.rssi.length, "a;sldkfj;lkasdf");

        if(file == "data0.csv") {
          this.setState({r1: r});
        } else if(file == "data1.csv") {
          this.setState({r2: r});
        } else {
          this.setState({r3: r});
        }

    });

    return dataObj.kalman[-1];
  }

  componentWillMount() {

    this.collateData("data0.csv", this.state.dataZero);
    this.collateData("data1.csv", this.state.dataOne);
    this.collateData("data2.csv", this.state.dataTwo);

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
