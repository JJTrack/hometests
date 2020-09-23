import React, {Component, useEffect} from 'react'

// Socket IO
import socketIOClient from "socket.io-client";


// Data smoothening libraries
import KalmanFilter from 'kalmanjs'
import unirand from 'unirand'

// Charts
import DistanceChart from './components/DistanceChart'
import Map from './components/Map'

// Bootstrap and other jazz
import {Tabs, Tab} from 'react-bootstrap'
import { csv } from 'd3'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

const ENDPOINT = "http://127.0.0.1:3020";
let A = -56;
let n = 2;

class App extends Component {
  constructor (props) {
    super(props)

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
      r1: 0,
      r2: 1,
      r3: 2
    }

  }

  // Get data from csv files and put into appropriate arrays
  collateData = async (file, dataObj, isLive) => {
    csv(`${process.env.PUBLIC_URL}/data/${this.state.folder}/${file}`).then(async (data) => {

      if(isLive) {
        dataObj.rssi.shift();
        dataObj.time.shift();
        dataObj.distance.shift();
        let row = await data.slice(-1)[0];
        dataObj.rssi.push(parseInt(row.RSSI, 10) / 10);
        dataObj.time.push(row.TIME);
        let exponent = (A - (parseInt(row.RSSI, 10) *-1))/(10*n)
        dataObj.distance.push(Math.exp(exponent));
        dataObj.winsor.shift();
        dataObj.henderson.shift();
        dataObj.kalman.shift(); 

      } else {
          await data.slice(Math.max(data.length - 24, 0)).forEach(row => {

            // Get rssi and time from csv file
            dataObj.rssi.push(parseInt(row.RSSI, 10) / 10);
            dataObj.time.push(row.TIME);
            
            // Applying rssi to distance formula here
            let exponent = (A - (parseInt(row.RSSI, 10) *-1))/(10*n)
            dataObj.distance.push(Math.exp(exponent));      
            
        })
      }


        // Winsorise the data to remove extremeties
        // takes array of data, number between 0 and 0.5 for sensitivity 
        //(how much error to allow), and true or false for replacing array in place
        let winsorize = unirand.winsorize;
        winsorize(dataObj.distance, 0.3, false).forEach((data) => {
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



    });

    return dataObj.kalman[-1];
  }




  componentWillMount() {
    const socket = socketIOClient(ENDPOINT);
    socket.emit("get data", "data");
    socket.on("heres data", data => {
      console.log(data);
    });

    this.collateData("data0.csv", this.state.dataZero, false);
    this.collateData("data1.csv", this.state.dataOne, false);
    this.collateData("data2.csv", this.state.dataTwo, false);
    this.intervalID = setInterval(() => {this.updateData();}, 1000);
    this.radiusInterval = setInterval(() => {this.updateRadiuses();}, 5000);

  }

  updateData = () => {
    this.collateData("data0.csv", this.state.dataZero, true);
    this.collateData("data1.csv", this.state.dataOne, true);
    this.collateData("data2.csv", this.state.dataTwo, true);
  }

  updateRadiuses = () => {
    let newr1 = this.state.dataZero.kalman.slice(-1)[0];
    let newr2 = this.state.dataOne.kalman.slice(-1)[0];
    let newr3 = this.state.dataTwo.kalman.slice(-1)[0];
    this.setState({r1: newr1, r2: newr2, r3: newr3});
  }


  render() {
    
   return( 
    <div className='App'>

      <Tabs defaultActiveKey="map" id="uncontrolled-tab-example">
        <Tab eventKey="nodeZero" title="Node Zero">
          <DistanceChart time={this.state.dataZero.time} rssi={this.state.dataZero.rssi} distance={this.state.dataZero.distance} kalman={this.state.dataZero.kalman} winsor={this.state.dataZero.winsor} henderson={this.state.dataZero.henderson}/>
        </Tab>

        <Tab eventKey="nodeOne" title="Node One">
          <DistanceChart time={this.state.dataOne.time} rssi={this.state.dataOne.rssi} distance={this.state.dataOne.distance} kalman={this.state.dataOne.kalman}  winsor={this.state.dataOne.winsor} henderson={this.state.dataOne.henderson}/>
        </Tab>

        <Tab eventKey="nodeTwo" title="Node Two">
          <DistanceChart time={this.state.dataTwo.time} rssi={this.state.dataTwo.rssi} distance={this.state.dataTwo.distance} kalman={this.state.dataTwo.kalman}  winsor={this.state.dataTwo.winsor} henderson={this.state.dataTwo.henderson}/>
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
