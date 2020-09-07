import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2';



class RssiChart extends Component {

    constructor (props) {
        super(props);
        this.chartReference = {};
        this.state = {
          chartData: {
              labels: this.props.time,
              datasets:[
                {
                  label:'RSSI',
                  data:this.props.rssi,
                  backgroundColor: 'rgba(255, 99, 132, 0.6)'
                }
              ]
            }
          }
    }

    render() {
        return(
            <div className="chart">
                <Bar
                    data={this.state.chartData}
                    options={{ maintainAspectRatio: true, responsive: true }}
                    />
            </div>
        )
    }

}

export default RssiChart;