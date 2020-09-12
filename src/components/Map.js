import React, { Component } from 'react'
const trilat = require("trilat");


const node1 = {
    x: 0,
    y: 0,
    r: 0
}

const node2 = {
    x: 4.9,
    y: 0,
    r: 0
}

const node3 = {
    x: 4.9,
    y: 4.9,
    r: 0
}

let nodes = [node1, node2, node3];

let calc = {
    x: 0,
    y: 0,
    actualX: 2.5,
    actualY: 2.5
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
        const { canvasWidth, canvasHeight } = this.state.canvasSize;
        this.canvasMap.width = canvasWidth;
        this.canvasMap.height = canvasHeight;
        this.drawNodesAndBeacons(this.canvasMap, nodes);
    }

    componentDidUpdate() {
        node1.r = this.props.r1;
        node2.r = this.props.r2;
        node3.r = this.props.r3;
        this.drawNodesAndBeacons(this.canvasMap, nodes);
    }

    drawNodesAndBeacons = (canvasID, nodes) => {
        const ctx = canvasID.getContext("2d");
        ctx.clearRect(0, 0, this.state.canvasSize.canvasWidth, this.state.canvasSize.canvasHeight);
        
        // Draw nodes
        nodes.forEach(node => {
            ctx.fillStyle = "rgba(255, 0, 50, 0.7)";
            ctx.fillRect(node.x * 200, node.y * 200, 20, 20); 
        });

        // Draw beacon
        [calc.x, calc.y] = this.getCalculation(this.props.r1, this.props.r2, this.props.r3);
        ctx.fillStyle = "rgba(100, 0, 200, 0.7)";
        ctx.fillRect( calc.x * 200, calc.y  * 200, 20, 20);
        
        
        // Draw expected beacon
        ctx.fillStyle = "rgba(0, 200, 200, 0.7)";
        ctx.fillRect( calc.actualX * 200, calc.actualY  * 200, 20, 20); 


        if(this.state.radiusState == "off") {
            this.drawRadiuses(ctx);
        }
    }

    drawRadiuses(ctx) {
        nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x * 200, node.y * 200, node.r*200, 0, 2 * Math.PI, false);
            ctx.strokeStyle = 'rgba(100, 0, 200, 0.8)';
            ctx.fillStyle = 'rgba(100, 0, 200, 0.1)';
            ctx.stroke();
            ctx.fill();
            ctx.closePath();
        })
    }

    getCalculation = (r1, r2, r3) => {

        let input = [
            [node1.x, node1.y, r1],
            [node2.x, node2.y, r2],
            [node3.x, node3.y, r3],
            [node2.x, node2.y, r2]
        ]

        let output = trilat(input);

        
        return output;
    }

    toggleRadius = () => {
        this.setState({
            radiusState: this.state.radiusState == "on" ? "off" : "on"
        })
    }
    

    render() {
        return(
            <div className="chart">

                <div className="mapContainer">
                    <canvas ref={canvasMap => this.canvasMap = canvasMap} className="Map"> </canvas>
                </div>

                <div className="extras">

                    <h1>Calculations</h1>

                    <p>Actual X: {calc.actualX}</p> 
                    <p>Calculated X: {calc.x}</p> 
                    <p>Actual Y: {calc.actualY}</p> 
                    <p>Calculated Y: {calc.y}</p> 


                    <div className="custom-control custom-switch">
                        <input type="checkbox" className="custom-control-input" id="customSwitches" onChange={this.toggleRadius}></input>
                        <label className="custom-control-label" htmlFor="customSwitches">Turn radius {this.state.radiusState}</label>
                    </div>
                </div>

            </div>
        )
    }

}

export default Map;