// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsxRuntime classic */
/** @jsx jsx */

import * as React from 'react';
import { createChart, BarData, PriceLineOptions, LineStyle } from 'lightweight-charts';
import axios from 'axios';
import ClipLoader from "react-spinners/ClipLoader";
import { css, jsx } from '@emotion/react'
import { ChartContext } from '../context/ChartProvider';
import IChartTool from '../types/IChartTool';
import { getAllDataUrl, getW24LevelsUrl } from '../ApiFunctions';

const override = css` 
  display: block;
  margin: 0 auto;
  border-color: blue;
`;

const chartProterties = {
  width: 1400,
  height: 800,
  timeScale: {
    timeVisible: true,
    secondsVisible: false,
  }
}

const defaultData: BarData[] = [];
const defaultPriceLines: PriceLineOptions[] = [];

const chartDiv = document.createElement('div')
chartDiv.setAttribute("id", 'tvchart')

const chart = createChart(chartDiv, chartProterties);

chart.applyOptions({
  crosshair: {
    mode: 0,
  },
  watermark: {
    color: 'rgba(11, 94, 29, 0.4)',
    visible: true,
    fontSize: 24,
    horzAlign: 'left',
    vertAlign: 'bottom',
  },
});


const candleSeries = chart.addCandlestickSeries();




export default function Chart() {

  const { chartTools } = React.useContext(ChartContext);
  const { symbol } = React.useContext(ChartContext);

  const [data, setData]: [BarData[], (data: BarData[]) => void] = React.useState(defaultData);
  const [priceLines, setPriceLines]: [PriceLineOptions[], (priceLines: PriceLineOptions[]) => void] = React.useState(defaultPriceLines);
  const [currentTools, setCurrentTools]: [IChartTool[], (activeTools: IChartTool[]) => void] = React.useState([] as IChartTool[])

  //TODO loading code is duplicated in all components. figure smth out
  const [isLoading, setLoading]: [boolean, (loading: boolean) => void] = React.useState<boolean>(true);

  //TODO refactor api calls into a hook
  function getAllData(url: string){
    setLoading(true);
  
    axios
  
      .get<BarData[]>(url, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        setData(response.data)
  
        candleSeries.setData(response.data)
  
        chart.applyOptions({
          watermark: {
            text: symbol,
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
  }

  function getStaticLevels(url: string){
    setLoading(true);
  
    axios
  
      .get<PriceLineOptions[]>(url, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        setPriceLines(response.data)
  
        for (let i = 0; i < response.data.length; i++) {
            candleSeries.createPriceLine({
                price: response.data[i].price,
                color: response.data[i].color,
                lineWidth: response.data[i].lineWidth,
                lineStyle: LineStyle.Dashed,
                axisLabelVisible: true,
                title: ""
            });
        }
  
        chart.applyOptions({
          watermark: {
            text: symbol,
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
  }

  React.useEffect(() => {

    getAllData(getAllDataUrl(symbol))

  }, [symbol]);

  React.useEffect(() => {
    const newTool = chartTools.find(t => currentTools.findIndex(ct => ct.id == t.id) == -1);

    if (newTool != undefined && newTool.id == "W24 levels"){
      getStaticLevels(getW24LevelsUrl(50000, 1000))
    }

    setCurrentTools(chartTools)
  }, [chartTools]) 

  return <div>
    {isLoading
      ? <ClipLoader loading={isLoading} css={override} size={300} />
      : <div ref={(nodeElement) => { nodeElement && nodeElement.appendChild(chartDiv) }} />}
  </div>
}