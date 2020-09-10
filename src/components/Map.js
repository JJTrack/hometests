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


class Map extends Component {

    constructor (props) {
        super(props);

        this.state = {
            radiusState: "on"
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
        let [y, x] = this.getCalculation(this.props.r1, this.props.r2, this.props.r3);
        ctx.fillStyle = "rgba(100, 0, 200, 0.7)";
        ctx.fillRect( x * 200, y  * 200, 20, 20);
        
        
        // Draw beacon
        [y, x] = this.getCalculation(2.14, 2.08, 2.14);
        ctx.fillStyle = "rgba(0, 200, 200, 0.7)";
        ctx.fillRect( x * 200, y  * 200, 20, 20); 

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
            [node3.x, node3.y, r3]
        ]

        let output = trilat(input);

        console.log("x: ", output[0], " y: ", output[1], r1, r2, r3);
        
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

                <canvas ref={canvasMap => this.canvasMap = canvasMap} className="Map"> </canvas>

                <div className="custom-control custom-switch">
                    <input type="checkbox" className="custom-control-input" id="customSwitches" onChange={this.toggleRadius}></input>
                    <label className="custom-control-label" htmlFor="customSwitches">Turn radius {this.state.radiusState}</label>
                </div>

            </div>
        )
    }

}

export default Map;