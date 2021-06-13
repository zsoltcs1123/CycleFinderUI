import * as React from 'react';
import { createChart } from 'lightweight-charts';

export default function Chart(){

    const chartProterties = {
        width:1200,
        height:800,
        timeScale:{
            timeVisible:true,
            secondsVisible:false,
        }
    }

    const chartDiv = document.createElement('div')

    const chart = createChart(chartDiv, chartProterties);
    const lineSeries = chart.addLineSeries();
    lineSeries.setData([
        { time: '2019-04-11', value: 80.01 },
        { time: '2019-04-12', value: 96.63 },
        { time: '2019-04-13', value: 76.64 },
        { time: '2019-04-14', value: 81.89 },
        { time: '2019-04-15', value: 74.43 },
        { time: '2019-04-16', value: 80.01 },
        { time: '2019-04-17', value: 96.63 },
        { time: '2019-04-18', value: 76.64 },
        { time: '2019-04-19', value: 81.89 },
        { time: '2019-04-20', value: 74.43 },
    ]);

     return <div ref={(nodeElement) => {nodeElement && nodeElement.appendChild(chartDiv)}}/>
}