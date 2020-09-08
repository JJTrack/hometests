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
                  label:'Distance (m)',
                  data:this.props.distance,
                  backgroundColor: 'rgba(255, 99, 132, 0.6)'
                },
                {
                  label:'Filtered Distance (m)',
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