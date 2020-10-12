import React, { Component } from 'react'
import { Line } from 'react-chartjs-2';

class DistanceChart extends Component {

    constructor (props) {
        super(props);

      this.state = {chartData : {
          labels: this.props.data.time,
          datasets:[
            {
              label:'Distance (m)',
              data:this.props.data.distance,
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 155, 132, 0.6)',
              fill: false
            },
            {
              label:'Winsor (m)',
              data:this.props.data.winsor,
              backgroundColor: 'rgba(99, 132, 255, 0.6)',
              borderColor: 'rgba(99, 255, 55, 0.6)',
              fill: false
            },
            {
              label:'Henderson (m)',
              data:this.props.data.henderson,
              backgroundColor: 'rgba(255, 132, 255, 0.6)',
              borderColor: 'rgba(255, 255, 55, 0.6)',
              fill: false
            },
            {
              label:'Kalman (m)',
              data:this.props.data.kalman,
              backgroundColor: 'rgba(99, 132, 255, 0.6)',
              borderColor: 'rgba(99, 132, 255, 0.6)',
              fill: false
            }
          ]
        }
      }
  }
    

  static getDerivedStateFromProps(props, state) {
        let data = {
          labels: props.data.time,
          datasets:[
            {
              label:'Distance (m)',
              data:props.data.distance,
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 155, 132, 0.6)',
              fill: false
            },
            {
              label:'Winsor (m)',
              data:props.data.winsor,
              backgroundColor: 'rgba(99, 132, 255, 0.6)',
              borderColor: 'rgba(99, 255, 55, 0.6)',
              fill: false
            },
            {
              label:'Henderson (m)',
              data:props.data.henderson,
              backgroundColor: 'rgba(255, 132, 255, 0.6)',
              borderColor: 'rgba(255, 255, 55, 0.6)',
              fill: false
            },
            {
              label:'Kalman (m)',
              data:props.data.kalman,
              backgroundColor: 'rgba(99, 132, 255, 0.6)',
              borderColor: 'rgba(99, 132, 255, 0.6)',
              fill: false
            }
          ]
        }

        state.chartData = data;
    }

    render() {
        return(
            <div className="chart">
                <Line
                    ref={chart => this.chart = chart}
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
                                },
                                animation: {
                                  duration: 0,
                                  easing: 'easeInOutBack'
                                }
                              }}
                      redraw
                    />

            </div>
        )
    }

}

export default DistanceChart;