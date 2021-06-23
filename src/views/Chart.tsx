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
import { generateFullUrl } from '../api/ApiFunctions';
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

const defaultPriceLinesMap: Map<string, [IPriceLine[], PriceLineOptions[]]> = new Map<string, [IPriceLine[], PriceLineOptions[]]>();

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

  const [priceLinesMap, setPriceLinesMap]: 
    [Map<string, [IPriceLine[], PriceLineOptions[]]>, (priceLinesMap: Map<string, [IPriceLine[], PriceLineOptions[]]>) => void] 
      = React.useState(defaultPriceLinesMap);

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

        generatePriceLines(toolId, response.data)
  
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

  function generatePriceLines(toolId: string, plos: PriceLineOptions[]){
    const priceLines = [];
    const pLineMap = priceLinesMap;

    for (let i = 0; i < plos.length; i++) {
      const line =
        candleSeries.createPriceLine({
            price: plos[i].price,
            color: plos[i].color,
            lineWidth: plos[i].lineWidth,
            lineStyle: LineStyle.Dashed,
            axisLabelVisible: true,
            title: ""
        });
        priceLines.push(line);
    }

    if (pLineMap.has(toolId)){
      pLineMap.delete(toolId);
    }

    pLineMap.set(toolId, [priceLines, plos]);
    setPriceLinesMap(pLineMap)
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
    const newTools = chartTools.filter(t => currentTools.findIndex(ct => ct.id == t.id) == -1);
    newTools.forEach(handleNewTool)

    const oldTools = currentTools.filter(t => chartTools.findIndex(ct => ct.id == t.id) == -1);
    oldTools.forEach(handleOldTool)

    handleActiveStatusChanged();

    setCurrentTools(chartTools)
  }, [chartTools]) 


  function handleNewTool(tool: IChartTool | undefined){
    if (tool != undefined && tool.isActive && tool.fn.type == AnalysisType.W24_levels){
      getStaticLevels(generateFullUrl(tool.fn.type, tool.fn.parameters), tool.id)
    }
  }

  function handleOldTool(tool: IChartTool | undefined){
    if (tool != undefined && tool.fn.type == AnalysisType.W24_levels){
      const pLineMap = priceLinesMap;

      const plines = (pLineMap.get(tool.id) as [IPriceLine[], PriceLineOptions[]])[0];
      plines.forEach(pl => candleSeries.removePriceLine(pl))

      pLineMap.delete(tool.id);
      setPriceLinesMap(pLineMap);
    }
  }

  function handleActiveStatusChanged(){
    const updatedTool = chartTools.find(t => currentTools.find(ct => ct.id == t.id && ct.isActive != t.isActive));

    if (updatedTool != undefined && updatedTool.fn.type == AnalysisType.W24_levels){
      const plines = (priceLinesMap.get(updatedTool.id) as [IPriceLine[], PriceLineOptions[]]);

      if (!updatedTool.isActive){
        plines[0].forEach(pl => candleSeries.removePriceLine(pl))
      }
      else{
        generatePriceLines(updatedTool.id, plines[1]);
      }
    }
  }


  return <div>
    {isLoading
      ? <ClipLoader loading={isLoading} css={override} size={300} />
      : <div ref={(nodeElement) => { nodeElement && nodeElement.appendChild(chartDiv) }} />}
  </div>
}