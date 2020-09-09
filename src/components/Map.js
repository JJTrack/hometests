import React, { Component } from 'react'


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
            canvasSize: {canvasWidth: 600, canvasHeight: 600}
        })
    }

    componentDidMount() {
        const { canvasWidth, canvasHeight } = this.state.canvasSize;
        this.canvasMap.width = canvasWidth;
        this.canvasMap.height = canvasHeight;
        this.drawNodesAndBeacons(this.canvasMap, nodes);
    }

    componentDidUpdate() {
        this.updateCalculation(this.props.r1, this.props.r2, this.props.r3);
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

        if(this.state.radiusState == "off") {
            ctx.beginPath();
            ctx.arc(node1.x, node1.y, this.props.r1*200, 0, 2 * Math.PI, false);
            ctx.strokeStyle = 'rgba(255, 0, 100, 0.8)';
            ctx.fillStyle = 'rgba(255, 0, 100, 0.2)';
            ctx.stroke();
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.arc(node2.x * 20, node2.y * 20, this.props.r2*200, 0, 2 * Math.PI, false);
            ctx.strokeStyle = 'rgba(255, 0, 100, 0.8)';
            ctx.fillStyle = 'rgba(255, 0, 100, 0.2)';
            ctx.stroke();
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.arc(node3.x * 20, node3.y * 20, this.props.r3*200, 0, 2 * Math.PI, false);
            ctx.strokeStyle = 'rgba(255, 0, 100, 0.8)';
            ctx.fillStyle = 'rgba(255, 0, 100, 0.2)';
            ctx.stroke();
            ctx.fill();
            ctx.closePath();
        }
    }

    updateCalculation = (r1, r2, r3) => {
        let x, y;
        // Just using Three Cartesian dimensions, three measured slant ranges
        let rx = 29;
        let ry = 29;
    
        x = ((Math.pow(r1, 2) - Math.pow(r3, 2)) + Math.pow(rx, 2)) / (rx*2);
        y = ((Math.pow(r1, 2) - Math.pow(r2, 2)) + Math.pow(ry, 2)) / (ry*2);

        console.log("x: ", x, " y: ", y, r1, r2, r3); 
    }

    toggleRadius = () => {
        this.setState({
            radiusState: this.state.radiusState == "on" ? "off" : "on"
        })
    }
    

    render() {
        return(
            <div className="chart" >
                <canvas ref={canvasMap => this.canvasMap = canvasMap} className="Map"> </canvas>
                <div class="custom-control custom-switch">
                    <input type="checkbox" class="custom-control-input" id="customSwitches" onChange={this.toggleRadius}></input>
                    <label class="custom-control-label" for="customSwitches">Turn radius {this.state.radiusState}</label>
                </div>
            </div>
        )
    }

}

export default Map;