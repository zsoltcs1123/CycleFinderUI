// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsxRuntime classic */
/** @jsx jsx */

import * as React from 'react';
import IChartTool from '../types/IChartTool';
import { css, jsx } from '@emotion/react'
import PropTypes from 'prop-types';
import { ChartContextState } from '../types/ChartContextState';

const contextDefaultValues: ChartContextState = {
    chartTools: [],
    addChartTool: () => { /*initialize*/ }
};

export const ChartContext = React.createContext<ChartContextState>(
    contextDefaultValues
);

const ChartProvider: React.FC = ({ children }) => {
    const [chartTools, setChartTools] = React.useState<IChartTool[]>([]);

    const addChartTool = (tool: IChartTool) => {
        if (chartTools.some(t => t.id == tool.id)){
            alert("This tool is already added");
            return;
        }
        setChartTools([...chartTools, tool])
    }

    return (
        <ChartContext.Provider
            value={{
                chartTools,
                addChartTool
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