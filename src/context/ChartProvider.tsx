// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsxRuntime classic */
/** @jsx jsx */

import * as React from 'react';
import IChartTool, { ChartTool } from '../types/IChartTool';
import { css, jsx } from '@emotion/react'
import PropTypes from 'prop-types';
import { ChartContextState } from '../types/ChartContextState';
import { BarData } from 'lightweight-charts';
import { Increment, MaxValue } from '../api/ApiFunctions';
import { calculateIncrement, calculateMaxValue } from '../utils/ChartUtils';
import { AnalysisType } from '../types/IAnalysisFunction';

const contextDefaultValues: ChartContextState = {
    symbol: "",
    setSymbol: () => {/* initialize */},

    chartTools: [],
    addChartTool: () => { /*initialize */ },
    removeChartTool: () => { /*initialize */ },
    updateChartTool: () => { /*initialize */ },

    barData: [],
    setBardata: () => { /*initialize */ },
};

export const ChartContext = React.createContext<ChartContextState>(
    contextDefaultValues
);

const ChartProvider: React.FC = ({ children }) => {
    const [symbol, setCurrentSymbol] = React.useState<string>("");
    const [chartTools, setChartTools] = React.useState<IChartTool[]>([]);
    const [data, setData] = React.useState<BarData[]>([]);

    const setSymbol = (symbol: string) => {
        setCurrentSymbol(symbol);
    }

    const addChartTool = (tool: IChartTool) => {
        if (chartTools.some(t => t.fn.type == tool.fn.type && t.fn.type == AnalysisType.W24_levels)){
            alert("This tool is already added");
            return;
        }
        if (chartTools.some(t => t.id == tool.id)){
            alert("Tool with the same id is already added");
            return;
        }
        setChartTools(chartTools.concat(tool))
    }

    const removeChartTool = (tool: IChartTool) => {
        setChartTools(chartTools.filter(t => t.id != tool.id))
    }

    const updateChartTool = (tool: IChartTool) => {
        const newTools = chartTools.slice();
        const index = newTools.findIndex(t => t.id == tool.id);
        newTools.splice(index, 1);
        newTools.push(tool);
        setChartTools(newTools);
    }

    const setBardata = (data: BarData[]) => {
        const updatedTools = chartTools.map(t => {
            const params = t.fn.parameters.map(p => { 
                return {id: p.id, value: (p.id == Increment ? calculateIncrement(data) : p.id == MaxValue ? calculateMaxValue(data) : p.value).toString()}
            })
            return new ChartTool({id: t.fn.id, type: t.fn.type, parameters: params}, t.isActive);
        })
        setData(data);
        setChartTools(updatedTools);
    }

    return (
        <ChartContext.Provider
            value={{
                symbol,
                setSymbol,
                chartTools,
                addChartTool,
                removeChartTool,
                updateChartTool,
                barData: data,
                setBardata
            }}
        >
            {children}
        </ChartContext.Provider>
    );
}

ChartProvider.propTypes = {
    children: PropTypes.node,
}

export default ChartProvider;