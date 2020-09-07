import React, { Component } from 'react'
import { Line } from 'react-chartjs-2';

class KalmanChart extends Component {

    constructor (props) {
        super(props);
        this.state = {
          chartData: {
              labels: this.props.time,
              datasets:[
                {
                  label:'Filtered Distance (m)',
                  data:this.props.distance,
                  backgroundColor: 'rgba(255, 99, 132, 0.6)'
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
                    options={{ maintainAspectRatio: true, responsive: true }}
                    />
            </div>
        )
    }

}

export default KalmanChart;