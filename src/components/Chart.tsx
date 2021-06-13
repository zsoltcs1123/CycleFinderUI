// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsxRuntime classic */
/** @jsx jsx */

import * as React from 'react';
import { createChart, BarData } from 'lightweight-charts';
import axios from 'axios';
import ClipLoader from "react-spinners/ClipLoader";
import { css, jsx } from '@emotion/react'

interface IChartProps{
    symbol?: string;
}

const override = css` 
  display: block;
  margin: 0 auto;
  border-color: blue;
`;

export default function Chart({symbol: string}: IChartProps){

    const defaultData: BarData[] = [];

    //Todo  for some reason, this function is called 3 times by the runtime. Thus creating 2 empty unneccessary divs
    //solution is probably to pass this div as parameter and do not create here
    const chartDiv = document.createElement('div')

    const [data, setData]: [BarData[], (symbols: BarData[]) => void] = React.useState(defaultData);

    //TODO loading code is duplicated in all components. figure smth out
    const [isLoading, setLoading]: [boolean, (loading: boolean) => void] = React.useState<boolean>(true);

    const chartProterties = {
        width:1200,
        height:800,
        timeScale:{
            timeVisible:true,
            secondsVisible:false,
        }
    }

    React.useEffect(() => {
        axios
        
        .get<BarData[]>(`https://localhost:5001/api/CandleStick/GetAllData?symbol=BTCUSDT&timeFrame=1d`, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          setData(response.data)

          const chart = createChart(chartDiv, chartProterties);
          const candleSeries = chart.addCandlestickSeries();
          candleSeries.setData(response.data)

          chart.applyOptions({
            crosshair: {
                mode: 0,
            },
        });
        
          setLoading(false);
        })
        .catch(ex => {
          if (ex.response) {
            // client received an error response (5xx, 4xx)
          } else if (ex.request) {
            // client never received a response, or request never left
          } else {
            // anything else
          }
          setLoading(false);
        });
      }, []);

     return <div ref={(nodeElement) => {nodeElement && nodeElement.appendChild(chartDiv)}}>
       <ClipLoader loading={isLoading} css={override}  size={150} />
     </div>
}