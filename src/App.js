import React, {Component} from 'react'

// Socket IO
import socketIOClient from "socket.io-client";

// Charts
import DistanceChart from './components/DistanceChart'
import Map from './components/Map'

// Bootstrap and other jazz
import {Tabs, Tab} from 'react-bootstrap'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

const ENDPOINT = "http://127.0.0.1:3020";
const socket = socketIOClient(ENDPOINT);



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
    dataThree: {
      rssi:[],
      time:[],
      distance:[],
      winsor:[],
      henderson:[],
      kalman:[]
    },
      r1: 0,
      r2: 1,
      r3: 2,
      r4: 3
    }

  }
  
  componentWillMount() {

    socket.emit("get data", "data0");
    socket.emit("get data", "data1");
    socket.emit("get data", "data2");
    socket.emit("get data", "data3");

    socket.on("heres data", data => {
      console.log(data);

      if(data.file == "data0") {
        this.setState({dataZero:data, r1: data.kalman.slice(-1)[0]});
      } else if (data.file == "data1") {
        this.setState({dataOne:data, r2: data.kalman.slice(-1)[0]});
      } else if (data.file == "data2") {
        this.setState({dataTwo:data, r3: data.kalman.slice(-1)[0]});
      } else {
        this.setState({dataThree:data, r4: data.kalman.slice(-1)[0]});
      }
      
    });


    this.intervalID = setInterval(() => {this.updateData();}, 30000);
    this.radiusInterval = setInterval(() => {this.updateRadiuses();}, 30000);

  }

  updateData = () => {
    socket.emit("get data", "data0");
    socket.emit("get data", "data1");
    socket.emit("get data", "data2");
    socket.emit("get data", "data3");
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
          <DistanceChart data={this.state.dataZero}/>
        </Tab>

        <Tab eventKey="nodeOne" title="Node One">
          <DistanceChart data={this.state.dataOne}/>
        </Tab>

        <Tab eventKey="nodeTwo" title="Node Two">
          <DistanceChart data={this.state.dataTwo}/>
        </Tab>

        <Tab eventKey="nodeThree" title="Node Three">
          <DistanceChart data={this.state.dataThree}/>
        </Tab>

        <Tab eventKey="map" title="Map">
          <Map r1={this.state.r1} r2={this.state.r2} r3={this.state.r3} r4={this.state.r4}/>
        </Tab>

        <h1> Version 1</h1>

      </Tabs>

    </div>

    )
  }
}

export default App
