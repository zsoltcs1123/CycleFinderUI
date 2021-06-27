// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsxRuntime classic */
/** @jsx jsx */

import * as React from 'react';
import { createChart, BarData, PriceLineOptions, LineStyle, IPriceLine, SeriesMarker, Time, UTCTimestamp, SeriesMarkerPosition, SeriesMarkerShape, ISeriesApi } from 'lightweight-charts';
import axios from 'axios';
import ClipLoader from "react-spinners/ClipLoader";
import { css, jsx } from '@emotion/react'
import { ChartContext } from '../context/ChartProvider';
import IChartTool from '../types/IChartTool';
import { generateFullUrl } from '../api/ApiFunctions';
import { AnalysisType } from '../types/IAnalysisFunction';
import ICandleMarker from '../types/ICandleMarker';
import IPlanetaryLine from '../types/IPlanetaryLine';

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

const defaultPriceLinesMap: Map<string, [IPriceLine[], PriceLineOptions[]]> = new Map();
const defaultMarkersMap: Map<IChartTool, SeriesMarker<Time>[]> = new Map();
const defaultPlanetaryLinesMap: Map<IChartTool, [IPlanetaryLine, ISeriesApi<"Line">][]> = new Map();

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

  const [markersMap, setMarkersMap]:
    [Map<IChartTool, SeriesMarker<Time>[]>, (markersMap: Map<IChartTool, SeriesMarker<Time>[]>) => void]
    = React.useState(defaultMarkersMap);

  const [planetaryLinesMap, setPlanetaryLinesMap]:
    [Map<IChartTool, [IPlanetaryLine, ISeriesApi<"Line">][]>, (planetaryLinesMap: Map<IChartTool, [IPlanetaryLine, ISeriesApi<"Line">][]>) => void]
    = React.useState(defaultPlanetaryLinesMap);


  const [currentTools, setCurrentTools]: [IChartTool[], (activeTools: IChartTool[]) => void] = React.useState([] as IChartTool[])

  //TODO loading code is duplicated in all components. figure smth out
  const [isLoading, setLoading]: [boolean, (loading: boolean) => void] = React.useState<boolean>(true);

  //TODO refactor api calls into a hook
  function getAllData(url: string) {
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

  function getStaticLevels(url: string, toolId: string) {
    setLoading(true);

    axios

      .get<PriceLineOptions[]>(url, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {

        generatePriceLines(toolId, response.data)

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

  function getMarkers(url: string, tool: IChartTool) {
    setLoading(true);

    axios

      .get<ICandleMarker[]>(url, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {

        const markers: SeriesMarker<Time>[] = response.data.filter(l => !l.isInTheFuture).map(d => {
          return {
            time: d.time as UTCTimestamp,
            position: d.position as SeriesMarkerPosition,
            color: d.color,
            shape: d.shape as SeriesMarkerShape,
            text: d.text,
          }
        });

        const mMap = markersMap;
        mMap.set(tool, markers);
        setMarkersMap(mMap);
        applyMarkers();

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

  function applyMarkers() {
    candleSeries.setMarkers([]);

    const markers: SeriesMarker<Time>[] = [];

    for (const [k, v] of markersMap) {
      if (k.isActive) {
        markers.push(...v);
      }
    }

    markers.sort((m1, m2) => (m1.time > m2.time) ? 1 : -1)
    candleSeries.setMarkers(markers);
  }

  function generatePriceLines(toolId: string, plos: PriceLineOptions[]) {
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

    if (pLineMap.has(toolId)) {
      pLineMap.delete(toolId);
    }

    pLineMap.set(toolId, [priceLines, plos]);
    setPriceLinesMap(pLineMap)
  }

  function getPlanetaryLines(url: string, tool: IChartTool) {
    setLoading(true);

    axios

      .get<IPlanetaryLine[]>(url, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {

        const pMap = planetaryLinesMap;
        const lines: [IPlanetaryLine, ISeriesApi<"Line">][] = []

        response.data.forEach(line => {
          const lineSeries = chart.addLineSeries({
            color: line.color,
            lineWidth: 2,
            priceLineVisible: false
          });
          lines.push([line, lineSeries]);
        })
        

        pMap.set(tool, lines);
        setPlanetaryLinesMap(pMap);
        applyPlanetaryLines();

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

  function applyPlanetaryLines() {

    for (const [k, v] of planetaryLinesMap) {
      if (k.isActive) {
        v.forEach(line => {
          line[1].setData(line[0].lineValues);
        })
      }
      else{
        v.forEach(line => {
          line[1].setData([]);
        })
      }
    }
  }

  React.useEffect(() => {

    if (symbol == "") {
      setLoading(false)
      return;
    }

    getAllData(generateFullUrl(AnalysisType.BarData, [
      { id: 'symbol', value: symbol },
      { id: 'timeFrame', value: "1d" },
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


  function handleNewTool(tool: IChartTool | undefined) {
    if (tool != undefined && tool.isActive) {
      if (tool.fn.type == AnalysisType.W24_levels) {
        getStaticLevels(generateFullUrl(tool.fn.type, tool.fn.parameters), tool.id)
      }
      if (tool.fn.type == AnalysisType.Retrogrades) {
        getMarkers(generateFullUrl(tool.fn.type, tool.fn.parameters), tool)
      }
      if (tool.fn.type == AnalysisType.W24_planetary_lines) {
        getPlanetaryLines(generateFullUrl(tool.fn.type, tool.fn.parameters), tool)
      }
    }
  }

  function handleOldTool(tool: IChartTool | undefined) {
    if (tool != undefined) {
      if (tool.fn.type == AnalysisType.W24_levels) {
        const pLineMap = priceLinesMap;

        const plines = (pLineMap.get(tool.id) as [IPriceLine[], PriceLineOptions[]])[0];
        plines.forEach(pl => candleSeries.removePriceLine(pl))

        pLineMap.delete(tool.id);
        setPriceLinesMap(pLineMap);
      }

      if (tool.fn.type == AnalysisType.Retrogrades) {
        const mMap = markersMap;

        for (const k of mMap.keys()) {
          if (k.id == tool.id)
            mMap.delete(k);
        }

        setMarkersMap(mMap);
        applyMarkers();
      }

      if (tool.fn.type == AnalysisType.W24_planetary_lines) {
        const pMap = planetaryLinesMap;

        for (const [k, v] of pMap) {
          if (k.id == tool.id){
            v.forEach(line => {
              chart.removeSeries(line[1]);
            })
            pMap.delete(k);
          }
        }
        setPlanetaryLinesMap(pMap);
      }
    }
  }

  function handleActiveStatusChanged() {
    const updatedTool = chartTools.find(t => currentTools.find(ct => ct.id == t.id && ct.isActive != t.isActive));

    if (updatedTool != undefined) {
      if (updatedTool.fn.type == AnalysisType.W24_levels) {
        const plines = (priceLinesMap.get(updatedTool.id) as [IPriceLine[], PriceLineOptions[]]);

        if (!updatedTool.isActive) {
          plines[0].forEach(pl => candleSeries.removePriceLine(pl))
        }
        else {
          generatePriceLines(updatedTool.id, plines[1]);
        }
      }

      if (updatedTool.fn.type == AnalysisType.Retrogrades) {
        const mMap = markersMap;
        for (const [k, v] of mMap) {
          if (k.id == updatedTool.id) {
            k.isActive = updatedTool.isActive;
          }
        }
        setMarkersMap(mMap);
        applyMarkers();
      }

      if (updatedTool.fn.type == AnalysisType.W24_planetary_lines) {
        const pMap = planetaryLinesMap;
        for (const [k, v] of pMap) {
          if (k.id == updatedTool.id) {
            k.isActive = updatedTool.isActive;
          }
        }
        setPlanetaryLinesMap(pMap);
        applyPlanetaryLines();
      }
    }
  }


  return <div>
    {isLoading
      ? <ClipLoader loading={isLoading} css={override} size={300} />
      : <div ref={(nodeElement) => { nodeElement && nodeElement.appendChild(chartDiv) }} />}
  </div>
}