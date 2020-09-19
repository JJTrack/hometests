import React, { Component } from 'react'
import { Line } from 'react-chartjs-2';

class DistanceChart extends Component {

    constructor (props) {
        super(props);
        this.state = {
          chartData: {
              labels: this.props.time,
              datasets:[
                {
                  label:'RSSI (dBm / 10)',
                  data:this.props.rssi,
                  backgroundColor: 'rgba(255, 99, 132, 0.6)',
                  borderColor: 'rgba(255, 99, 132, 0.6)',
                  fill: false
                },
                {
                  label:'Distance (m)',
                  data:this.props.distance,
                  backgroundColor: 'rgba(255, 99, 132, 0.6)',
                  borderColor: 'rgba(255, 155, 132, 0.6)',
                  fill: false
                },
                {
                  label:'Winsor (m)',
                  data:this.props.winsor,
                  backgroundColor: 'rgba(99, 132, 255, 0.6)',
                  borderColor: 'rgba(99, 255, 55, 0.6)',
                  fill: false
                },
                {
                  label:'Henderson (m)',
                  data:this.props.henderson,
                  backgroundColor: 'rgba(255, 132, 255, 0.6)',
                  borderColor: 'rgba(255, 255, 55, 0.6)',
                  fill: false
                },
                {
                  label:'Kalman (m)',
                  data:this.props.kalman,
                  backgroundColor: 'rgba(99, 132, 255, 0.6)',
                  borderColor: 'rgba(99, 132, 255, 0.6)',
                  fill: false
                }
              ]
            }
          }
    }

    render() {
        return(
            <div className="chart">
                <Line
                    data={this.state.chartData}
                    options={{ maintainAspectRatio: true, 
                                responsive: true, 
                                scales: {
                                  yAxes: [{
                                    display: true,
                                    ticks: {
                                        suggestedMax: 5,
                                        beginAtZero: true   // minimum value will be 0.
                                    }
                                }]
                                }}}
                    />
            </div>
        )
    }

}

export default DistanceChart;