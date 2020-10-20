import React, { Component } from 'react'
import NumericInput from 'react-numeric-input';
import Canvas from 'react-responsive-canvas'
import Dropdown from 'react-bootstrap/Dropdown'
const trilat = require("trilat");


const node1 = {
    x: 0,
    y: 0,
    r: 0
}

const node2 = {
    x: 5,
    y: 0,
    r: 0
}

const node3 = {
    x: 5,
    y: 5,
    r: 0
}

const node4 = {
    x: 0,
    y: 5,
    r: 0
}

let nodes = [node1, node2, node3, node4];

let calc = {
    x: 0,
    y: 0,
    actualX: 1,
    actualY: 4
}


class Map extends Component {

    constructor (props) {
        super(props);

        this.state = {
            radiusState: "on",
        }
    
    }

    componentWillMount() {
        this.setState({
            canvasSize: {canvasWidth: 1000, canvasHeight: 1000}
        })
    }

    componentDidMount() {
        // const { canvasWidth, canvasHeight } = this.state.canvasSize;
        // this.canvasMap.width = canvasWidth;
        // this.canvasMap.height = canvasHeight;
        this.ctx = this.canvasMap.getContext("2d");
        this.drawNodesAndBeacons();
    }

    componentDidUpdate() {
        node1.r = this.props.r1;
        node2.r = this.props.r2;
        node3.r = this.props.r3;
        node4.r = this.props.r4;
        this.drawNodesAndBeacons();
    }

    drawNodesAndBeacons = () => {
        console.log(this.canvasMap.width)
        this.ctx.clearRect(0, 0, this.canvasMap.width, this.canvasMap.width);
        
        // Draw nodes
        nodes.forEach(node => {
            this.ctx.fillStyle = "rgba(255, 0, 50, 0.7)";
            let w, h;

            node.x == 0 ? w =  node.x * this.canvasMap.width/5 : w = node.x * this.canvasMap.width/5 - 20;
            node.y == 0 ? h =  node.y * this.canvasMap.height/5 : h = node.y * this.canvasMap.height/5 - 20;
            this.ctx.fillRect(w, h, 20, 20); 
        });

        // Draw beacon
        [calc.x, calc.y] = this.getCalculation(this.props.r1, this.props.r2, this.props.r3, this.props.r4);
        this.ctx.fillStyle = "rgba(100, 0, 200, 0.7)";
        this.ctx.fillRect( calc.x * this.canvasMap.width/5, calc.y  * this.canvasMap.height/5, 20, 20);
        
        
        // Draw expected beacon
        this.ctx.fillStyle = "rgba(0, 200, 200, 0.7)";
        this.ctx.fillRect( calc.actualX * this.canvasMap.height/5, calc.actualY  * this.canvasMap.height/5, 20, 20); 


        if(this.state.radiusState == "off") {
            this.drawRadiuses(this.ctx);
        }
    }

    drawRadiuses(ctx) {
        nodes.forEach(node => {
            console.log(node.x, node.y, node.r);
            ctx.beginPath();
            ctx.arc(node.x * this.canvasMap.height/5, node.y * this.canvasMap.width/5, node.r*this.canvasMap.height/5, 0, 2 * Math.PI, false);
            ctx.strokeStyle = 'rgba(100, 0, 200, 0.8)';
            ctx.fillStyle = 'rgba(100, 0, 200, 0.1)';
            ctx.stroke();
            ctx.fill();
            ctx.closePath();
        })
    }

    getCalculation = (r1, r2, r3, r4) => {

        let input = [
            [node1.x, node1.y, r1],
            [node2.x, node2.y, r2],
            [node3.x, node3.y, r3],
            [node4.x, node4.y, r4]
        ]

        let output = trilat(input);

        
        return output;
    }

    toggleRadius = () => {
        this.setState({
            radiusState: this.state.radiusState == "on" ? "off" : "on"
        })
    }

    updateX = (event) => {
        calc.actualX = event;
        this.drawNodesAndBeacons();
    }

    updateY = (event) => {
        calc.actualY = event;
        this.drawNodesAndBeacons();
    }
    

    render() {
        return(
            <div className="Map">

                <div className="mapContainer">
                    <Canvas canvasRef={canvasMap => this.canvasMap = canvasMap} onResize={this.drawNodesAndBeacons.bind(this)} className="canvas"/>
                </div>

                <div className="extras">

                    <Dropdown >
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Customise
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <div>
                                Custom X: <NumericInput min={0} max={5} value={1} onChange={this.updateX}/>
                                Custom Y: <NumericInput min={0} max={5} value={4} onChange={this.updateY}/>
                            </div>

                            <div className="custom-control custom-switch">
                                <input type="checkbox" className="custom-control-input" id="customSwitches" onChange={this.toggleRadius}></input>
                                <label className="custom-control-label" htmlFor="customSwitches">Turn radius {this.state.radiusState}</label>
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>
                    
                </div>

            </div>
        )
    }

}

export default Map;