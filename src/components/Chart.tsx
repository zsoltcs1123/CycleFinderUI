// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsxRuntime classic */
/** @jsx jsx */

import * as React from 'react';
import { createChart, BarData, PriceLineOptions, LineStyle, IPriceLine } from 'lightweight-charts';
import axios from 'axios';
import ClipLoader from "react-spinners/ClipLoader";
import { css, jsx } from '@emotion/react'
import { ChartContext } from '../context/ChartProvider';
import IChartTool from '../types/IChartTool';
import { generateFullUrl, generateParameters, getUrl } from '../ApiFunctions';
import { AnalysisType } from '../types/IAnalysisFunction';

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
const defaultPriceLinesMap: Map<string, IPriceLine[]> = new Map<string, IPriceLine[]>();

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
  const { setBardata } = React.useContext(ChartContext);

  const [priceLinesMap, setPriceLinesMap]: [Map<string, IPriceLine[]>, (priceLinesMap: Map<string, IPriceLine[]>) => void] = React.useState(defaultPriceLinesMap);
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
        setBardata(response.data)
  
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

  function getStaticLevels(url: string, toolId: string){
    setLoading(true);
  
    axios
  
      .get<PriceLineOptions[]>(url, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {

        const priceLines = [];
        const pLineMap = priceLinesMap;
  
        for (let i = 0; i < response.data.length; i++) {
          const line =
            candleSeries.createPriceLine({
                price: response.data[i].price,
                color: response.data[i].color,
                lineWidth: response.data[i].lineWidth,
                lineStyle: LineStyle.Dashed,
                axisLabelVisible: true,
                title: ""
            });
            priceLines.push(line);
        }

        pLineMap.set(toolId, priceLines);
        setPriceLinesMap(pLineMap)
  
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

    if (symbol == "") {
      setLoading(false)
      return;
    }

    getAllData(generateFullUrl(AnalysisType.BarData, [
      {id: 'symbol', value: symbol},
      {id: 'timeFrame', value: "1d"},
    ]))

  }, [symbol]);

  React.useEffect(() => {
    const newTool = chartTools.find(t => currentTools.findIndex(ct => ct.id == t.id) == -1);

    if (newTool != undefined && newTool.fn.type == AnalysisType.W24_levels){
      getStaticLevels(generateFullUrl(newTool.fn.type, newTool.fn.parameters), newTool.id)
    }

    const oldTool = currentTools.find(t => chartTools.findIndex(ct => ct.id == t.id) == -1);

    if (oldTool != undefined && oldTool.fn.type == AnalysisType.W24_levels){
      const pLineMap = priceLinesMap;

      const plines = pLineMap.get(oldTool.id) as IPriceLine[];
      plines.forEach(pl => candleSeries.removePriceLine(pl))

      pLineMap.delete(oldTool.id);
      setPriceLinesMap(pLineMap);
    }

    setCurrentTools(chartTools)
  }, [chartTools]) 

  return <div>
    {isLoading
      ? <ClipLoader loading={isLoading} css={override} size={300} />
      : <div ref={(nodeElement) => { nodeElement && nodeElement.appendChild(chartDiv) }} />}
  </div>
}