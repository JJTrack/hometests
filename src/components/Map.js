import React, { Component } from 'react'
import { Line } from 'react-chartjs-2';


const node1 = {
    x: 0,
    y: 0,
    z: 0
}

const node2 = {
    x: 29,
    y: 0,
    z: 0
}

const node3 = {
    x: 29,
    y: 29,
    z: 0
}

const beacon = {
    x: 7,
    y: 16,
    z: 0
}

const calc = {
    x: 7,
    y: 16,
    z: 0,
    r1: 0,
    r2: 0,
    r3: 0   
}

let nodes = [node1, node2, node3];




class Map extends Component {

    constructor (props) {
        super(props);
    
        this.state = {
            r1: this.props.r1
        }
    
    }

    componentWillMount() {
        this.setState({
            canvasSize: {canvasWidth: 600, canvasHeight: 600}
        })
    }

    componentDidMount() {
        const { canvasWidth, canvasHeight } = this.state.canvasSize;
        this.canvasMap.width = canvasWidth;
        this.canvasMap.height = canvasHeight;
        this.updateCalculation();
        this.drawNodesAndBeacons(this.canvasMap, nodes);
    }

    componentDidUpdate() {
        console.log(this.props.r1);
        this.updateCalculation();
        this.drawNodesAndBeacons(this.canvasMap, nodes);
    }

    drawNodesAndBeacons = (canvasID, nodes) => {
        const ctx = canvasID.getContext("2d");
        ctx.clearRect(0, 0, this.state.canvasSize.canvasWidth, this.state.canvasSize.canvasHeight);
        
        // Draw nodes
        nodes.forEach(node => {
            ctx.fillStyle = "rgba(255, 0, 50, 0.7)";
            ctx.fillRect(node.x * 20, node.y * 20, 20, 20); 
        });

        // Draw nodes with radiuses
        ctx.beginPath();
        ctx.arc(node1.x, node1.y, this.props.r1*200, 0, 2 * Math.PI, false);
        ctx.strokeStyle = 'rgba(255, 0, 100, 0.8)';
        ctx.fillStyle = 'rgba(255, 0, 100, 0.2)';
        ctx.stroke();
        ctx.fill();
        ctx.closePath();

        // Draw nodes with radiuses
        ctx.beginPath();
        ctx.arc(node2.x * 20, node2.y * 20, this.props.r2*200, 0, 2 * Math.PI, false);
        ctx.strokeStyle = 'rgba(255, 0, 100, 0.8)';
        ctx.fillStyle = 'rgba(255, 0, 100, 0.2)';
        ctx.stroke();
        ctx.fill();
        ctx.closePath();

        // Draw nodes with radiuses
        ctx.beginPath();
        ctx.arc(node3.x * 20, node3.y * 20, this.props.r3*200, 0, 2 * Math.PI, false);
        ctx.strokeStyle = 'rgba(255, 0, 100, 0.8)';
        ctx.fillStyle = 'rgba(255, 0, 100, 0.2)';
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }

    updateCalculation = () => {

        // Just using Three Cartesian dimensions, three measured slant ranges
 
        let rx = node3.x - node1.y;
        let ry = node2.y - node1.y;
    
        calc.x = ((Math.pow(this.props.r1, 2) - Math.pow(this.props.r3, 2)) + Math.pow(rx, 2)) / (rx*2);
        calc.y = ((Math.pow(this.props.r1, 2) - Math.pow(this.props.r2, 2)) + Math.pow(ry, 2)) / (ry*2);
    
    }
    

    render() {
        return(
            <div className="chart" >
                <canvas ref={canvasMap => this.canvasMap = canvasMap} className="Map"> </canvas>

                <h1> R1: {this.props.r1}</h1>
            </div>
        )
    }

}

export default Map;